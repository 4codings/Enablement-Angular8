import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConnectionDialogComponent } from './add-connection-dialog.component';

describe('AddConnectionDialogComponent', () => {
  let component: AddConnectionDialogComponent;
  let fixture: ComponentFixture<AddConnectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConnectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
