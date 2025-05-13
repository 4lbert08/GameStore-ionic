import { TestBed } from '@angular/core/testing';

import { GameSectionTransferService } from './game-section-transfer.service';

describe('GameSectionTransferService', () => {
  let service: GameSectionTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSectionTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
