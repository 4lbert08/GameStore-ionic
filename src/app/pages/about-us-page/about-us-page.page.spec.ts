import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsPagePage } from './about-us-page.page';

describe('AboutUsPagePage', () => {
  let component: AboutUsPagePage;
  let fixture: ComponentFixture<AboutUsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
