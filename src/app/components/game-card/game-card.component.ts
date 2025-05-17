import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LikedGameService } from '../../services/favourite-game/favourite-game.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserData } from '../../models/user';
import { Subject, takeUntil, Observable } from 'rxjs';

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
  private destroy$ = new Subject<void>();
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
    console.log('ngOnInit started for game:', this.gameId);

    this.authService.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(async (authUser) => {
      console.log('Auth user:', authUser);

      if (!authUser) {
        console.log('No user authenticated, setting isFavorite to false');
        this.isFavorite = false;
        this.cdr.detectChanges();
        return;
      }

      this.firestore.user$.pipe(takeUntil(this.destroy$)).subscribe(async (userData) => {
        console.log('User$ emitted:', userData);
        this.user = userData;

        if (this.gameId) {
          console.log('Checking isGameLiked for game:', this.gameId);
          this.isFavorite = null;
          try {
            this.isFavorite = await this.likedGameService.isGameLiked(this.gameId);
            console.log(`Game ${this.gameName} (ID: ${this.gameId}) isFavorite:`, this.isFavorite);
            this.cdr.detectChanges();
          } catch (err) {
            console.error('Error checking if game is liked:', err);
            this.isFavorite = false;
            this.cdr.detectChanges();
          }
        } else {
          console.warn('No gameId provided for GameCardComponent');
          this.isFavorite = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    if (this.gameId) {
      try {
        if (this.isFavorite) {
          await this.likedGameService.removeLikedGame(this.gameId);
          this.isFavorite = false;
        } else {
          await this.likedGameService.likeGame(this.gameId);
          this.isFavorite = true;
        }
        console.log(`${this.gameName} ${this.isFavorite ? 'added to' : 'removed from'} favorites`);
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Error toggling favorite:', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo actualizar los favoritos. Intenta de nuevo.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      console.warn('Cannot toggle favorite: No gameId provided');
    }
  }
}
