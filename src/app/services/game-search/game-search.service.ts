import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Game } from '../../models/game';
import { FirestoreService } from '../firestore/firestore.service';

export interface SearchFilters {
  searchTerm?: string;
  system?: string;
  platform?: string;
  genre?: string;
  pegi?: number;
  inStock?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameSearchService {
  private gamesSubject = new BehaviorSubject<Game[]>([]);
  private filtersSubject = new BehaviorSubject<SearchFilters>({});

  constructor(private firestoreService: FirestoreService) {
    const storedFilters = localStorage.getItem('searchFilters');
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      this.applyFilters(parsedFilters);
    } else {
      this.loadAllGames();
    }
  }

  getGames(): Observable<Game[]> {
    return this.gamesSubject.asObservable();
  }

  getFilters(): Observable<SearchFilters> {
    return this.filtersSubject.asObservable();
  }

  loadAllGames(): void {
    this.firestoreService.getGames().subscribe(games => {
      this.gamesSubject.next(games);
      this.filtersSubject.next({});
      localStorage.removeItem('searchFilters');
    });
  }

  loadGamesBySearchTerm(searchTerm: string): void {
    const filters: SearchFilters = { searchTerm };
    this.applyFilters(filters);
  }

  applyFilters(filters: SearchFilters): void {
    const currentFilters = { ...this.filtersSubject.value, ...filters };
    this.filtersSubject.next(currentFilters);
    localStorage.setItem('searchFilters', JSON.stringify(currentFilters));
    this.firestoreService.getGames(currentFilters).subscribe(games => {
      this.gamesSubject.next(games);
    });
  }

  clearFilters(): void {
    this.filtersSubject.next({});
    localStorage.removeItem('searchFilters');
    this.loadAllGames();
  }
}
