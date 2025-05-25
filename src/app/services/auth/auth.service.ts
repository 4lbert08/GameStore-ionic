import {inject, Injectable} from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {FirestoreService} from "../firestore/firestore.service";
import {Auth} from "@angular/fire/auth";
import {UserData} from "../../models/user";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();
  private firestore = inject(FirestoreService);

  constructor() {
    this.auth.onAuthStateChanged(
      (user: User | null) => {
        console.log('Estado de autenticación cambió, usuario:', user);
        this.userSubject.next(user);
        if (user) {
          this.firestore.getUserById(user.uid).subscribe({
            next: (userData: UserData) => {
              console.log('Datos de Firestore cargados exitosamente:', userData);
              this.firestore.setUser(userData);
            },
            error: (error) => {
              console.error('Error al cargar datos de Firestore para el usuario:', error);
              this.firestore.setUser(null);
            },
          });
        } else {
          console.log('No hay usuario autenticado');
          this.firestore.clearUser();
        }
      },
      (error) => {
        console.error('Error en el estado de autenticación:', error);
        this.userSubject.next(null);
        this.firestore.clearUser();
      }
    );
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

  getCurrentUserId(): string {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No user authenticated');
    }
    return user.uid;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }
}
