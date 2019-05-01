import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatableFormComponent } from './repeatable-form.component';

describe('RepeatableFormComponent', () => {
  let component: RepeatableFormComponent;
  let fixture: ComponentFixture<RepeatableFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatableFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
