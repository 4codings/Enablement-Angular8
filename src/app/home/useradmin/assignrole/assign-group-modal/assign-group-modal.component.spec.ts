import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupModalComponent } from './assign-group-modal.component';

describe('AssignGroupModalComponent', () => {
  let component: AssignGroupModalComponent;
  let fixture: ComponentFixture<AssignGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
