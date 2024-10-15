import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserLearningsComponent } from './manage-user-learnings.component';

describe('ManageUserLearningsComponent', () => {
  let component: ManageUserLearningsComponent;
  let fixture: ComponentFixture<ManageUserLearningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUserLearningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserLearningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
