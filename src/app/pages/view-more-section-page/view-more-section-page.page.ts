import { Component, inject, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { GameSectionTransferService } from '../../services/game-section-tranfer/game-section-transfer.service';
import { IonicModule } from '@ionic/angular';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import {GameCardGalleryComponent} from "../../components/game-card-gallery/game-card-gallery.component";

@Component({
  selector: 'app-view-more-section-page',
  templateUrl: './view-more-section-page.page.html',
  standalone: true,
  imports: [
    IonicModule,
    MainHeaderComponent,
    GameCardGalleryComponent,
  ],
  styleUrls: ['./view-more-section-page.page.scss']
})
export class ViewMoreSectionPage implements OnInit {
  gameSectionTransferService = inject(GameSectionTransferService);

  title: string = '';
  games: Game[] = [];

  ngOnInit(): void {
    const sectionData = this.gameSectionTransferService.getSectionData();
    if (sectionData) {
      this.title = sectionData.title;
      this.games = sectionData.games;
    } else {
      this.title = 'Sección';
      this.games = [];
    }
  }
}
