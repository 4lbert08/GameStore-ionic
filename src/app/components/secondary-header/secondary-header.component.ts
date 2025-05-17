import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { GameSearchService } from '../../services/game-search/game-search.service';
import { Router } from '@angular/router';
import { UserData } from '../../models/user';
import { User } from 'firebase/auth';
import {CommonModule, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secondary-header',
  imports: [
    FormsModule,
    IonicModule,
    NgIf,
  ],
  templateUrl: './secondary-header.component.html',
  styleUrl: './secondary-header.component.scss'
})
export class SecondaryHeaderComponent {
  searchQuery: string = '';
  selectedLanguage: string = 'en';
  user: User | null = null;
  userData: UserData | null = null;

  constructor(
    private router: Router,
    private gameSearchService: GameSearchService,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.firestoreService.loadUser(this.user.uid).subscribe(userData => this.userData = userData);
      }
    });
  }


  protected readonly encodeURI = encodeURI;
}
