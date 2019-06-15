import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTileListComponent } from './user-tile-list.component';

describe('UserTileListComponent', () => {
  let component: UserTileListComponent;
  let fixture: ComponentFixture<UserTileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
