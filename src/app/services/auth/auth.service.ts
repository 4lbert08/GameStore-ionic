import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {FirestoreService} from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  firestore: FirestoreService = inject(FirestoreService);
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null>;

  constructor() {
    this.user$ = this.userSubject.asObservable();
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user);
      this.userSubject.next(user);
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

  userId?: string;
  getCurrentUserId() {
    this.getCurrentUser().subscribe(user => {
      this.userId = user?.uid
    });
    return this.userId;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }
}
