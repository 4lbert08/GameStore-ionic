import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFavGamesPage } from './user-fav-games.page';

describe('UserFavGamesPage', () => {
  let component: UserFavGamesPage;
  let fixture: ComponentFixture<UserFavGamesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFavGamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
