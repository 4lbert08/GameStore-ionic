import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Game } from '../../models/game';
import { ActivatedRoute} from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GameCardSectionComponent } from '../../components/game-card-section/game-card-section.component';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Review } from '../../models/review';
import { ReviewWithUserInfoComponent} from '../../components/review-with-user-info/review-with-user-info.component';
import { Subscription } from 'rxjs';
import {User} from 'firebase/auth';
import {AuthService} from '../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {CartService} from '../../services/cart/cart.service';
import {ItemCart} from '../../models/item-cart';

@Component({
  selector: 'app-game-showcase-page',
  standalone: true,
  imports: [CommonModule, IonicModule, GameCardSectionComponent, MainHeaderComponent,
    FooterComponent, ReviewWithUserInfoComponent, FormsModule],
  templateUrl: './game-showcase.page.html',
  styleUrls: ['./game-showcase.page.scss']
})
export class GameShowcasePageComponent implements OnInit, OnDestroy {
  user: User | null = null;
  game: Game | null = null;
  review: string = "";
  recommendedGames: Game[] = [];
  reviews: Review[] = [];
  gameNotFound: boolean = false;
  sanitizedTrailerUrl: string | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  private subscriptions: Subscription[] = [];

  private firestoreService = inject(FirestoreService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private zone = inject(NgZone);
  private authService: AuthService = inject(AuthService);
  private cartService: CartService = inject(CartService);

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
      }
    )

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadGameData(id);
      } else {
        this.gameNotFound = true;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadGameData(gameId: string): void {
    this.zone.run(() => {
      const gameSub = this.firestoreService.getGameById(gameId).subscribe({
        next: (game) => {
          this.game = game;
          this.gameNotFound = false;

          this.setTrailerUrl(game.trailer);

          const recommendedSub = this.firestoreService.getGames({
            system: this.game.system,
          }).subscribe({
            next: (games) => {
              this.recommendedGames = games;
            },
            error: (err) => console.error('Error loading recommended games', err)
          });
          this.subscriptions.push(recommendedSub);

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading game', err);
          this.gameNotFound = true;
          this.error = 'Game not found';
          this.isLoading = false;
        }
      });

      const reviewsSub = this.firestoreService.getReviewsFromGame(gameId).subscribe({
        next: (reviews) => {
          this.zone.run(() => {
            this.reviews = reviews;
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading reviews', err);
          this.error = this.error ? `${this.error}; Error loading reviews: ${err.message}` : `Error loading reviews: ${err.message}`;
          this.isLoading = false;
        }
      });

      this.subscriptions.push(gameSub, reviewsSub);
    });
  }

  async addReview(){
    const userReview: Review = {
      userId: this.user?.uid,
      gameId: this.game?.id,
      review: this.review
    }
    await this.firestoreService.addReview(userReview);
    this.review = "";
  }

  private setTrailerUrl(trailer: string): void {
    this.sanitizedTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(trailer) as string;
  }

  async addToCart(): Promise<void> {
    if (!this.game) return;

    const item: ItemCart = {
      gameId: this.game.id,
      quantity: 1
    };

    try {
      await this.cartService.addToCart(item);
      alert('Game added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was a problem adding the game to your cart.');
    }
  }
}
