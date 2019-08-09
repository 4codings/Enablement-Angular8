import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {UseradminService} from '../../../../services/useradmin.service2';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../../store/user-admin/user/user.model';
import {take} from 'rxjs/operators';
import {AddUser, UpdateUser} from '../../../../store/user-admin/user/user.action';
import {Observable, Subscription} from 'rxjs';
import {UserFormComponent} from '../user-form/user-form.component';
import * as userActions from '../../../../store/user-admin/user/user.action';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: User;
  group: string;
  actionSubscription: Subscription;
  @ViewChild(UserFormComponent) userForm: UserFormComponent;

  constructor(private store: Store<AppState>,
              private userAdminService: UseradminService,
              private actions$: Actions,
              private dialogRef: MatDialogRef<EditUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
    this.group = data.group;
  }

  ngOnInit() {
    this.actionSubscription = this.actions$.pipe(ofType(userActions.UPDATE_USER_SUCCESS), take(1)).subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnUpdateClick(): void {
    if (this.userForm.isValid()) {
      const userData = this.userForm.getValue();
      const data = {
       ...userData,
        V_USR_NM: this.user.V_USR_NM,
        REST_Service: 'User',
        Verb: 'PATCH',
        id: this.user.id,
      };
      this.store.dispatch(new UpdateUser(data));
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : '';
  }

}
