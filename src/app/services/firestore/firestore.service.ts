import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  where,
  QueryConstraint,
  setDoc,
  updateDoc, addDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Game } from '../../models/game';
import { Developer } from '../../models/developer';
import { Review } from '../../models/review';
import { UserData } from '../../models/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {Order} from "../../models/order";


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private userSubject = new BehaviorSubject<UserData | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private firestore: Firestore) {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log('Auth user detected, UID:', authUser.uid);
        const userDocRef = doc(this.firestore, `users/${authUser.uid}`);
        docData(userDocRef, { idField: 'id' }).subscribe((userData) => {
          console.log('User data loaded:', userData);
          this.userSubject.next(userData!.id);
        });
      } else {
        console.log('No auth user detected, setting user to null');
        this.userSubject.next(null);
      }
    });
  }

  getGames(filters: { [key: string]: any } = {}): Observable<Game[]> {
    const gameRef = collection(this.firestore, 'games');
    const queryConstraints: QueryConstraint[] = this.buildQueryConstraints(filters);
    const q = query(gameRef, ...queryConstraints);
    return collectionData(q, { idField: 'id' }) as Observable<Game[]>;
  }

  private buildQueryConstraints(filters: { [key: string]: any }): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (filters['platform']) {
      constraints.push(where('platform', '==', filters['platform']));
    }
    if (filters['system']) {
      constraints.push(where('system', '==', filters['system']));
    }
    if (filters['genre']) {
      constraints.push(where('genres', 'array-contains', filters['genre']));
    }
    if (filters['pegi']) {
      constraints.push(where('pegi', '==', filters['pegi']));
    }
    if (filters['inStock'] !== undefined) {
      constraints.push(where('stock', '==', filters['inStock']));
    }
    if (filters['minPrice'] !== undefined) {
      constraints.push(where('amount', '>=', filters['minPrice']));
    }
    if (filters['maxPrice'] !== undefined) {
      constraints.push(where('amount', '<=', filters['maxPrice']));
    }
    if (filters['searchTerm']) {
      constraints.push(where('name', '>=', filters['searchTerm']));
      constraints.push(where('name', '<=', filters['searchTerm'] + '\uf8ff'));
    }

    return constraints;
  }

  getGameById(gameId: string | undefined): Observable<Game> {
    const gameDocRef = doc(this.firestore, `games/${gameId}`);
    return docData(gameDocRef, { idField: 'id' }) as Observable<Game>;
  }

  getDevelopers(): Observable<Developer[]> {
    const developerRef = collection(this.firestore, 'developers');
    return collectionData(developerRef, { idField: 'id' }) as Observable<Developer[]>;
  }

  getUserById(userId: string): Observable<UserData> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<UserData>;
  }

  getReviewsFromGame(gameId: string): Observable<Review[]> {
    return collectionData(
      query(collection(this.firestore, 'reviews'), where('gameId', '==', gameId)),
      { idField: 'id' }
    ) as Observable<Review[]>;
  }

  getReviewsFromUser(userId: string): Observable<Review[]> {
    return collectionData(
      query(collection(this.firestore, 'reviews'), where('userId', '==', userId)),
      { idField: 'id' }
    ) as Observable<Review[]>;
  }

  addUser(user: UserData, id: string) {
    const userRef = doc(this.firestore, `users/${id}`);
    return setDoc(userRef, user);
  }

  loadUser(userId: string) {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<UserData>;
  }

  updateUser(id: string | undefined, user: Partial<UserData>) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, user);
  }

  getOrdersFromUser(userId: string | undefined): Observable<Order[]> {
    return collectionData(
      query(collection(this.firestore, 'orders'), where('userId', '==', userId)),
      { idField: 'id' }
    ) as Observable<Order[]>;
  }


  addReview(review: Review) {
    const reviewsRef = collection(this.firestore, 'reviews');
    return addDoc(reviewsRef, review);
  }

  setUser(user: UserData | null) {
    console.log('Guardando datos del usuario en el store:', user);
    this.userSubject.next(user);
  }

  clearUser() {
    console.log('Limpiando datos del usuario en el store');
    this.userSubject.next(null);
  }

}
