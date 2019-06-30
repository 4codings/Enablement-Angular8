import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthorizationData} from '../../../../store/user-admin/user-authorization/authorization.model';

@Component({
  selector: 'app-auth-list',
  templateUrl: './auth-list.component.html',
  styleUrls: ['./auth-list.component.scss']
})
export class AuthListComponent implements OnInit {

  @Input() auths: AuthorizationData[];
  selectedAuth: AuthorizationData;
  @Output() authSelectEvent: EventEmitter<AuthorizationData> = new EventEmitter<AuthorizationData>();

  constructor() {
  }

  ngOnInit() {
  }

  onAuthSelect(auth: AuthorizationData): void {
    this.selectedAuth = auth;
    this.authSelectEvent.emit(auth);
  }
}
