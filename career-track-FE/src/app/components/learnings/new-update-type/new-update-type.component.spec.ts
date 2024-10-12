import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUpdateTypeComponent } from './new-update-type.component';

describe('NewUpdateTypeComponent', () => {
  let component: NewUpdateTypeComponent;
  let fixture: ComponentFixture<NewUpdateTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUpdateTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUpdateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
