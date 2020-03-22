import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadRequestViewComponent } from './bad-request-view.component';

describe('BadRequestViewComponent', () => {
  let component: BadRequestViewComponent;
  let fixture: ComponentFixture<BadRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
