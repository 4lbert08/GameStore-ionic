import { Component, OnInit } from '@angular/core';
import { LikedGameService } from '../../services/favourite-game/favourite-game.service';
import { Game } from '../../models/game';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { IonicModule } from '@ionic/angular';
import { UserNavBarComponent } from '../../components/user-nav-bar/user-nav-bar.component';
import { GameCardComponent } from '../../components/game-card/game-card.component';
import { NgForOf, NgIf } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-user-fav-games',
  templateUrl: './user-fav-games.page.html',
  imports: [
    MainHeaderComponent,
    IonicModule,
    UserNavBarComponent,
    GameCardComponent,
    NgForOf,
    FooterComponent,
    NgIf
  ],
  styleUrls: ['./user-fav-games.page.scss']
})
export class UserFavGamesPage implements OnInit {
  games: Game[] = [];

  constructor(
    private likedGameService: LikedGameService,
  ) {}

  ngOnInit() {
    this.likedGameService.getLikedGames().subscribe(likedGames => {
      this.games = likedGames;
    })
  }
}
