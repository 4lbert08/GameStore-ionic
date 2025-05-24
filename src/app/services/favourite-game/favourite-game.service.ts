import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  collectionData
} from '@angular/fire/firestore';
import { Game } from '../../models/game';
import { AuthService } from '../auth/auth.service';
import { catchError, combineLatest, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class LikedGameService {
  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private firestoreService: FirestoreService
  ) {}

  async isGameLiked(gameId: string): Promise<boolean> {
    try {
      const userId = this.auth.getCurrentUserId();
      const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
      const snapshot = await getDoc(gameDocRef);
      return snapshot.exists();
    } catch (error) {
      throw error;
    }
  }

  async likeGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User ID is required');
    const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
    await setDoc(gameDocRef, {
      likedAt: new Date(),
    });
  }

  async removeLikedGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    if (!userId) throw new Error('User ID is required');
    const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
    await deleteDoc(gameDocRef);
  }

  getLikedGames(): Observable<Game[]> {
    const userId = this.auth.getCurrentUserId();
    const likedGamesCollection = collection(this.firestore, `/users/${userId}/likedGames`);

    return collectionData(likedGamesCollection, { idField: 'id' }).pipe(
      switchMap(likedGames => {
        console.log('Datos crudos de juegos favoritos: ', likedGames);
        if (likedGames.length === 0) {
          return of([]);
        }
        const gameIds = likedGames.map(item => item.id);
        console.log('IDs de juegos: ', gameIds);
        const gameObservables = gameIds.map(gameId => this.firestoreService.getGameById(gameId));
        return combineLatest(gameObservables).pipe(
          map(games => {
            console.log('Juegos obtenidos: ', games);
            return games.filter(game => game !== null);
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching liked games:', error);
        return of([]);
      })
    );
  }
}
