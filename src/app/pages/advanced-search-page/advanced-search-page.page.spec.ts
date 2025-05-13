import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedPagePage } from './advanced-search-page.page';

describe('AdvancedPagePage', () => {
  let component: AdvancedPagePage;
  let fixture: ComponentFixture<AdvancedPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
