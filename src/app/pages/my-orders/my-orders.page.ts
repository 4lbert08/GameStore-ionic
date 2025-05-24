import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonContent, IonFooter } from '@ionic/angular/standalone';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { UserNavBarComponent } from '../../components/user-nav-bar/user-nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { User } from 'firebase/auth';
import { AuthService } from '../../services/auth/auth.service';
import { Order } from '../../models/order';
import { OrderComponent } from '../../components/order/order.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    MainHeaderComponent,
    UserNavBarComponent,
    FooterComponent,
    OrderComponent,
    CommonModule
  ],
  templateUrl: './my-orders.page.html',
  styleUrl: './my-orders.page.scss'
})
export class MyOrdersPage implements OnInit {
  authService: AuthService = inject(AuthService);
  firestore: FirestoreService = inject(FirestoreService);
  user: User | null = null;
  userOrders: Order[] = [];

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.firestore.getOrdersFromUser(this.user.uid).subscribe(orders => {
          this.userOrders = orders;
        })
      }
    })
  }
}
