import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { userMemberShip } from 'src/app/store/user-admin/user-membership/usermembership.model';
import { Observable } from 'rxjs';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  Label: any[] = [];
  user: any[] = [];
  public users$: Observable<User[]>;
  public groups$: Observable<userGroup[]>;
  USR_DSC_R;
  USR_GRP_DSCR;

  addBtn = true;
  updateBtn = false;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: string;

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    this.store.dispatch(new usreActions.getUser());
    this.store.dispatch(new userGroupActions.getUserGroup());
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.groups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
  }
  selected(user, index) {
    this.groups$.subscribe(group => {
      group.forEach(groupArray => {
        //groupArray.is_selected_user = false;

      });
    });
    this.selecteduser = index;
    if (user.USR_GRP_ID.length > 0) {
     this.groups$.subscribe(data => {
       data.forEach(ele => {
         user.USR_GRP_ID.forEach(element => {
          if (ele.USR_GRP_ID == element) {
            console.log(ele);
            //ele.is_selected_user = true;
          }
         });

       });
     });
    }
  }
}


// this.store.dispatch(new usreActions.getUser());
//     // this.store.dispatch(new userGroupActions.getUserGroup());
//     this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
//     // this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
//     this.error$ = this.store.pipe(select(userSelectors.getErrors));
//     this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
//     this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
