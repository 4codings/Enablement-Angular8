import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import * as userActions from '../../../../store/user-admin/user/user.action';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Actions, ofType} from '@ngrx/effects';
import {AddUser} from '../../../../store/user-admin/user/user.action';
import {UseradminService} from '../../../../services/useradmin.service2';
import {User} from '../../../../store/user-admin/user/user.model';
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  @ViewChild(UserFormComponent) userForm: UserFormComponent;

  constructor(private store: Store<AppState>,
              private userAdminService: UseradminService,
              private actions$: Actions,
              private dialogRef: MatDialogRef<AddUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.userAdminService.getControlVariables();
    this.actions$.pipe(ofType(userActions.ADD_USER_SUCCESS),take(1)).subscribe((result:any) => {
      console.log(result);
      this.addUserInGroup(this.data.groupId, result.payload[0]);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick(): void {
    if (this.userForm.isValid()) {
      const userData = this.userForm.getValue();
      this.store.dispatch(new AddUser(userData));
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
