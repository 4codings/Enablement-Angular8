import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExeDialogComponent } from './add-exe-dialog.component';

describe('AddExeDialogComponent', () => {
  let component: AddExeDialogComponent;
  let fixture: ComponentFixture<AddExeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
