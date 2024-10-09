import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateLearningComponent } from './admin-update-learning.component';

describe('AdminUpdateLearningComponent', () => {
  let component: AdminUpdateLearningComponent;
  let fixture: ComponentFixture<AdminUpdateLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
