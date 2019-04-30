import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernavbarComponent } from './usernavbar.component';

describe('UsernavbarComponent', () => {
  let component: UsernavbarComponent;
  let fixture: ComponentFixture<UsernavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
