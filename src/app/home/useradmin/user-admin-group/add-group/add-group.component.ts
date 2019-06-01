import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {UseradminService} from '../../../../services/useradmin.service2';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {GroupFormComponent} from '../group-form/group-form.component';
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import {addUserGroup} from '../../../../store/user-admin/user-group/usergroup.action';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {

  @ViewChild(GroupFormComponent) form: GroupFormComponent;

  constructor(private store: Store<AppState>,
              private userAdminService: UseradminService,
              private actions$: Actions,
              private dialogRef: MatDialogRef<AddGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.actions$.pipe(ofType(userGroupActions.ADD_USER_GROUP_SUCCESS), take(1)).subscribe((result:any) => {
      this.dialogRef.close(true);
    });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick(): void {
    if (this.form.isValid()) {
      const formData = this.form.getValue();
      this.store.dispatch(new addUserGroup(formData));
    }
  }

}
