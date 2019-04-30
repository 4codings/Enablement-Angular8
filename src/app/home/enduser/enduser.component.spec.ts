import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnduserComponent } from './enduser.component';

describe('EnduserComponent', () => {
  let component: EnduserComponent;
  let fixture: ComponentFixture<EnduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
