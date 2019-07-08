import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlatformDialogComponent } from './add-platform-dialog.component';

describe('AddPlatformDialogComponent', () => {
  let component: AddPlatformDialogComponent;
  let fixture: ComponentFixture<AddPlatformDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlatformDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlatformDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
