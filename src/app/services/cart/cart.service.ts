import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getDoc
} from '@angular/fire/firestore';
import { ItemCart } from '../../models/item-cart';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  private async getUserId(): Promise<string> {
    const userId = await this.auth.getCurrentUserId();
    if (!userId) throw new Error('Usuario no autenticado');
    return userId;
  }

  async getCartItems(): Promise<ItemCart[]> {
    const userId = await this.getUserId();
    const cartRef = collection(this.firestore, `users/${userId}/cart`);
    const snapshot = await getDocs(cartRef);
    return snapshot.docs.map(doc => doc.data() as ItemCart);
  }

  async addToCart(item: ItemCart): Promise<void> {
    const userId = await this.getUserId();
    const itemRef = doc(this.firestore, `users/${userId}/cart/${item.id}`);
    await setDoc(itemRef, item);
  }

  async updateQuantity(itemId: string, quantity: number): Promise<void> {
    const userId = await this.getUserId();
    const itemRef = doc(this.firestore, `users/${userId}/cart/${itemId}`);
    const snapshot = await getDoc(itemRef);
    if (!snapshot.exists()) return;

    const item = snapshot.data() as ItemCart;
    item.quantity = quantity;
    await setDoc(itemRef, item);
  }

  async removeFromCart(itemId: string): Promise<void> {
    const userId = await this.getUserId();
    const itemRef = doc(this.firestore, `users/${userId}/cart/${itemId}`);
    await deleteDoc(itemRef);
  }

  async clearCart(): Promise<void> {
    const items = await this.getCartItems();
    const userId = await this.getUserId();
    const deletions = items.map(item => {
      const ref = doc(this.firestore, `users/${userId}/cart/${item.id}`);
      return deleteDoc(ref);
    });
    await Promise.all(deletions);
  }
}
