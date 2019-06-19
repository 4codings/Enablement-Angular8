import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRoleComponent } from './single-role.component';

describe('SingleRoleComponent', () => {
  let component: SingleRoleComponent;
  let fixture: ComponentFixture<SingleRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
