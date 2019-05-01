import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatAfterComponent } from './repeat-after.component';

describe('RepeatAfterComponent', () => {
  let component: RepeatAfterComponent;
  let fixture: ComponentFixture<RepeatAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
