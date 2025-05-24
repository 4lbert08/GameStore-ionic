import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Review } from '../../models/review';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-review-with-user-info',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './review-with-user-info.component.html',
  styleUrl: './review-with-user-info.component.scss'
})
export class ReviewWithUserInfoComponent implements OnInit {
  @Input() public review!: Review;
  user: UserData | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  firestoreService: FirestoreService = inject(FirestoreService);

  ngOnInit(): void {
    this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      if (this.review.userId) {
        const user$ = this.firestoreService.getUserById(this.review.userId);
        this.user = await new Promise((resolve) => user$.subscribe(user => resolve(user)));
      } else {
        this.user = null;
      }
    } catch (err) {
      this.error = 'Error loading user data';
      console.error('Error loading user data', err);
    } finally {
      this.isLoading = false;
    }
  }
}
