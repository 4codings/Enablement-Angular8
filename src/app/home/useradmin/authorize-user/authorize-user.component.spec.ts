import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeUserComponent } from './authorize-user.component';

describe('AuthorizeUserComponent', () => {
  let component: AuthorizeUserComponent;
  let fixture: ComponentFixture<AuthorizeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
