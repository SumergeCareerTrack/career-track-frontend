import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardLearningComponent } from './admin-dashboard-learning.component';

describe('AdminDashboardLearningComponent', () => {
  let component: AdminDashboardLearningComponent;
  let fixture: ComponentFixture<AdminDashboardLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
