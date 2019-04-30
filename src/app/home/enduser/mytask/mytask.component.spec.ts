import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytaskComponent } from './mytask.component';

describe('MytaskComponent', () => {
  let component: MytaskComponent;
  let fixture: ComponentFixture<MytaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
