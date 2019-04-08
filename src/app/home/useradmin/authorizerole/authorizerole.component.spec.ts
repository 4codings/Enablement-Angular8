import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeroleComponent } from './authorizerole.component';

describe('AuthorizeroleComponent', () => {
  let component: AuthorizeroleComponent;
  let fixture: ComponentFixture<AuthorizeroleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizeroleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
