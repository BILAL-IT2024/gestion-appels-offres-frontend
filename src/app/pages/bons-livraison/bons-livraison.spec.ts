import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonsLivraison } from './bons-livraison';

describe('BonsLivraison', () => {
  let component: BonsLivraison;
  let fixture: ComponentFixture<BonsLivraison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonsLivraison],
    }).compileComponents();

    fixture = TestBed.createComponent(BonsLivraison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
