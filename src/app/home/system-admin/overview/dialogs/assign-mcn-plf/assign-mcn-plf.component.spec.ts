import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMcnPlfComponent } from './assign-mcn-plf.component';

describe('AssignMcnPlfComponent', () => {
  let component: AssignMcnPlfComponent;
  let fixture: ComponentFixture<AssignMcnPlfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignMcnPlfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMcnPlfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
