import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExeTypeDialogComponent } from './edit-exe-type-dialog.component';

describe('EditExeTypeDialogComponent', () => {
  let component: EditExeTypeDialogComponent;
  let fixture: ComponentFixture<EditExeTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExeTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExeTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
