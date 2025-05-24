import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';
import { ItemCart } from '../../models/item-cart';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ItemCartComponent } from '../../components/item-cart/item-cart.component';
import { NgForOf } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  imports: [
    MainHeaderComponent,
    FooterComponent,
    ItemCartComponent,
    NgForOf,
    IonContent,
    IonButton
  ]
})
export class CartPage implements OnInit {
  items: ItemCart[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.items = await this.cartService.getCartItems();
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
