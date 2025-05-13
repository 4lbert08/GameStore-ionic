import {inject, Injectable} from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';
import {user} from '@angular/fire/auth';
import {FirestoreService} from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  firestore: FirestoreService = inject(FirestoreService);
  private auth = getAuth();
  user$: Observable<User | null>;

  constructor() {
    this.user$ = new Observable((subscriber) => {
      onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  }

  async register(email: string, password: string, nickname: string, region: string, birthday: Date) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {

        const userData = {
          email: email,
          nickname: nickname,
          region: region,
          birthday: birthday
        }
        return this.firestore.addUser(userData, userCredential.user.uid);
      }
    } catch (error) {
      console.error("Error in register:", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error in logout", error);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }
}
