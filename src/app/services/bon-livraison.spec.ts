import { TestBed } from '@angular/core/testing';

import { BonLivraison } from './bon-livraison';

describe('BonLivraison', () => {
  let service: BonLivraison;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonLivraison);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
