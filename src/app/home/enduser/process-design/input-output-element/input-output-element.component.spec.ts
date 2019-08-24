import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOutputElementComponent } from './input-output-element.component';

describe('InputOutputElementComponent', () => {
  let component: InputOutputElementComponent;
  let fixture: ComponentFixture<InputOutputElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputOutputElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOutputElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
