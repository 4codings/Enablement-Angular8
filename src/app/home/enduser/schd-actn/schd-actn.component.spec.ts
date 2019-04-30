import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchdActnComponent } from './schd-actn.component';

describe('SchdActnComponent', () => {
  let component: SchdActnComponent;
  let fixture: ComponentFixture<SchdActnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchdActnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchdActnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
