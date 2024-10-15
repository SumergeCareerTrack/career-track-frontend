import { TestBed } from '@angular/core/testing';

import { CareerPackagesService } from './career-packages.service';

describe('CareerPackagesService', () => {
  let service: CareerPackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerPackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
