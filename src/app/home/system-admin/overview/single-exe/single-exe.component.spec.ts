import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleExeComponent } from './single-exe.component';

describe('SingleExeComponent', () => {
  let component: SingleExeComponent;
  let fixture: ComponentFixture<SingleExeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleExeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleExeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
