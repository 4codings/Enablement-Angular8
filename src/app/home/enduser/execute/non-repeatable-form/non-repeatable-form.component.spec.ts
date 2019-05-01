import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonRepeatableFormComponent } from './non-repeatable-form.component';

describe('NonRepeatableFormComponent', () => {
  let component: NonRepeatableFormComponent;
  let fixture: ComponentFixture<NonRepeatableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonRepeatableFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRepeatableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
