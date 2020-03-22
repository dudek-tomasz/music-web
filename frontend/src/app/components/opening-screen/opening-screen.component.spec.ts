import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningScreenComponent } from './opening-screen.component';

describe('OpeningScreenComponent', () => {
  let component: OpeningScreenComponent;
  let fixture: ComponentFixture<OpeningScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
