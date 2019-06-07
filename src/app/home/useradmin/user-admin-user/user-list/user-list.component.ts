import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../store/user-admin/user/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() users: User[];
  selectedUser: User;
  @Output() userSelectEvent: EventEmitter<User> = new EventEmitter<User>();

  constructor() {
  }

  ngOnInit() {
  }

  hasUser(userName: string): boolean {
    return !!this.users.filter(user => user.V_USR_NM.toLowerCase() === userName.toLowerCase()).length;
  }

  onUserSelect(user: User): void {
    this.selectedUser = user;
    this.userSelectEvent.emit(user);
  }

}
