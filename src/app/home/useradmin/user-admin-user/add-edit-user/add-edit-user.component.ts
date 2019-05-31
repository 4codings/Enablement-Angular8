import {Component, Inject, OnInit} from '@angular/core';
import {UserAdminUserComponent} from '../user-admin-user.component';
import {NoAuthDataService} from '../../../../services/no-auth-data.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {UseradminService} from '../../../../services/useradmin.service2';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {take, tap} from 'rxjs/operators';
import * as userActions from '../../../../store/user-admin/user/user.action';
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import {User} from '../../../../store/user-admin/user/user.model';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent extends UserAdminUserComponent implements OnInit {

  constructor(public noAuthData: NoAuthDataService,
              protected store: Store<AppState>,
              protected userAdminService: UseradminService,
              protected actions$: Actions,
              private dialogRef: MatDialogRef<AddEditUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(noAuthData, store, userAdminService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.userAdminService.getControlVariables();
    this.actions$.pipe(ofType(userActions.ADD_USER_SUCCESS, userActions.UPDATE_USER_SUCCESS),
      take(1))
      .subscribe((action: userActions.Actions) => {
        if (action.type == userActions.ADD_USER_SUCCESS) {
          this.addUserInGroup(this.data.groupId, action.payload[0]);
        }
        if (action.type == userActions.UPDATE_USER_SUCCESS) {
          this.dialogRef.close();
        }
      });
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
      'Verb': ['POST']
    };
    this.userAdminService.postSecuredJSON(json).subscribe(res => {
      const V_SRC_CD_DATA = {
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      };
      this.store.dispatch(new userGroupActions.getUserGroup(V_SRC_CD_DATA));
      this.dialogRef.close();
    }, err => {
      console.log(err);
    });
  }

}
