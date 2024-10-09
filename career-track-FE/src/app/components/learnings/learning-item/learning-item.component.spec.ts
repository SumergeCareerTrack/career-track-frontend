import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningItemComponent } from './learning-item.component';

describe('LearningItemComponent', () => {
  let component: LearningItemComponent;
  let fixture: ComponentFixture<LearningItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
