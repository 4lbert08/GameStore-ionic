import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  collectionData,
  getDocs
} from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../firestore/firestore.service';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LikedGameService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isWeb: boolean = true;
  private readonly DB_NAME = 'likedGamesDB';

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private firestoreService: FirestoreService,
    private platform: Platform
  ) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.init();
  }

  private async init() {
    await this.platform.ready();
    this.isWeb = Capacitor.getPlatform() === 'web';

    if (!this.isWeb) {
      try {
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          false,               // encrypted
          'no-encryption',     // mode
          1,                   // version
          false                // readonly
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
    const userId = this.auth.getCurrentUserId();
    if (!userId || !this.db) return;

    try {
      const likedGamesCollection = collection(this.firestore, `/users/${userId}/likedGames`);
      const querySnapshot = await getDocs(likedGamesCollection);

      for (const docSnap of querySnapshot.docs) {
        const gameId = docSnap.id;
        // Inserta o reemplaza en SQLite para sincronizar
        await this.db.run(`INSERT OR REPLACE INTO likedGames (id) VALUES (?)`, [gameId]);
      }
    } catch (error) {
      console.error('Error sincronizando favoritos desde Firestore a SQLite:', error);
    }
  }

  async isGameLiked(gameId: string): Promise<boolean> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) return false;

    if (this.isWeb) {
      const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
      const snapshot = await getDoc(gameDocRef);
      return snapshot.exists();
    } else if (this.db) {
      const res = await this.db.query(`SELECT id FROM likedGames WHERE id = ?`, [gameId]);
      return !!(res.values && res.values.length > 0);
    }
    return false;
  }

  async likeGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) return;

    if (this.isWeb) {
      const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
      await setDoc(gameDocRef, { likedAt: new Date() });
    } else if (this.db) {
      await this.db.run(`INSERT OR REPLACE INTO likedGames (id) VALUES (?)`, [gameId]);
      try {
        const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
        await setDoc(gameDocRef, { likedAt: new Date() });
      } catch (error) {
        console.error('Error sincronizando favorito en Firestore:', error);
      }
    }
  }

  async removeLikedGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) return;

    if (this.isWeb) {
      const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
      await deleteDoc(gameDocRef);
    } else if (this.db) {
      await this.db.run(`DELETE FROM likedGames WHERE id = ?`, [gameId]);
      try {
        const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
        await deleteDoc(gameDocRef);
      } catch (error) {
        console.error('Error sincronizando eliminación en Firestore:', error);
      }
    }
  }

  getLikedGames(): Observable<Game[]> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) return of([]);

    if (this.isWeb) {
      const likedGamesCollection = collection(this.firestore, `/users/${userId}/likedGames`);

      return collectionData(likedGamesCollection, { idField: 'id' }).pipe(
        switchMap(likedGames => {
          const gameIds = likedGames.map(item => item.id);
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
}
