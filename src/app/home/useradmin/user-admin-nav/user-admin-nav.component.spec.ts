import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminNavComponent } from './user-admin-nav.component';

describe('UserAdminNavComponent', () => {
  let component: UserAdminNavComponent;
  let fixture: ComponentFixture<UserAdminNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdminNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
