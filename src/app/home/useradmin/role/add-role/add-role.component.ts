import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as userRoleActions from '../../../../store/user-admin/user-role/userrole.action';
import {take} from 'rxjs/operators';
import {RoleFormComponent} from '../role-form/role-form.component';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit, OnDestroy {

  @ViewChild(RoleFormComponent) form: RoleFormComponent;
  actionSubscription: Subscription;
  roleAlreadyExist: boolean = false;
  allRoles: userRole[];

  constructor(private store: Store<AppState>,
              private actions$: Actions,
              private dialogRef: MatDialogRef<AddRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.allRoles = this.data.allRoles;
    this.actionSubscription = this.actions$.pipe(ofType(userRoleActions.ADD_USER_ROLE_SUCCESS), take(1)).subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick(): void {
    if (this.form.isValid()) {
      const formData = this.form.getValue();
      this.roleAlreadyExist = this.form.hasRole(formData.V_ROLE_CD);
      if (this.roleAlreadyExist) {
        return;
      }
      const data = {
        ...formData,
        V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
        REST_Service: 'Role',
        Verb: 'POST'
      };
      this.store.dispatch(new userRoleActions.AddUserRole(data));
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : '';
  }


}
