import { Component, OnInit } from '@angular/core';
import * as usreActions from "../../store/user-admin/user/user.action";
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../store/user-admin/user/user.model';
import * as userSelectors from "../../store/user-admin/user/user.selectors";
import * as userGroupSelectors from "../../store/user-admin/user-group/usergroup.selectors";
import * as userGroupActions from "../../store/user-admin/user-group/usergroup.action";
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  public users$:Observable<User[]>;
  public userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;

  constructor(private store:Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
    
    this.users$.subscribe(data => {
      if(data.length) {
        console.log("users", data);
      }
    });

    this.userGroups$.subscribe(data => {
      if(data.length) {
        console.log("userGroups-roles", data);
      }
    });

  }

}
