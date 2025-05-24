import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { Order } from '../../models/order';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Game } from '../../models/game';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';

addIcons({ downloadOutline });

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    RouterLink,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonButton,
    IonIcon
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  @Input() order: Order | null = null;
  game: Game | null = null;
  firestore: FirestoreService = inject(FirestoreService);

  ngOnInit() {
    this.firestore.getGameById(this.order?.productId).subscribe(game => {
      this.game = game;
    });
  }
}
