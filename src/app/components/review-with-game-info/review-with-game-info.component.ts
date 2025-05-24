import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonSpinner } from '@ionic/angular/standalone';
import { Review } from '../../models/review';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Game } from '../../models/game';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-review-with-game-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSpinner
  ],
  templateUrl: './review-with-game-info.component.html',
  styleUrl: './review-with-game-info.component.scss'
})
export class ReviewWithGameInfoComponent implements OnInit {
  @Input() public review!: Review;
  game: Game | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  firestoreService: FirestoreService = inject(FirestoreService);

  ngOnInit(): void {
    this.loadGame();
  }

  private async loadGame(): Promise<void> {
    try {
      if (this.review.gameId) {
        const game$ = this.firestoreService.getGameById(this.review.gameId);
        this.game = await new Promise((resolve) => game$.subscribe(game => resolve(game)));
      } else {
        this.game = null;
      }
    } catch (err) {
      this.error = 'Error loading game data';
      console.error('Error loading game data', err);
    } finally {
      this.isLoading = false;
    }
  }
}
