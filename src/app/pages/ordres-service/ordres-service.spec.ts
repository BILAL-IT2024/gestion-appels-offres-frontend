import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdresService } from './ordres-service';

describe('OrdresService', () => {
  let component: OrdresService;
  let fixture: ComponentFixture<OrdresService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdresService],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdresService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
