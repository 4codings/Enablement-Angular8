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
  userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  userGroup:any[]= [];
  updateBtn:boolean = false;
  selectedgroup:number;

  constructor(
    public noAuthData: NoAuthDataService,
    private store:Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    // this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
  
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    
  }

  getAvailableGroup(userGroup) {
    this.userGroup["USR_GRP_CD_R"] = userGroup["ROLE_CD"];
    this.userGroup["USR_GRP_DSC_R"] = userGroup["ROLE_DSC"];
  }

  selected(index) {
    console.log(index);
    this.selectedgroup = index;
  }

  onpselect(i) {

  }

}
