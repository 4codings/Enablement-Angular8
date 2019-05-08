import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsnavbarComponent } from './deploymentsnavbar.component';

describe('DeploymentsnavbarComponent', () => {
  let component: DeploymentsnavbarComponent;
  let fixture: ComponentFixture<DeploymentsnavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentsnavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
