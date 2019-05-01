import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatProcessComponent } from './repeat-process.component';

describe('RepeatProcessComponent', () => {
  let component: RepeatProcessComponent;
  let fixture: ComponentFixture<RepeatProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
