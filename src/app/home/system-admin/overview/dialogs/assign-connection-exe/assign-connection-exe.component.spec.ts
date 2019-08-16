import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignConnectionExeComponent } from './assign-connection-exe.component';

describe('AssignConnectionExeComponent', () => {
  let component: AssignConnectionExeComponent;
  let fixture: ComponentFixture<AssignConnectionExeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignConnectionExeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignConnectionExeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
