import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPackagesComponent } from './career-packages.component';

describe('CareerPackagesComponent', () => {
  let component: CareerPackagesComponent;
  let fixture: ComponentFixture<CareerPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
