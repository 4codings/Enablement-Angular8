import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExeTypesListComponent } from './exe-types-list.component';

describe('ExeTypesListComponent', () => {
  let component: ExeTypesListComponent;
  let fixture: ComponentFixture<ExeTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
