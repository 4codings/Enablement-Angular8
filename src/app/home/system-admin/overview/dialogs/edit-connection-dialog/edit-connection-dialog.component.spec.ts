import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConnectionDialogComponent } from './edit-connection-dialog.component';

describe('EditConnectionDialogComponent', () => {
  let component: EditConnectionDialogComponent;
  let fixture: ComponentFixture<EditConnectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConnectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
