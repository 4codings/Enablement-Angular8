import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthorizationData } from '../../../../store/user-admin/user-authorization/authorization.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-auth-list',
  templateUrl: './auth-list.component.html',
  styleUrls: ['./auth-list.component.scss']
})
export class AuthListComponent implements OnInit {

  @Input() auths: AuthorizationData[];
  selectedAuth: AuthorizationData;
  @Output() authSelectEvent: EventEmitter<AuthorizationData> = new EventEmitter<AuthorizationData>();
  myControl = new FormControl();
  filteredOptions: Observable<AuthorizationData[]>;
  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filter(state) : this.auths.slice())
      );
  }

  private _filter(name: string): AuthorizationData[] {
    const filterValue = name.toLowerCase();
    return this.auths.filter(option => option.V_AUTH_CD.toLowerCase().indexOf(filterValue) === 0);
  }
  onAuthSelect(auth: AuthorizationData): void {
    this.selectedAuth = auth;
    this.authSelectEvent.emit(auth);
  }
}
