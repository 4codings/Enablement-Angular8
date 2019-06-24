import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDesignComponent } from './process-design.component';

describe('ProcessDesignComponent', () => {
  let component: ProcessDesignComponent;
  let fixture: ComponentFixture<ProcessDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
