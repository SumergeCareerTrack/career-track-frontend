import { NotificationService } from './notifications-service.service';
import { TestBed } from '@angular/core/testing';


describe('UserScoresService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
