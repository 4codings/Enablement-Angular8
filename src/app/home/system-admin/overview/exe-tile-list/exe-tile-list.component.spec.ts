import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExeTileListComponent } from './exe-tile-list.component';

describe('ExeTileListComponent', () => {
  let component: ExeTileListComponent;
  let fixture: ComponentFixture<ExeTileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeTileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeTileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
