import {Component, inject, Input} from '@angular/core';
import {GameCardComponent} from '../game-card/game-card.component';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {Game} from '../../models/game';
import {GameSectionTransferService} from '../../services/game-section-tranfer/game-section-transfer.service';

@Component({
  selector: 'app-game-card-section',
  standalone: true,
  imports: [
    GameCardComponent,
    CommonModule,
    IonicModule
  ],
  templateUrl: './game-card-section.component.html',
  styleUrl: './game-card-section.component.scss'
})
export class GameCardSectionComponent {
  router = inject(Router);
  gameSectionTransfer = inject(GameSectionTransferService);

  @Input() title: string = "";
  @Input() games: Game[] = [];

  navigateToViewMore(): void {
    this.gameSectionTransfer.setSectionData(this.title, this.games);
    this.router.navigate(["view-more-section-page"]);
  }
}
