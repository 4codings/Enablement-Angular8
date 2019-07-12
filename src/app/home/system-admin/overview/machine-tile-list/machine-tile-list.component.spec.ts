import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTileListComponent } from './machine-tile-list.component';

describe('MachineTileListComponent', () => {
  let component: MachineTileListComponent;
  let fixture: ComponentFixture<MachineTileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineTileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineTileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
