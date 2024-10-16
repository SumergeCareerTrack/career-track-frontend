import { TestBed } from '@angular/core/testing';

import { UserLearningsService } from './user-learnings.service';

describe('UserLearningsService', () => {
  let service: UserLearningsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLearningsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
