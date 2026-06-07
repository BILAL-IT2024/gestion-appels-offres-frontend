import { TestBed } from '@angular/core/testing';

import { AppelOffres } from './appel-offres';

describe('AppelOffres', () => {
  let service: AppelOffres;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppelOffres);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
