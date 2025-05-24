import { Component, inject, Input, OnInit } from '@angular/core';
import { ItemCart } from '../../models/item-cart';
import { CartService } from '../../services/cart/cart.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Game } from '../../models/game';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-item-cart',
  templateUrl: './item-cart.component.html',
  styleUrl: './item-cart.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    IonInput
  ],
})
export class ItemCartComponent implements OnInit {
  @Input() item!: ItemCart;
  game: Game | null = null;
  cartService = inject(CartService);
  firestoreService = inject(FirestoreService);

  ngOnInit() {
    if (this.item?.gameId) {
      this.firestoreService.getGameById(this.item.gameId).subscribe((game) => {
        this.game = game;
      });
    }
  }

  remove(): void {
    if (this.item?.id) {
      this.cartService.removeFromCart(this.item.id);
    }
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) return;
    this.cartService.updateQuantity(itemId, newQuantity);
  }
}
