import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWikiAndBlogsComponent } from './manage-wiki-and-blogs.component';

describe('ManageWikiAndBlogsComponent', () => {
  let component: ManageWikiAndBlogsComponent;
  let fixture: ComponentFixture<ManageWikiAndBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageWikiAndBlogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageWikiAndBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
