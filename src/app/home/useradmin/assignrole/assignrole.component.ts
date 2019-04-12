import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { userMemberShip } from 'src/app/store/user-admin/user-membership/usermembership.model';
import { Observable } from 'rxjs';

import * as usreActions from "../../../store/user-admin/user/user.action";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { User } from "../../../store/user-admin/user/user.model";
import * as userSelectors from "../../../store/user-admin/user/user.selectors";
import * as userGroupSelectors from "../../../store/user-admin/user-group/usergroup.selectors";
import * as userGroupActions from "../../../store/user-admin/user-group/usergroup.action";
import { userGroup } from "src/app/store/user-admin/user-group/usergroup.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from "../../../store/user-admin/user-role/userrole.selectors";
import * as userRoleActions from "../../../store/user-admin/user-role/userrole.action";


@Component({
  selector: 'app-assignrole',
  templateUrl: './assignrole.component.html',
  styleUrls: ['./assignrole.component.scss']
})
export class AssignroleComponent implements OnInit {
  Label: any[] = [];
  user: any[] = [];
  public users$: Observable<User[]>;
  public roles$: Observable<userRole[]>;

  addBtn: boolean = true;
  updateBtn: boolean = false;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser:string;

  constructor(
    public noAuthData: NoAuthDataService,
    private store:Store<AppState>
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
    // this.store.dispatch(new userRoleActions.getUserRole());
    // this.userRoles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    // this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    // this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    // this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));
    this.users$.subscribe(users=>{
      console.log(users)
    })
    this.roles$.subscribe(groups=>{
      console.log('Group',groups)
    })
  }

}


// this.store.dispatch(new usreActions.getUser());
//     // this.store.dispatch(new userGroupActions.getUserGroup());
//     this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
//     // this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
//     this.error$ = this.store.pipe(select(userSelectors.getErrors));
//     this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
//     this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));