import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-user-admin-group',
  templateUrl: './user-admin-group.component.html',
  styleUrls: ['./user-admin-group.component.scss']
})
export class UserAdminGroupComponent implements OnInit {
  Label: any[] = [];
  userGroups$: Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  userGroup: any[] = [];
  updateBtn = false;
  selectedgroup: number;
  grpData = new varData;
  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    // this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    // this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userGroupSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userGroupSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userGroupSelectors.getLoaded));

    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });

  }

  getDataGroup(dataGroup) {
    this.grpData = dataGroup;
    // this.grpData.USR_GRP_CD = dataGroup["USR_GRP_CD"];
    // this.grpData.USR_GRP_DSC = dataGroup["USR_GRP_DSC"];
  }

  selected(index) {
    console.log(index);
    this.selectedgroup = index;
  }

  onpselect(i) {

  }


}
export class varData {
  EFF_END_DT_TM: string;
  EFF_STRT_DT_TM: string;
  GRP_TYP: string;
  ROLE_ID: any;
  USR_GRP_CD: string;
  USR_GRP_DSC: string;
  USR_GRP_ID: number;
  USR_ID: any;
  id: number;
  is_selected: boolean;
  is_selected_role: boolean;
  is_selected_user: boolean;
}
