import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminGroupComponent } from './user-admin-group.component';

describe('UserAdminGroupComponent', () => {
  let component: UserAdminGroupComponent;
  let fixture: ComponentFixture<UserAdminGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdminGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
