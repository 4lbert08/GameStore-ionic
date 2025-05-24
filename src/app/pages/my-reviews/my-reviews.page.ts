import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { IonHeader, IonContent, IonFooter, IonLoading, IonCard, IonCardContent, IonText, IonIcon } from '@ionic/angular/standalone';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { UserNavBarComponent } from '../../components/user-nav-bar/user-nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { User } from 'firebase/auth';
import { UserData } from '../../models/user';
import { Review } from '../../models/review';
import { ReviewWithGameInfoComponent } from '../../components/review-with-game-info/review-with-game-info.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';

addIcons({ documentTextOutline });

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    IonLoading,
    IonCard,
    IonCardContent,
    IonText,
    IonIcon,
    MainHeaderComponent,
    UserNavBarComponent,
    FooterComponent,
    ReviewWithGameInfoComponent,
    CommonModule
  ],
  templateUrl: './my-reviews.page.html',
  styleUrl: './my-reviews.page.scss'
})
export class MyReviewsPage implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  firestoreService: FirestoreService = inject(FirestoreService);
  zone: NgZone = inject(NgZone);

  user: User | null = null;
  userData: UserData | null = null;
  userReviews: Review[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const authSub = this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;

        if (this.user) {
          this.loadUserData(this.user.uid);
        } else {
          this.isLoading = false;
          this.error = "No hay usuario autenticado";
        }
      },
      error: (err) => {
        console.error('Error en la autenticación:', err);
        this.isLoading = false;
        this.error = "Error de autenticación";
      }
    });

    this.subscriptions.push(authSub);
  }

  private loadUserData(userId: string): void {
    this.zone.run(() => {
      const userDataSub = this.firestoreService.loadUser(userId).subscribe({
        next: (userData) => {
          this.userData = userData;

          this.loadUserReviews(userId);
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          this.isLoading = false;
          this.error = "Error al cargar datos del usuario";
        }
      });

      this.subscriptions.push(userDataSub);
    });
  }

  private loadUserReviews(userId: string): void {
    this.zone.run(() => {
      const reviewsSub = this.firestoreService.getReviewsFromUser(userId).subscribe({
        next: (reviews) => {
          this.zone.run(() => {
            console.log('Reseñas obtenidas:', reviews);
            this.userReviews = reviews;
            this.isLoading = false;
          });
        },
        error: (err) => {
          console.error('Error al cargar reseñas del usuario:', err);
          this.isLoading = false;
          this.error = "Error al cargar tus reseñas";
        }
      });

      this.subscriptions.push(reviewsSub);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
