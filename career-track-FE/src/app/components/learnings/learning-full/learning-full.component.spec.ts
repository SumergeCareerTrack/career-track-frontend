import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLearningComponent } from './learning-full.component';

describe('LearningComponentComponent', () => {
  let component: FullLearningComponent;
  let fixture: ComponentFixture<FullLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
