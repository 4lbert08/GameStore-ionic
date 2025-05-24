import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameShowcasePage } from './game-showcase.page';

describe('GameShowcasePage', () => {
  let component: GameShowcasePage;
  let fixture: ComponentFixture<GameShowcasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameShowcasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
