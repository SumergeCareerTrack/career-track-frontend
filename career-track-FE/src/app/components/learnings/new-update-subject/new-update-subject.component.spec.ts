import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUpdateSubjectComponent } from './new-update-subject.component';

describe('NewUpdateSubjectComponent', () => {
  let component: NewUpdateSubjectComponent;
  let fixture: ComponentFixture<NewUpdateSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUpdateSubjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUpdateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
