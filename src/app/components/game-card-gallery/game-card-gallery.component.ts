import { Component, Input } from '@angular/core';
import { Game } from '../../models/game';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {GameCardComponent} from "../game-card/game-card.component";

@Component({
  selector: 'app-game-card-gallery',
  templateUrl: './game-card-gallery.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    GameCardComponent,
  ],
  styleUrls: ['./game-card-gallery.component.scss']
})
export class GameCardGalleryComponent {
  @Input() games: Game[] = [];

  maxGamesPerPage = 20;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.games.length / this.maxGamesPerPage);
  }

  get paginatedGames() {
    const startIndex = (this.currentPage - 1) * this.maxGamesPerPage;
    const endIndex = startIndex + this.maxGamesPerPage;
    return this.games.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
