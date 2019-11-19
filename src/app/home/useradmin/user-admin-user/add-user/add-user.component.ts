import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { AppState } from "../../../../app.state";
import { UseradminService } from "../../../../services/useradmin.service2";
import * as userGroupActions from "../../../../store/user-admin/user-group/usergroup.action";
import * as userActions from "../../../../store/user-admin/user/user.action";
import { User } from "../../../../store/user-admin/user/user.model";
import { UserFormComponent } from "../user-form/user-form.component";
import { UserListComponent } from "../user-list/user-list.component";
import { AddUser } from '../../../../store/user-admin/user/user.action';

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit, OnDestroy {
  selectedView: "selectUser" | "addNewUser" = "selectUser";
  selectedUser: User;
  actionSubscription: Subscription;
  userAlreadyExist: boolean = false;
  allUsers: User[] = [];
  @ViewChild(UserFormComponent, { static: false } as any)
  userForm: UserFormComponent;
  @ViewChild(UserListComponent, { static: false } as any)
  userList: UserListComponent;
  userFormValid = false;
  groups: userGroup[];
  selectedGroupId = [];
  constructor(
    private store: Store<AppState>,
    private userAdminService: UseradminService,
    private actions$: Actions,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.selectedGroupId = [];
    this.selectedGroupId.push(this.data.groupId);
    this.userAdminService.getControlVariables();
    const V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem("u")).SRC_CD
    };
    this.allUsers = this.data.allUsers;
    this.groups = this.data.allGroups;
    this.actionSubscription = this.actions$
      .pipe(
        ofType(userActions.ADD_USER_SUCCESS),
        take(1)
      )
      .subscribe((result: any) => {
        this.addUserInGroup(this.selectedGroupId, result.payload[0]);
      });
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }
  OnTabChange(tabIndex) {
    if (!tabIndex) {
      this.selectedView = "selectUser";
    } else {
      this.selectedView = "addNewUser";
    }
  }
  onBtnAddClick(): void {
    switch (this.selectedView) {
      case "selectUser":
        if (this.userList && this.selectedUser) {
          this.addUserInGroup(this.data.groupId, this.selectedUser);
        }
        break;
      case "addNewUser":
        if (this.userForm.isValid()) {
          const userData = this.userForm.getValue();
          if (this.groups.length) {
            if (userData.V_GROUP_NAME_WORKFLOW.length) {
              userData.V_GROUP_NAME_WORKFLOW.forEach(ele => {
                let i = this.groups.findIndex(v => v.V_USR_GRP_DSC == ele.label);
                if (i > -1) {
                  this.selectedGroupId.push(this.groups[i].V_USR_GRP_ID);
                }
              });
            }
            if (userData.V_GROUP_NAME_SYSTEM.length) {
              userData.V_GROUP_NAME_SYSTEM.forEach(ele => {
                let i = this.groups.findIndex(v => v.V_USR_GRP_DSC == ele.label);
                if (i > -1) {
                  this.selectedGroupId.push(this.groups[i].V_USR_GRP_ID);
                }
              });
            }
            if (userData.V_GROUP_NAME_ADMINISTRATOR.length) {
              userData.V_GROUP_NAME_ADMINISTRATOR.forEach(ele => {
                let i = this.groups.findIndex(v => v.V_USR_GRP_DSC == ele.label);
                if (i > -1) {
                  this.selectedGroupId.push(this.groups[i].V_USR_GRP_ID);
                }
              });
            }
          }
          console.log('selected id', this.selectedGroupId);
          delete userData['V_GROUP_NAME_ADMINISTRATOR']
          delete userData['V_GROUP_NAME_SYSTEM']
          delete userData['V_GROUP_NAME_WORKFLOW']
          this.userAlreadyExist = this.userForm.hasUser(userData.V_USR_NM);
          if (this.userAlreadyExist) {
            return;
          }
          console.log('userdata', userData);
          this.store.dispatch(new AddUser(userData));
        }
        break;
    }
  }

  addUserInGroup(groupId: any, user: User): void {
    let json = {
      V_DELETED_ID_ARRAY: "",
      V_ADDED_ID_ARRAY: groupId + "",
      SELECTED_ENTITY: ["USER"],
      SELECTED_ENTITY_ID: user.id.split(" "),
      V_EFF_STRT_DT_TM: [new Date(Date.now())],
      V_EFF_END_DT_TM: [
        new Date(
          Date.now() + this.userAdminService.controlVariables.effectiveEndDate
        )
      ],
      REST_Service: ["User_Group"],
      Verb: ["POST"],
      V_IS_PRIMARY: user.V_IS_PRIMARY ? "Y" : "N"
    };
    console.log('json', json);
    this.userAdminService.postSecuredJSON(json).subscribe(
      res => {
        const V_SRC_CD_DATA = {
          V_SRC_CD: JSON.parse(sessionStorage.getItem("u")).SRC_CD
        };
        this.store.dispatch(new userGroupActions.getUserGroup(V_SRC_CD_DATA));
        this.dialogRef.close();
      },
      err => { }
    );
  }

  onUserSelect(user: User): void {
    if (user != null) {
      this.selectedUser = user;
      this.userFormValid = true;
    } else {
      this.userFormValid = false;
    }
  }

  ngOnDestroy(): void {
    this.actionSubscription ? this.actionSubscription.unsubscribe() : "";
  }
  onUserFormVallidation(event) {
    this.userFormValid = event;
  }
}
