import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { GameSearchService } from '../../services/game-search/game-search.service';
import { Router } from '@angular/router';
import { UserData } from '../../models/user';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class MainHeaderComponent implements OnInit {
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

  goToAdvancedSearch() {
    this.gameSearchService.loadAllGames();
    this.router.navigate(['/advanced-search-page']).then(() => window.scrollTo(0, 0));
  }

  search() {
    if (this.searchQuery) {
      this.gameSearchService.applyFilters({ searchTerm: this.searchQuery });
      this.router.navigate(['/advanced-search-page']).then(() => window.scrollTo(0, 0));
    } else {
      this.goToAdvancedSearch();
    }
  }

  onSearchQueryChange() {
    console.log('Término de búsqueda cambiado:', this.searchQuery);
  }

  protected readonly encodeURI = encodeURI;
}
