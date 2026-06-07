import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppelsOffres } from './appels-offres';

describe('AppelsOffres', () => {
  let component: AppelsOffres;
  let fixture: ComponentFixture<AppelsOffres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppelsOffres],
    }).compileComponents();

    fixture = TestBed.createComponent(AppelsOffres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
