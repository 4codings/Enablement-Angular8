import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../store/user-admin/user/user.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() users: User[];
  selectedUser: User;
  @Output() userSelectEvent: EventEmitter<User> = new EventEmitter<User>();
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;

  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filter(state) : this.users.slice())
      );
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.users.filter(option => option.V_USR_NM.toLowerCase().indexOf(filterValue) === 0);
  }

  hasUser(userName: string): boolean {
    return !!this.users.filter(user => user.V_USR_NM.toLowerCase() === userName.toLowerCase()).length;
  }

  onUserSelect(user: User): void {
    this.selectedUser = user;
    this.userSelectEvent.emit(user);
  }

}
