import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

import * as usreActions from "../../../store/user-admin/user/user.action";
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from "../../../store/user-admin/user/user.selectors";
import * as userGroupSelectors from "../../../store/user-admin/user-group/usergroup.selectors";
import * as userGroupActions from "../../../store/user-admin/user-group/usergroup.action";
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-user-admin-group',
  templateUrl: './user-admin-group.component.html',
  styleUrls: ['./user-admin-group.component.scss']
})
export class UserAdminGroupComponent implements OnInit {
  Label: any[] = [];

  constructor(
    public noAuthData: NoAuthDataService,
    private store:Store<AppState>
  ) { }

   
  // public users$:Observable<User[]>;
  public userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;


  ngOnInit() {
    this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    // this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
    
    // this.users$.subscribe(data => {
    //   if(data.length) {
    //     console.log("users", data);
    //   }
    // });

    this.userGroups$.subscribe(data => {
      if(data.length) {
        console.log("userGroups-roles", data);
      }
    });

    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });

  }

}
