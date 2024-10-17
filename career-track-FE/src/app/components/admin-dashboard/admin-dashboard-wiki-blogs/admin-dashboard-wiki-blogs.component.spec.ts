import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardWikiBlogsComponent } from './admin-dashboard-wiki-blogs.component';

describe('AdminDashboardWikiBlogsComponent', () => {
  let component: AdminDashboardWikiBlogsComponent;
  let fixture: ComponentFixture<AdminDashboardWikiBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardWikiBlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardWikiBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
