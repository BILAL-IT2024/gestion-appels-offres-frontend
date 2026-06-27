import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Marches } from './marches';

describe('Marches', () => {
  let component: Marches;
  let fixture: ComponentFixture<Marches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Marches],
    }).compileComponents();

    fixture = TestBed.createComponent(Marches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
