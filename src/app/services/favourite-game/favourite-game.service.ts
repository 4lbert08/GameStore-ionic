import {inject, Injectable} from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  collectionData,
  getDocs, onSnapshot
} from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import {BehaviorSubject, catchError, combineLatest, map, of, switchMap, Subject} from 'rxjs';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import {User} from "firebase/auth";
import {UserData} from "../../models/user";
import {Auth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root',
})
export class LikedGameService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  isWeb: boolean = true;
  private readonly DB_NAME = 'likedGamesDB';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();
  userId : String | undefined = "";
  private favoritesChangedSubject = new Subject<{gameId: string, isLiked: boolean}>();
  public favoritesChanged$ = this.favoritesChangedSubject.asObservable();

  private likedGamesSubject = new BehaviorSubject<Game[]>([]);
  public likedGames$ = this.likedGamesSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private auth :Auth,
    private firestoreService: FirestoreService,
    private platform: Platform
  ) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.init();
    this.auth.onAuthStateChanged(
      (user: User | null) => {
        this.userId = user?.uid;
        console.log('Estado de autenticación cambió, usuario:', user);
        this.userSubject.next(user);
        if (user) {
          this.firestoreService.getUserById(user.uid).subscribe({
            next: (userData: UserData) => {
              console.log('Datos de Firestore cargados exitosamente:', userData);
              this.firestoreService.setUser(userData);
              this.loadLikedGames();
            },
            error: (error) => {
              console.error('Error al cargar datos de Firestore para el usuario:', error);
              this.firestoreService.setUser(null);
            },
          });
        } else {
          console.log('No hay usuario autenticado');
          this.firestoreService.clearUser();
          this.likedGamesSubject.next([]);
        }
      },
      (error) => {
        console.error('Error en el estado de autenticación:', error);
        this.userSubject.next(null);
        this.firestoreService.clearUser();
      }
    );
  }

  private async init() {
    await this.platform.ready();
    this.isWeb = Capacitor.getPlatform() === 'web';

    if (!this.isWeb) {
      try {
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          false,
          'no-encryption',
          1,
          false
        );
        await this.db.open();
        await this.createTableIfNotExists();
        await this.syncFavoritesFromFirestore();
      } catch (error) {
        console.error('SQLite Init Error:', error);
      }
    }
  }

  private async createTableIfNotExists() {
    if (!this.db) return;
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS likedGames (
        id TEXT PRIMARY KEY
      )
    `;
    await this.db.execute(createTableQuery);
  }

  private async syncFavoritesFromFirestore() {
    if (!this.userId || !this.db) return;

    try {
      const likedGamesCollection = collection(this.firestore, `/users/${this.userId}/likedGames`);
      const querySnapshot = await getDocs(likedGamesCollection);

      for (const docSnap of querySnapshot.docs) {
        const gameId = docSnap.id;
        await this.db.run(`INSERT OR REPLACE INTO likedGames (id) VALUES (?)`, [gameId]);
      }
    } catch (error) {
      console.error('Error sincronizando favoritos desde Firestore a SQLite:', error);
    }
  }

  async isGameLiked(gameId: string): Promise<boolean> {
    if (!this.userId) return false;

    if (this.isWeb) {
      const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);
      const snapshot = await getDoc(gameDocRef);
      return snapshot.exists();
    } else if (this.db) {
      const res = await this.db.query(`SELECT id FROM likedGames WHERE id = ?`, [gameId]);
      return !!(res.values && res.values.length > 0);
    }
    return false;
  }

  isGameLikedRealtime(gameId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (!this.userId || !this.firestore) {
        observer.next(false);
        observer.complete();
        return;
      }

      const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);

      const unsubscribe = onSnapshot(gameDocRef, (docSnap) => {
        observer.next(docSnap.exists());
      }, (error) => {
        console.error('Error in real-time favorite check:', error);
        observer.next(false);
      });

      return unsubscribe;
    });
  }

  async likeGame(gameId: string): Promise<void> {
    if (!this.userId) return;

    try {
      if (this.isWeb) {
        const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);
        await setDoc(gameDocRef, { likedAt: new Date() });
      } else if (this.db) {
        await this.db.run(`INSERT OR REPLACE INTO likedGames (id) VALUES (?)`, [gameId]);
        try {
          const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);
          await setDoc(gameDocRef, { likedAt: new Date() });
        } catch (error) {
          console.error('Error sincronizando favorito en Firestore:', error);
        }
      }

      this.favoritesChangedSubject.next({gameId, isLiked: true});

      this.loadLikedGames();

    } catch (error) {
      console.error('Error al agregar favorito:', error);
      throw error;
    }
  }

  async removeLikedGame(gameId: string): Promise<void> {
    if (!this.userId) return;

    try {
      if (this.isWeb) {
        const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);
        await deleteDoc(gameDocRef);
      } else if (this.db) {
        await this.db.run(`DELETE FROM likedGames WHERE id = ?`, [gameId]);
        try {
          const gameDocRef = doc(this.firestore, `users/${this.userId}/likedGames/${gameId}`);
          await deleteDoc(gameDocRef);
        } catch (error) {
          console.error('Error sincronizando eliminación en Firestore:', error);
        }
      }

      this.favoritesChangedSubject.next({gameId, isLiked: false});

      this.loadLikedGames();

    } catch (error) {
      console.error('Error al quitar favorito:', error);
      throw error;
    }
  }

  private loadLikedGames(): void {
    this.getLikedGames().subscribe({
      next: (games) => {
        this.likedGamesSubject.next(games);
      },
      error: (error) => {
        console.error('Error cargando favoritos:', error);
        this.likedGamesSubject.next([]);
      }
    });
  }

  getLikedGames(): Observable<Game[]> {
    if (this.isWeb) {
      const likedGamesCollection = collection(this.firestore, `/users/${this.userId}/likedGames`);

      return collectionData(likedGamesCollection, { idField: 'id' }).pipe(
        switchMap(likedGames => {
          const gameIds = likedGames.map(item => item.id);
          if (gameIds.length === 0) {
            return of([]);
          }

          const gameObservables = gameIds.map(id => this.firestoreService.getGameById(id));
          return combineLatest(gameObservables).pipe(
            map(games => games.filter(game => game !== null))
          );
        }),
        catchError(error => {
          console.error('Error fetching liked games from Firestore:', error);
          return of([]);
        })
      );
    } else {
      return new Observable<Game[]>(subscriber => {
        this.db?.query(`SELECT id FROM likedGames`)
          .then(res => {
            const gameIds = res.values?.map(row => row.id) || [];
            if (gameIds.length === 0) {
              subscriber.next([]);
              return;
            }

            const gameObservables = gameIds.map(id => this.firestoreService.getGameById(id));
            combineLatest(gameObservables).pipe(
              map(games => games.filter(game => game !== null))
            ).subscribe({
              next: games => subscriber.next(games),
              error: err => {
                console.error('SQLite error:', err);
                subscriber.next([]);
              }
            });
          })
          .catch(err => {
            console.error('SQLite fetch error:', err);
            subscriber.next([]);
          });
      });
    }
  }

  async toggleGameLike(gameId: string): Promise<boolean> {
    const isCurrentlyLiked = await this.isGameLiked(gameId);

    if (isCurrentlyLiked) {
      await this.removeLikedGame(gameId);
      return false;
    } else {
      await this.likeGame(gameId);
      return true;
    }
  }
}
