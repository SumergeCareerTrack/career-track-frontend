import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningsSubmissionsComponent } from './learnings-submissions.component';

describe('LearningsSubmissionsComponent', () => {
  let component: LearningsSubmissionsComponent;
  let fixture: ComponentFixture<LearningsSubmissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningsSubmissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningsSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
