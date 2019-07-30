import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMachinesComponent } from './manage-machines.component';

describe('ManageMachinesComponent', () => {
  let component: ManageMachinesComponent;
  let fixture: ComponentFixture<ManageMachinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMachinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
