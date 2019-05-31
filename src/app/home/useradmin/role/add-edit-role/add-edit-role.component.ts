import {Component, Inject, OnInit} from '@angular/core';
import {RoleComponent} from '../role.component';
import {NoAuthDataService} from '../../../../services/no-auth-data.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {UseradminService} from '../../../../services/useradmin.service2';
import {Actions, ofType} from '@ngrx/effects';
import * as userRoleActions from '../../../../store/user-admin/user-role/userrole.action';
import {take, tap} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent extends RoleComponent implements OnInit {

  constructor(public noAuthData: NoAuthDataService,
              protected store: Store<AppState>,
              protected userAdminService: UseradminService,
              protected actions$: Actions,
              private dialogRef: MatDialogRef<AddEditRoleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(noAuthData, store, userAdminService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$.pipe(ofType(userRoleActions.ADD_USER_ROLE_SUCCESS, userRoleActions.UPDATE_USER_ROLE_SUCCESS, userRoleActions.DELETE_USER_ROLE_SUCCESS),
      take(1),
      tap(action => {
      this.dialogRef.close();
    })).subscribe();
  }

}
