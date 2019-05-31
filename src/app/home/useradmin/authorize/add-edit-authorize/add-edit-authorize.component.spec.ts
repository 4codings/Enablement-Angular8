import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAuthorizeComponent } from './add-edit-authorize.component';

describe('AddEditAuthorizeComponent', () => {
  let component: AddEditAuthorizeComponent;
  let fixture: ComponentFixture<AddEditAuthorizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAuthorizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
