import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminUserComponent } from './user-admin-user.component';

describe('UserAdminUserComponent', () => {
  let component: UserAdminUserComponent;
  let fixture: ComponentFixture<UserAdminUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdminUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
