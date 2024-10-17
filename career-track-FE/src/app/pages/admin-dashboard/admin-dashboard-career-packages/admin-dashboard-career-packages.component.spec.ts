import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardCareerPackagesComponent } from './admin-dashboard-career-packages.component';

describe('AdminDashboardCareerPackagesComponent', () => {
  let component: AdminDashboardCareerPackagesComponent;
  let fixture: ComponentFixture<AdminDashboardCareerPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardCareerPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardCareerPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
