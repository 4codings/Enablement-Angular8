import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {Actions, ofType} from '@ngrx/effects';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as userRoleActions from '../../../../store/user-admin/user-role/userrole.action';
import {take} from 'rxjs/operators';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';
import {RoleFormComponent} from '../role-form/role-form.component';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  role: userRole;
  actionSubscription: Subscription;
  @ViewChild(RoleFormComponent, { static: true } as any) form: RoleFormComponent;

  constructor(private store: Store<AppState>,
              private actions$: Actions,
              private dialogRef: MatDialogRef<EditRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.role = data.role;
  }

  ngOnInit() {
    this.actionSubscription = this.actions$.pipe(ofType(userRoleActions.UPDATE_USER_ROLE_SUCCESS), take(1)).subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnUpdateClick(): void {
    if (this.form.isValid()) {
      const formValue = this.form.getValue();
      const data = {
        ...formValue,
        V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
        REST_Service: 'Role',
        Verb: 'PATCH'
      };
      this.store.dispatch(new userRoleActions.UpdateUserRole(data));
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : '';
  }
}
