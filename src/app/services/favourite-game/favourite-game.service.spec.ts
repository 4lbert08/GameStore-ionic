import { TestBed } from '@angular/core/testing';

import { FavouriteGameService } from './favourite-game.service';

describe('FavouriteGameService', () => {
  let service: FavouriteGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
