import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiDataService } from './wiki-data.service';

describe('WikiComponent', () => {
  let component: WikiDataService;
  let fixture: ComponentFixture<WikiDataService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WikiDataService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WikiDataService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
