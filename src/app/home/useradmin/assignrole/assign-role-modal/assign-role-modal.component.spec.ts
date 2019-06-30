import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRoleModalComponent } from './assign-role-modal.component';

describe('AssignRoleModalComponent', () => {
  let component: AssignRoleModalComponent;
  let fixture: ComponentFixture<AssignRoleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignRoleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
