import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {Actions, ofType} from '@ngrx/effects';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';
import {take} from 'rxjs/operators';
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import {Subscription} from 'rxjs';
import {GroupFormComponent} from '../group-form/group-form.component';
import {UpdateUserGroup} from '../../../../store/user-admin/user-group/usergroup.action';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  group: userGroup;
  actionSubscription: Subscription;
  @ViewChild(GroupFormComponent, { static: true }) form: GroupFormComponent;

  constructor(private store: Store<AppState>,
              private actions$: Actions,
              private dialogRef: MatDialogRef<EditGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.group = data.group;
  }

  ngOnInit() {
    this.actionSubscription = this.actions$.pipe(ofType(userGroupActions.UPDATE_USER_GROUP_SUCCESS), take(1)).subscribe((result: any) => {
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
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
        V_USR_GRP_CD: this.group.V_USR_GRP_CD,
        V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
        REST_Service: 'Group',
        V_GRP_TYP: this.group.V_GRP_TYP,
        Verb: 'PATCH',
        id: this.group.id
      };
      this.store.dispatch(new UpdateUserGroup(data));
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : '';
  }

}
