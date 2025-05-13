import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Game } from '../../models/game';
import {GameSectionTransferService} from "../../services/game-section-tranfer/game-section-transfer.service";
import {GameCardComponent} from "../game-card/game-card.component";

@Component({
  selector: 'app-game-card-row',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    GameCardComponent
  ],
  templateUrl: './game-card-row.component.html',
  styleUrls: ['./game-card-row.component.scss']
})
export class GameCardRowComponent {
  router = inject(Router);
  gameSectionTransfer = inject(GameSectionTransferService);

  @Input() title: string = "";
  @Input() games: Game[] = [];

  navigateToViewMore(): void {
    this.gameSectionTransfer.setSectionData(this.title, this.games);
    this.router.navigate(["view-more-section-page"]).then(r => scroll(0,0));
  }
}
