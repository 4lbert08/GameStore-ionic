import { Injectable } from '@angular/core';
import {Game} from '../../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameSectionTransferService {
  private sectionData: { title: string; games: Game[] } | null = null;

  setSectionData(title: string, games: Game[]) {
    this.sectionData = { title, games };
  }

  getSectionData() {
    return this.sectionData;
  }

  clearSectionData() {
    this.sectionData = null;
  }
}
