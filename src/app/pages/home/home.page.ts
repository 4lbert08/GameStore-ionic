import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Game } from '../../models/game';
import { Subscription } from 'rxjs';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import {GameCardRowComponent} from "../../components/game-card-row/game-card-row.component";

interface GameSection {
  title: string;
  games: Game[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GameCardRowComponent,
    CommonModule,
    IonicModule,
    MainHeaderComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  firestoreService = inject(FirestoreService);
  sections: GameSection[] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const pcGames = this.firestoreService.getGames({
      system: 'PC',
      inStock: true
    }).subscribe(games => {
      this.sections.push({ title: 'PC Games in Stock', games });
    });

    const actionGamesSub = this.firestoreService.getGames({
      genre: 'action'
    }).subscribe(games => {
      this.sections.push({ title: 'Action Games', games });
    });

    const familyGamesSub = this.firestoreService.getGames({
      pegi: 7,
      inStock: true
    }).subscribe(games => {
      this.sections.push({ title: 'Family Friendly (pegi 7)', games });
    });

    this.subscriptions.push(pcGames, actionGamesSub, familyGamesSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
