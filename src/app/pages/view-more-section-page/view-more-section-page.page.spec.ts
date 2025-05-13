import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewMoreSectionPagePage } from './view-more-section-page.page';

describe('ViewMoreSectionPagePage', () => {
  let component: ViewMoreSectionPagePage;
  let fixture: ComponentFixture<ViewMoreSectionPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMoreSectionPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
