import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  @Input() gameId: string = "";
  @Input() gameCover: string = "";
  @Input() gameName: string = "";
  @Input() gamePrice: string = "";

  constructor(private router: Router) {}

  onCardClick(): void {
    if (this.gameId) {
      this.router.navigate(['gamePage', this.gameId]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
}
