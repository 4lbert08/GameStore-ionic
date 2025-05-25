import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LikedGameService } from '../../services/favourite-game/favourite-game.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserData } from '../../models/user';
import { Subject, takeUntil, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit, OnDestroy {
  @Input() gameId: string = '';
  @Input() gameCover: string = '';
  @Input() gameName: string = '';
  @Input() gamePrice: string = '';

  user: UserData | null = null;
  isFavorite: boolean | null = null;
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();
  private subscriptions = new Subscription();
  isAuthenticated$: Observable<boolean>;

  constructor(
    private router: Router,
    private likedGameService: LikedGameService,
    private firestore: FirestoreService,
    private alertController: AlertController,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.add(
      this.likedGameService.favoritesChanged$
        .pipe(takeUntil(this.destroy$))
        .subscribe(change => {
          if (change.gameId === this.gameId) {
            this.isFavorite = change.isLiked;
            this.cdr.detectChanges();
          }
        })
    );

    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authUser) => {
        if (!authUser) {
          this.isFavorite = false;
          this.cdr.detectChanges();
          return;
        }

        this.firestore.user$
          .pipe(takeUntil(this.destroy$))
          .subscribe((userData) => {
            this.user = userData;

            if (this.gameId) {
              this.checkFavoriteStatus();
            } else {
              this.isFavorite = false;
              this.cdr.detectChanges();
            }
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
  }

  private async checkFavoriteStatus(): Promise<void> {
    if (!this.gameId) return;

    try {
      if (this.likedGameService.isWeb) {
        this.subscriptions.add(
          this.likedGameService
            .isGameLikedRealtime(this.gameId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((liked) => {
              this.isFavorite = liked;
              this.cdr.detectChanges();
            })
        );
      } else {
        this.isFavorite = await this.likedGameService.isGameLiked(this.gameId);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
      this.isFavorite = false;
      this.cdr.detectChanges();
    }
  }

  onCardClick(): void {
    if (this.gameId) {
      this.router.navigate(['gamePage', this.gameId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  async toggleFavorite(event: Event): Promise<void> {
    event.stopPropagation();

    if (this.isLoading) return;

    const isAuthenticated = await new Promise<boolean>((resolve) => {
      this.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe((auth) => resolve(auth));
    });

    if (!isAuthenticated) {
      const alert = await this.alertController.create({
        header: 'Inicia Sesión',
        message: 'Debes iniciar sesión para agregar juegos a tus favoritos.',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Iniciar Sesión',
            handler: () => {
              this.router.navigate(['/login']);
            },
          },
        ],
      });
      await alert.present();
      return;
    }

    if (!this.gameId) return;

    this.isLoading = true;

    try {
      const newStatus = await this.likedGameService.toggleGameLike(this.gameId);

      this.isFavorite = newStatus;
      this.cdr.detectChanges();

    } catch (err) {
      console.error('Error toggling favorite:', err);

      try {
        this.isFavorite = await this.likedGameService.isGameLiked(this.gameId);
        this.cdr.detectChanges();
      } catch (revertError) {
        console.error('Error reverting state:', revertError);
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo actualizar los favoritos. Intenta de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();

    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
