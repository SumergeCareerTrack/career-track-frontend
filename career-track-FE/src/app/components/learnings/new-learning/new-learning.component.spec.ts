import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLearningComponent } from './new-learning.component';

describe('NewLearningComponent', () => {
  let component: NewLearningComponent;
  let fixture: ComponentFixture<NewLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewLearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
