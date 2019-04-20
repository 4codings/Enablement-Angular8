import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import {addUserGroup, DeleteUserGroup, UpdateUserGroup} from '../../../store/user-admin/user-group/usergroup.action';
import {HttpClient} from '@angular/common/http';

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

  public start_date: any;
  public end_date: any;
  public groupList = [];
  public ctrlVvariables;

  public nameChanged = false;
  private clonedName = '';

  public descChanged = false;
  private clonedDesc = '';

  public dateChanged = false;
  private clonedEndDate = '';
  private clonedStartDate = '';

  public duplicated = false;

  public totalDuplicated = false;
  public hideButton = false;

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    // this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userGroupSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userGroupSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userGroupSelectors.getLoaded));

    this.userGroups$
      .subscribe((groupList) => {
        this.groupList = groupList;
      });

    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });

    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrlVvariables = res;
    });

    this.setButtonLabel();

  }

  getDataGroup(dataGroup) {
    this.grpData = dataGroup;
    this.setDateValue(dataGroup);
    // this.grpData.USR_GRP_CD = dataGroup["USR_GRP_CD"];
    // this.grpData.USR_GRP_DSC = dataGroup["USR_GRP_DSC"];
  }

  selected(index) {
    console.log(index);
    this.selectedgroup = index;
    this.clonedName = this.grpData.V_USR_GRP_CD;
    this.clonedDesc = this.grpData.V_USR_GRP_CD;
    this.clonedEndDate = this.end_date;
    this.clonedStartDate = this.start_date;
    this.dateChanged = false;
    this.descChanged = false;
    this.nameChanged = false;
    this.updateBtn = true;
    this.setButtonLabel();
  }

  onpselect(i) {

  }

  public setDateValue(dataGroup) {
    this.start_date = new Date(dataGroup.V_EFF_STRT_DT_TM);
    this.end_date = new Date(dataGroup.V_EFF_END_DT_TM);
  }

  public addGroup() {
    const data = {
      V_USR_GRP_CD: this.grpData.V_USR_GRP_CD,
      V_USR_GRP_DSC: this.grpData.V_USR_GRP_DSC,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_GRP_TYP: 'Group',
      V_EFF_STRT_DT_TM: this.start_date,
      V_EFF_END_DT_TM: this.end_date,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      REST_Service: 'Group',
      Verb : 'POST'
    };
    this.store.dispatch(new addUserGroup(data));
  }

  public updateGroup() {
    const data = {
      V_USR_GRP_CD: this.grpData.V_USR_GRP_CD,
      V_USR_GRP_DSC: this.grpData.V_USR_GRP_DSC,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_GRP_TYP: 'Group',
      V_EFF_STRT_DT_TM: this.start_date,
      V_EFF_END_DT_TM: this.end_date,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      REST_Service: 'Group',
      Verb : 'PATCH'
    };
    this.store.dispatch(new UpdateUserGroup(data));
  }

  private setButtonLabel() {
    this.updateBtn = !!this.groupList[this.selectedgroup];
  }

  public newGroupDate() {
    if (!this.selectedgroup) {
      this.start_date = new Date(Date.now());
      this.end_date = new Date(Date.now() + this.ctrlVvariables.effectiveEndDate);
    }
  }

  public deleteGroup() {
    const data = {
      V_USR_GRP_CD: this.grpData.V_USR_GRP_CD,
      V_USR_GRP_DSC: this.grpData.V_USR_GRP_DSC,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_GRP_TYP: 'Group',
      V_EFF_STRT_DT_TM: this.start_date,
      V_EFF_END_DT_TM: this.end_date,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      REST_Service: 'Group',
      Verb : 'PATCH'
    };
    this.store.dispatch(new DeleteUserGroup(data));
  }

  public nameModelChanged() {
    if (this.clonedName !== this.grpData.V_USR_GRP_CD) {
      this.nameChanged = true;
    } else {
      this.nameChanged = false;
    }
    this.checkDuplications();
  }

  public descModelChanged() {
    if (this.clonedDesc !== this.grpData.V_USR_GRP_DSC) {
      this.descChanged = true;
    } else {
      this.descChanged = false;
    }
    this.checkDuplications();
  }

  public dateChangedModel() {
    if (this.clonedEndDate !== this.end_date || this.start_date !== this.clonedStartDate) {
      this.dateChanged = true;
    } else {
      this.dateChanged = false;
    }
    this.checkDuplications();
  }

  public checkDuplications() {
    for (let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i].V_USR_GRP_CD === this.grpData.V_USR_GRP_CD) {
        this.duplicated = true;
        this.updateBtn = true;
        this.hideButton = true;
        this.deepCheck();
        return;
      } else {
        this.duplicated = false;
        this.hideButton = false;
      }
    }
  }

  private deepCheck() {
    if (this.duplicated) {
      for (let i = 0; i < this.groupList.length; i++) {
        if (this.groupList[i].V_USR_GRP_DSC === this.grpData.V_USR_GRP_DSC) {
          this.totalDuplicated = true;
          return;
        } else {
          this.totalDuplicated = false;
        }
      }
    }
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
  V_USR_GRP_CD: string;
  V_USR_GRP_DSC: string;
}
