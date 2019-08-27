import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import * as userActions from '../../../../store/user-admin/user/user.action';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { AddUser } from '../../../../store/user-admin/user/user.action';
import { UseradminService } from '../../../../services/useradmin.service2';
import { User } from '../../../../store/user-admin/user/user.model';
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import { take } from 'rxjs/operators';
import * as userSelectors from '../../../../store/user-admin/user/user.selectors';
import * as usreActions from '../../../../store/user-admin/user/user.action';
import { UserListComponent } from '../user-list/user-list.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  selectedView: 'selectUser' | 'addNewUser' = 'selectUser';
  selectedUser: User;
  actionSubscription: Subscription;
  userAlreadyExist: boolean = false;
  allUsers: User[] = [];
  @ViewChild(UserFormComponent, { static: false } as any) userForm: UserFormComponent;
  @ViewChild(UserListComponent, { static: false } as any) userList: UserListComponent;

  constructor(private store: Store<AppState>,
    private userAdminService: UseradminService,
    private actions$: Actions,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.userAdminService.getControlVariables();
    const V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.allUsers = this.data.allUsers;
    this.actionSubscription = this.actions$.pipe(ofType(userActions.ADD_USER_SUCCESS), take(1)).subscribe((result: any) => {
      this.addUserInGroup(this.data.groupId, result.payload[0]);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }
  OnTabChange(tabIndex) {
    if (!tabIndex) {
      this.selectedView = 'selectUser';
    } else {
      this.selectedView = 'addNewUser';
    }
    console.log('event', event);
  }
  onBtnAddClick(): void {
    switch (this.selectedView) {
      case 'selectUser':
        if (this.userList && this.selectedUser) {
          this.addUserInGroup(this.data.groupId, this.selectedUser);
        }
        break;
      case 'addNewUser':
        if (this.userForm.isValid()) {
          const userData = this.userForm.getValue();
          this.userAlreadyExist = this.userForm.hasUser(userData.V_USR_NM);
          if (this.userAlreadyExist) {
            return;
          }
          this.store.dispatch(new AddUser(userData));
        }
        break;
    }
  }

  addUserInGroup(groupId: string, user: User): void {
    let json = {
      'V_DELETED_ID_ARRAY': '',
      'V_ADDED_ID_ARRAY': groupId + '',
      'SELECTED_ENTITY': ['USER'],
      'SELECTED_ENTITY_ID': user.id.split(' '),
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
      'REST_Service': ['User_Group'],
      'Verb': ['POST'],
      'V_IS_PRIMARY': user.V_IS_PRIMARY ? 'Y' : 'N',
    };
    this.userAdminService.postSecuredJSON(json).subscribe(res => {
      const V_SRC_CD_DATA = {
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      };
      this.store.dispatch(new userGroupActions.getUserGroup(V_SRC_CD_DATA));
      this.dialogRef.close();
    }, err => {
    });
  }

  onUserSelect(user: User): void {
    this.selectedUser = user;
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : '';
  }

}
