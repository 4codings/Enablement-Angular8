import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeImageComponent } from './change-image.component';

describe('ChangeImageComponent', () => {
  let component: ChangeImageComponent;
  let fixture: ComponentFixture<ChangeImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
