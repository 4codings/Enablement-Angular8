import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportChartsComponent } from './report-charts.component';

describe('ReportChartsComponent', () => {
  let component: ReportChartsComponent;
  let fixture: ComponentFixture<ReportChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
