import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateWikiBlogsComponent } from './admin-update-wiki-blogs.component';

describe('AdminUpdateWikiBlogsComponent', () => {
  let component: AdminUpdateWikiBlogsComponent;
  let fixture: ComponentFixture<AdminUpdateWikiBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateWikiBlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateWikiBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
