import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinespecsComponent } from './machinespecs.component';

describe('MachinespecsComponent', () => {
  let component: MachinespecsComponent;
  let fixture: ComponentFixture<MachinespecsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinespecsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinespecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
