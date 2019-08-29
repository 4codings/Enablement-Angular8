import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizationTableComponent } from './personalization-table.component';

describe('PersonalizationTableComponent', () => {
  let component: PersonalizationTableComponent;
  let fixture: ComponentFixture<PersonalizationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
