import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthService} from "../auth/auth.service";
import {Game} from "../../models/game";

@Injectable({
  providedIn: 'root'
})
export class LikedGameService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  isGameLiked(gameId: string): Observable<boolean> {
    const userId = this.auth.getCurrentUserId();
    const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
    return from(getDoc(gameDocRef)).pipe(map(snapshot => snapshot.exists()));
  }

  async likeGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
    await setDoc(gameDocRef, {
      likedAt: new Date()
    });
  }


  async removeLikedGame(gameId: string): Promise<void> {
    const userId = this.auth.getCurrentUserId();
    const gameDocRef = doc(this.firestore, `users/${userId}/likedGames/${gameId}`);
    await deleteDoc(gameDocRef);
  }

  // Obtiene la lista de juegos favoritos
  async getLikedGames(): Promise<Game[]> {
    const userId = this.auth.getCurrentUserId();
    const likedGamesRef = collection(this.firestore, `users/${userId}/likedGames`);
    const likedSnapshot = await getDocs(likedGamesRef);
    const gameIds = likedSnapshot.docs.map(doc => doc.id);

    if (gameIds.length === 0) {
      return [];
    }

    const games: Game[] = [];
    const batchSize = 10;
    for (let i = 0; i < gameIds.length; i += batchSize) {
      const batchIds = gameIds.slice(i, i + batchSize);
      const gamesRef = collection(this.firestore, 'games');
      const q = query(gamesRef, where('id', 'in', batchIds));
      const gamesSnapshot = await getDocs(q);
      games.push(...gamesSnapshot.docs.map(doc => doc.data() as Game));
    }

    return games;
  }
}
