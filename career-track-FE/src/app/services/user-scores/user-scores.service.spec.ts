import { TestBed } from '@angular/core/testing';

import { UserScoresService } from './user-scores.service';

describe('UserScoresService', () => {
  let service: UserScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
