import {Injectable, OnDestroy} from '@angular/core';
import {User} from '../../../store/user-admin/user/user.model';
import {userGroup} from '../../../store/user-admin/user-group/usergroup.model';
import {userRole} from '../../../store/user-admin/user-role/userrole.model';
import {AuthorizationData} from '../../../store/user-admin/user-authorization/authorization.model';
import {select, Store} from '@ngrx/store';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as authSelectors from '../../../store/user-admin/user-authorization/authorization.selectors';
import {BehaviorSubject, combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {AppState} from '../../../app.state';
import {SelectionModel} from '@angular/cdk/collections';
import * as usreActions from '../../../store/user-admin/user/user.action';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';
import * as authActions from '../../../store/user-admin/user-authorization/authorization.actions';
import {take, takeUntil} from 'rxjs/operators';
import {AddUserComponent} from '../user-admin-user/add-user/add-user.component';
import {MatDialog} from '@angular/material';
import {EditUserComponent} from '../user-admin-user/edit-user/edit-user.component';
import {ConfirmationAlertComponent} from '../../../shared/components/confirmation-alert/confirmation-alert.component';
import {UseradminService} from '../../../services/useradmin.service2';
import * as fromUserMembership from '../../../store/user-admin/user-membership/usermembership.action';
import {AddGroupComponent} from '../user-admin-group/add-group/add-group.component';
import {EditGroupComponent} from '../user-admin-group/edit-group/edit-group.component';
import {DeleteUserGroup} from '../../../store/user-admin/user-group/usergroup.action';
import {AddRoleComponent} from '../role/add-role/add-role.component';
import {EditRoleComponent} from '../role/edit-role/edit-role.component';
import {AddEditAuthorizeComponent} from '../authorize/add-edit-authorize/add-edit-authorize.component';
import {RollserviceService} from '../../../services/rollservice.service';
import {authorizationTypeOptions, groupTypeOptions} from '../useradmin.constants';
import {Actions, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AssignRoleModalComponent} from '../assignrole/assign-role-modal/assign-role-modal.component';
import {AssignGroupModalComponent} from '../assignrole/assign-group-modal/assign-group-modal.component';

@Injectable()
export class OverviewService implements OnDestroy {

  allUsers: User[] = [];
  allGroups: userGroup[] = [];
  allRoles: userRole[] = [];
  allAuthorizations: AuthorizationData[];

  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.allUsers);
  public groups$: BehaviorSubject<userGroup[]> = new BehaviorSubject<userGroup[]>(this.allGroups);
  public roles$: BehaviorSubject<userRole[]> = new BehaviorSubject<userRole[]>(this.allRoles);
  public authData$: BehaviorSubject<AuthorizationData[]> = new BehaviorSubject<AuthorizationData[]>(this.allAuthorizations);

  highlightedUsers: SelectionModel<User> = new SelectionModel<User>(true);
  highlightedAuths: SelectionModel<AuthorizationData> = new SelectionModel<AuthorizationData>(true);

  highlightedUsers$: BehaviorSubject<SelectionModel<User>> = new BehaviorSubject<SelectionModel<User>>(this.highlightedUsers);
  highlightedAuths$: BehaviorSubject<SelectionModel<AuthorizationData>> = new BehaviorSubject<SelectionModel<AuthorizationData>>(this.highlightedAuths);

  userGroupMap: Map<string, User[]> = new Map();
  authRoleMap: Map<string, AuthorizationData[]> = new Map();

  selectedUser: User;
  selectedAuth: AuthorizationData;
  selectedUser$: BehaviorSubject<User> = new BehaviorSubject<User>(this.selectedUser);
  selectedAuth$: BehaviorSubject<AuthorizationData> = new BehaviorSubject<AuthorizationData>(this.selectedAuth);

  userGroupMapStream: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  authRoleMapStream: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  userGroupMap$ = this.userGroupMapStream.asObservable();
  authRoleMap$ = this.authRoleMapStream.asObservable();

  selectedAuthType = authorizationTypeOptions[1];
  selectedAuthType$: BehaviorSubject<{ key: string, label: string }> = new BehaviorSubject<{ key: string, label: string }>(this.selectedAuthType);

  selectedGroupType = groupTypeOptions[3];
  selectedGroupType$: BehaviorSubject<{ key: string, label: string }> = new BehaviorSubject<{ key: string, label: string }>(this.selectedGroupType);

  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  V_SRC_CD_DATA: any;
  constructor(private store: Store<AppState>,
              private userAdminService: UseradminService,
              private roleService: RollserviceService,
              private actions: Actions,
              private dialog: MatDialog) {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.userAdminService.getControlVariables();
    this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
    this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    const users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    const groups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    const roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    const authData$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.getAllData(users$, groups$, roles$, authData$);
    this.actions.pipe(ofType(fromUserMembership.ADD_USER_MEMBERSHIP_SUCCESS), takeUntil(this.unsubscribeAll)).subscribe(action => {
      this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    });
  }

  getAllData(users$: Observable<User[]>, groups$: Observable<userGroup[]>, roles$: Observable<userRole[]>, authData$: Observable<AuthorizationData[]>) {
    combineLatest(users$, groups$).pipe(takeUntil(this.unsubscribeAll)).subscribe(result => {
      this.allUsers = result[0] ? result[0].sort(this.sortById) : result[0];
      this.allGroups = result[1] ? result[1].sort(this.sortById) : result[1];
      this.users$.next(this.allUsers);
      this.groups$.next(this.allGroups);

      this.prepareUserGroupMap();
      this.updateSelectedDataObjRef();
    }, error => {
      console.log('http error => ', error);
    });
    combineLatest(roles$, authData$).pipe(takeUntil(this.unsubscribeAll)).subscribe(result => {
      this.allRoles = result[0] ? result[0].sort(this.sortById) : result[0];
      this.allAuthorizations = result[1] ? result[1].sort(this.sortById) : result[1];

      this.roles$.next(this.allRoles);
      this.authData$.next(this.allAuthorizations);

      this.prepareAuthRoleMap();
      this.updateSelectedDataObjRef();
    }, error => {
      console.log('http error => ', error);
    });
  }

  sortById(a, b) {
    if (+a.id > +b.id) {
      return 1;
    } else if (+a.id < +b.id) {
      return -1;
    } else {
      return 0;
    }
  };

  selectGroupType(type): void {
    this.selectedGroupType = type;
    this.selectedGroupType$.next(this.selectedGroupType);
  }


  selectAuthType(type): void {
    this.selectedAuthType = type;
    this.selectedAuthType$.next(this.selectedAuthType);
  }

  updateSelectedDataObjRef(): void {
    if (this.selectedUser) {
      const newUser = this.allUsers.filter(currUser => currUser.id == this.selectedUser.id)[0];
      if (newUser) {
        this.setSelectedUser(newUser);
      }
    }
    if (this.selectedAuth) {
      const newAuth = this.allAuthorizations.filter(currAuth => currAuth.id == this.selectedAuth.id)[0];
      if (newAuth) {
        this.setSelectedAuth(newAuth);
      }
    }
  }

  getRolesAssociatedWithGroups(allGroup: userGroup[], allRoles: userRole[]): userRole[] {
    const roleIdMap = new Map<string, userRole>();
    allGroup.forEach(group => {
      if (group.V_ROLE_ID) {
        group.V_ROLE_ID.forEach(roleId => {
          let roleObj = this.getDataObjById(roleId, allRoles);
          if (roleObj) {
            roleIdMap.set(`${roleId}`, roleObj);
          }
        });
      }
    });
    return Array.from(roleIdMap.values());
  }

  prepareUserGroupMap(): void {
    this.allGroups.forEach(group => {
      const groupUsers: User[] = [];
      if (group.V_USR_ID) {
        group.V_USR_ID.forEach(gUserId => {
          const userObj = this.getDataObjById(gUserId, this.allUsers);
          userObj ? groupUsers.push(userObj) : '';
        });
      }
      this.userGroupMap.set(group.id, groupUsers);
    });
    this.userGroupMapStream.next(true);
  }

  prepareAuthRoleMap(): void {
    this.allRoles.forEach(role => {
      const roleAuths: AuthorizationData[] = [];
      if (role.V_AUTH_ID) {
        role.V_AUTH_ID.forEach(rAuthId => {
          const authObj = this.getDataObjById(rAuthId, this.allAuthorizations);
          authObj ? roleAuths.push(authObj) : '';
        });
      }
      this.authRoleMap.set(role.id, roleAuths);
    });
    this.authRoleMapStream.next(true);
  }

  getDataObjById(id: string, dataArr: any[]): any {
    for (let item of dataArr) {
      if (id == item.id) {
        return item;
      }
    }
    return null;
  }

  setSelectedUser(user: User): void {
    this.resetSelection();
    this.selectedUser = user;
    if (user.V_USR_GRP_ID) {
      this.highlightAuthorizations(user);
    }
  }

  setSelectedAuth(auth: AuthorizationData): void {
    this.resetSelection();
    this.selectedAuth = auth;
    if (auth.V_ROLE_ID) {
      this.highlightUsers(auth);
    }
  }

  highlightAuthorizations(user: User): void {
    user.V_USR_GRP_ID.forEach(groupId => {
      const group = this.getDataObjById(groupId, this.allGroups);
      if (group && group.V_ROLE_ID) {
        group.V_ROLE_ID.forEach(roleId => {
          const auths = this.authRoleMap.get(roleId + '');
          if (auths) {
            this.highlightedAuths.select(...auths);
          }
        });
      }
    });
    this.highlightedAuths$.next(this.highlightedAuths);
    this.sortDataByPriority(this.allRoles, this.highlightedAuths.selected, 'V_ROLE_ID');
    this.roles$.next([...this.allRoles]);
  }

  highlightUsers(auth: AuthorizationData): void {
    auth.V_ROLE_ID.forEach(roleId => {
      const role: userRole = this.getDataObjById(roleId, this.allRoles);
      if (role && role.V_USR_GRP_ID) {
        role.V_USR_GRP_ID.forEach(groupId => {
          const users = this.userGroupMap.get(groupId + '');
          if (users) {
            this.highlightedUsers.select(...users);
          }
        });
      }
    });
    this.highlightedUsers$.next(this.highlightedUsers);
    this.sortDataByPriority(this.allGroups, this.highlightedUsers.selected, 'V_USR_GRP_ID');
    this.groups$.next([...this.allGroups]);
  }

  resetSelection() {
    this.selectedAuth = null;
    this.selectedUser = null;
    this.highlightedUsers.clear();
    this.highlightedAuths.clear();
    this.selectedUser$.next(this.selectedUser);
    this.selectedAuth$.next(this.selectedAuth);
    this.highlightedUsers$.next(this.highlightedUsers);
    this.highlightedAuths$.next(this.highlightedAuths);
  }

  sortDataByPriority(dataToSort: any[], dataToCompare: any[], dataField: string): void {
    let tempData;
    for (let i = 0; dataToSort && i < dataToSort.length - 1; i++) {
      for (let j = i + 1; dataToSort && j < dataToSort.length; j++) {
        let a = false;
        let b = false;
        for (let currData of dataToCompare) {
          if (currData[dataField] && currData[dataField].indexOf(+dataToSort[j].id) > -1) {
            a = true;
            break;
          }
        }
        for (let currData of dataToCompare) {
          if (currData[dataField] && currData[dataField].indexOf(+dataToSort[i].id) > -1) {
            b = true;
            break;
          }
        }
        if (a && !b) {
          tempData = dataToSort[j];
          dataToSort[j] = dataToSort[i];
          dataToSort[i] = tempData;
        }
      }
    }
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.selectedUser$.next(this.selectedUser);
  }

  selectAuth(auth: AuthorizationData): void {
    this.selectedAuth = auth;
    this.selectedAuth$.next(this.selectedAuth);
  }

  openAddUserDialog(groupId: string): void {
    const dialogRef = this.dialog.open(AddUserComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {groupId: groupId, allUsers: this.allUsers}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
      }
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {user: user}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
      }
    });
  }

  deleteUserFromGroup(group: userGroup, user: User): void {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
      });
    dialogRef.componentInstance.title = `Delete User from Group`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete user <strong>${user.V_USR_NM}</strong> from group <strong>${group.V_USR_GRP_CD}</strong>?`;
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        let json = {
          'V_DELETED_ID_ARRAY': group.id,
          'V_ADDED_ID_ARRAY': '',
          'SELECTED_ENTITY': ['USER'],
          'SELECTED_ENTITY_ID': user.id.split(' '),
          'V_EFF_STRT_DT_TM': [new Date(Date.now())],
          'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
          'REST_Service': ['User_Group'],
          'Verb': ['POST']
        };
        this.store.dispatch(new fromUserMembership.addUserMembership(json));
      }
    });
  }

  addUserInGroup(group: userGroup, user: User): void {
    let json = {
      'V_DELETED_ID_ARRAY': '',
      'V_ADDED_ID_ARRAY': group.id + '',
      'SELECTED_ENTITY': ['USER'],
      'SELECTED_ENTITY_ID': user.id.split(' '),
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
      'REST_Service': ['User_Group'],
      'Verb': ['POST']
    };
    this.store.dispatch(new fromUserMembership.addUserMembership(json));
  }

  openAddGroupDialog(): void {
    this.dialog.open(AddGroupComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {allGroups: this.allGroups, controlVariables: this.userAdminService.controlVariables}
      });
  }

  openEditGroupDialog(group: userGroup): void {
    this.dialog.open(EditGroupComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {group: group, controlVariables: this.userAdminService.controlVariables}
      });
  }

  deleteGroup(group: userGroup): void {
    const data = {
      V_USR_GRP_CD: group.V_USR_GRP_CD,
      V_USR_GRP_DSC: group.V_USR_GRP_DSC,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_GRP_TYP: 'Group',
      V_EFF_STRT_DT_TM: new Date(group.V_EFF_STRT_DT_TM),
      V_EFF_END_DT_TM: new Date(group.V_EFF_END_DT_TM),
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      REST_Service: 'Group',
      Verb: 'PATCH',
      id: group.id
    };
    const dialogRef = this.dialog.open(ConfirmationAlertComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
      });
    dialogRef.componentInstance.title = `Delete Group - ${group.V_USR_GRP_CD}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete group <strong>${group.V_USR_GRP_CD}</strong>?`;
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new DeleteUserGroup(data));
      }
    });
  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {allRoles: this.allRoles}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        //this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    });
  }

  openEditRoleDialog(role: userRole): void {
    const dialogRef = this.dialog.open(EditRoleComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {role: role}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
      }
    });
  }

  deleteRole(role: userRole): void {
    const data = {
      V_ROLE_CD: role.V_ROLE_CD,
      V_ROLE_DSC: role.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'DELETE',
      id: role.id
    };
    const dialogRef = this.dialog.open(ConfirmationAlertComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
      });
    dialogRef.componentInstance.title = `Delete Role - ${role.V_ROLE_CD}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete role <strong>${role.V_ROLE_CD}</strong>?`;
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userRoleActions.DeleteUserRole(data));
      }
    });
  }

  openAddAuthDialog(roleId: string): void {
    const dialogRef = this.dialog.open(AddEditAuthorizeComponent,
      {
        width: '700px',
        panelClass: 'app-dialog',
        data: {roleId: roleId, authType: this.selectedAuthType.key}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
      }
    });
  }

  openEditAuthDialog(auth: AuthorizationData): void {
    const dialogRef = this.dialog.open(AddEditAuthorizeComponent,
      {
        width: '700px',
        panelClass: 'app-dialog',
        data: {auth: auth}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
      }
    });
  }

  assignAuthToRole(roleId: string, auth: AuthorizationData): void {
    if (!auth) {
      return;
    }
    let json = {
      'V_DELETED_ID_ARRAY': '',
      'V_ADDED_ID_ARRAY': auth.id,
      'SELECTED_ENTITY': ['ROLE'],
      'SELECTED_ENTITY_ID': [roleId],
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
      'REST_Service': ['Role_Auth'],
      'Verb': ['POST']
    };
    this.roleService.assignAuthToRole(json).subscribe(res => {
      this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
    }, err => {
      console.log(err);
    });
  }

  deleteAuthFromRole(role: userRole, auth: AuthorizationData): void {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
      });
    dialogRef.componentInstance.title = `Delete Authorization from Role`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete auth <strong>${auth.V_AUTH_CD}</strong> from role <strong>${role.V_ROLE_CD}</strong>?`;
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        let json = {
          'V_DELETED_ID_ARRAY': auth.id,
          'V_ADDED_ID_ARRAY': '',
          'SELECTED_ENTITY': ['ROLE'],
          'SELECTED_ENTITY_ID': [role.id],
          'V_EFF_STRT_DT_TM': [new Date(Date.now())],
          'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
          'REST_Service': ['Role_Auth'],
          'Verb': ['POST']
        };
        this.roleService.assignAuthToRole(json).subscribe(res => {
          this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
        }, err => {
          console.log(err);
        });
      }
    });
  }

  uploadFile(event: any, fileName: string, moduleName: string) {
    const fileList: FileList = event.target.files;
    (fileList.item(0));
    this.userAdminService.fileUpload(fileList.item(0), fileName, moduleName).subscribe(
      res => {
        (res);
        setTimeout(() => {
          //this.getUser();
          this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
        }, 3000);
      },
      error => {
        console.error(error);

      }
    );
  }

  downloadFile(fileName: any) {
    this.userAdminService.downloadFile(fileName);
  }

  openAssignRoleToGroupDialog(group: userGroup): void {
    const dialogRef = this.dialog.open(AssignRoleModalComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {group: group, roles: this.allRoles, controlVariables: this.userAdminService.controlVariables}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
      }
    });
  }

  openAssignGroupToRoleDialog(role: userRole): void {
    const dialogRef = this.dialog.open(AssignGroupModalComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {role: role, groups: this.allGroups, controlVariables: this.userAdminService.controlVariables}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
      }
    });
  }

  ngOnDestroy(): void {
    this.users$.complete();
    this.groups$.complete();
    this.roles$.complete();
    this.authData$.complete();
    this.userGroupMapStream.complete();
    this.authRoleMapStream.complete();
    this.selectedUser$.complete();
    this.selectedAuth$.complete();
    this.selectedAuthType$.complete();
    this.unsubscribeAll.next(true);
    this.highlightedAuths$.complete();
    this.highlightedUsers$.complete();
    this.unsubscribeAll.complete();
  }

}
