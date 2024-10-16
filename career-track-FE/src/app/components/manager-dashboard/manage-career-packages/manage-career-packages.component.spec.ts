import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCareerPackagesComponent } from './manage-career-packages.component';

describe('ManageCareerPackagesComponent', () => {
  let component: ManageCareerPackagesComponent;
  let fixture: ComponentFixture<ManageCareerPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCareerPackagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCareerPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
