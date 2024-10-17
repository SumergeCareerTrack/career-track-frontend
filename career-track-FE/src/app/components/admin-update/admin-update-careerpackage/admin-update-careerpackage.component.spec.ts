import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateCareerpackageComponent } from './admin-update-careerpackage.component';

describe('AdminUpdateCareerpackageComponent', () => {
  let component: AdminUpdateCareerpackageComponent;
  let fixture: ComponentFixture<AdminUpdateCareerpackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateCareerpackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateCareerpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
