import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployStatusComponent } from './deploy-status.component';

describe('DeployStatusComponent', () => {
  let component: DeployStatusComponent;
  let fixture: ComponentFixture<DeployStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
