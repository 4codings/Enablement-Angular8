import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTileListComponent } from './auth-tile-list.component';

describe('AuthTileListComponent', () => {
  let component: AuthTileListComponent;
  let fixture: ComponentFixture<AuthTileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthTileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
