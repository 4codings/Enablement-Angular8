import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineconnectionComponent } from './machineconnection.component';

describe('MachineconnectionComponent', () => {
  let component: MachineconnectionComponent;
  let fixture: ComponentFixture<MachineconnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
