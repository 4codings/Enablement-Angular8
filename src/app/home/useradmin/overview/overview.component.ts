import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NoAuthDataService} from '../../../services/no-auth-data.service';
import {Action, select, Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {UseradminService} from '../../../services/useradmin.service2';
import * as usreActions from '../../../store/user-admin/user/user.action';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import {Observable, Subscription, zip} from 'rxjs';
import {User} from '../../../store/user-admin/user/user.model';
import {userGroup} from '../../../store/user-admin/user-group/usergroup.model';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import {userRole} from '../../../store/user-admin/user-role/userrole.model';
import {AuthorizationData} from '../../../store/user-admin/user-authorization/authorization.model';
import * as authActions from '../../../store/user-admin/user-authorization/authorization.actions';
import * as authSelectors from '../../../store/user-admin/user-authorization/authorization.selectors';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatRadioChange} from '@angular/material';
import {data} from '../authorize/authorize.component';
import {AddUserComponent} from '../user-admin-user/add-user/add-user.component';
import {combineLatest} from 'rxjs';
import {AddGroupComponent} from '../user-admin-group/add-group/add-group.component';
import {AddEditRoleComponent} from '../role/add-edit-role/add-edit-role.component';
import {take} from 'rxjs/operators';
import {AddEditUserComponent} from '../user-admin-user/add-edit-user/add-edit-user.component';
import {AddEditAuthorizeComponent} from '../authorize/add-edit-authorize/add-edit-authorize.component';
import {authorizationTypeOptions, groupTypeOptions} from '../useradmin.constants';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {Actions, ofType} from '@ngrx/effects';
import * as fromUserMembership from '../../../store/user-admin/user-membership/usermembership.action';
import {EditUserComponent} from '../user-admin-user/edit-user/edit-user.component';
import {EditGroupComponent} from '../user-admin-group/edit-group/edit-group.component';
import {DeleteUserGroup} from '../../../store/user-admin/user-group/usergroup.action';
import {ConfirmationAlertComponent} from '../../../shared/components/confirmation-alert/confirmation-alert.component';
import {AddRoleComponent} from '../role/add-role/add-role.component';
import {EditRoleComponent} from '../role/edit-role/edit-role.component';
import {RollserviceService} from '../../../services/rollservice.service';

declare var jQuery: any;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {


  allUsers: User[] = [];
  allGroups: userGroup[] = [];
  allRoles: userRole[] = [];
  allAuthorizations: AuthorizationData[];


  Label: any[] = [];
  public V_SRC_CD_DATA;
  public users$: Observable<User[]>;
  users: User[] = [];
  public groups$: Observable<userGroup[]>;
  groups: userGroup[] = [];
  public roles$: Observable<userRole[]>;
  roles: userRole[] = [];
  public authData$: Observable<AuthorizationData[]>;
  authorizations: AuthorizationData[];

  userGroupMap: Map<string, User[]> = new Map();
  authRoleMap: Map<string, AuthorizationData[]> = new Map();

  selectedUser: User;
  selectedAuth: AuthorizationData;

  highlightedUsers: SelectionModel<User> = new SelectionModel<User>(true);
  highlightedAuths: SelectionModel<AuthorizationData> = new SelectionModel<AuthorizationData>(true);

  groupTypeOptions = groupTypeOptions;
  selectedGroupType = this.groupTypeOptions[0];
  authorizationTypeOptions = authorizationTypeOptions;
  selectedAuthType = this.authorizationTypeOptions[0];
  subscriptions: Subscription[] = [];

  @ViewChild('contextMenu') set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  contextMenuData: User | AuthorizationData;
  contextMenuFor: 'user' | 'auth';


  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private userAdminService: UseradminService,
    private roleService: RollserviceService,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
  }

  ngOnInit() {

    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
      this.contextMenuFor = null;
    });

    this.userAdminService.getControlVariables();
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.store.dispatch(new usreActions.getUser(this.V_SRC_CD_DATA));
    this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.groups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.authData$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.getAllData();
    this.subscriptions.push(this.actions$.pipe(ofType(
      fromUserMembership.ADD_USER_MEMBERSHIP_SUCCESS)).subscribe(
      (action: Action) => {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    ));
  }

  getAllData() {
    combineLatest(this.users$, this.groups$, this.roles$, this.authData$).subscribe(result => {

      this.allUsers = result[0];
      this.allGroups = result[1];
      this.allRoles = result[2];
      this.allAuthorizations = result[3];

      this.users = result[0];
      // TODO : @hiren check if constants are define for Group type
      this.groups = result[1];
      this.roles = this.getRolesAssociatedWithGroups(this.groups, result[2]);
      this.authorizations = result[3];
      this.prepareUserGroupMap();
      this.prepareAuthRoleMap();
      this.updateSelectedDataObjRef();
    }, error => {
      console.log('http error => ', error);
    });
  }

  updateSelectedDataObjRef(): void {
    if (this.selectedUser) {
      const newUser = this.users.filter(currUser => currUser.id == this.selectedUser.id)[0];
      if (newUser) {
        this.setSelectedUser(newUser);
      }
    }
    if (this.selectedAuth) {
      const newAuth = this.authorizations.filter(currAuth => currAuth.id == this.selectedAuth.id)[0];
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
    this.groups.forEach(group => {
      const groupUsers: User[] = [];
      if (group.V_USR_ID) {
        group.V_USR_ID.forEach(gUserId => {
          const userObj = this.getDataObjById(gUserId, this.users);
          userObj ? groupUsers.push(userObj) : '';
        });
      }
      this.userGroupMap.set(group.id, groupUsers);
    });
  }

  prepareAuthRoleMap(): void {
    this.roles.forEach(role => {
      const roleAuths: AuthorizationData[] = [];
      if (role.V_AUTH_ID) {
        role.V_AUTH_ID.forEach(rAuthId => {
          const authObj = this.getDataObjById(rAuthId, this.authorizations);
          authObj ? roleAuths.push(authObj) : '';
        });
      }
      this.authRoleMap.set(role.id, roleAuths);
    });
  }

  getDataObjById(id: string, dataArr: any[]): any {
    for (let item of dataArr) {
      if (id == item.id) {
        return item;
      }
    }
    return null;
  }

  onUserTileClick(user: User): void {
    if (this.selectedUser == user) {
      this.resetSelection();
    } else {
      this.setSelectedUser(user);
    }
  }

  onUserTileDoubleClick(user: User): void {
    this.onAddUserTileClick(null);
  }

  setSelectedUser(user: User): void {
    this.resetSelection();
    this.selectedUser = user;
    if (user.V_USR_GRP_ID) {
      this.highlightAuthorizations(user);
    }
  }

  onAuthTileClick(auth: AuthorizationData): void {
    if (this.selectedAuth == auth) {
      this.resetSelection();
    } else {
      this.setSelectedAuth(auth);
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
      const group = this.getDataObjById(groupId, this.groups);
      if (group && group.V_ROLE_ID) {
        group.V_ROLE_ID.forEach(roleId => {
          const auths = this.authRoleMap.get(roleId + '');
          if (auths) {
            this.highlightedAuths.select(...auths);
          }
        });
      }
    });
  }

  highlightUsers(auth: AuthorizationData): void {
    auth.V_ROLE_ID.forEach(roleId => {
      const role: userRole = this.getDataObjById(roleId, this.roles);
      if (role && role.V_USR_GRP_ID) {
        role.V_USR_GRP_ID.forEach(groupId => {
          const users = this.userGroupMap.get(groupId + '');
          if (users) {
            this.highlightedUsers.select(...users);
          }
        });
      }
    });
  }

  resetSelection() {
    this.selectedAuth = null;
    this.selectedUser = null;
    this.highlightedUsers.clear();
    this.highlightedAuths.clear();
  }

  onAddUserTileClick(groupId: string): void {
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

  onEditUserTileClick(user: User): void {
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

  onAddGroupBtnClick(): void {
    const dialogRef = this.dialog.open(AddGroupComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {allGroups: this.allGroups}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    });
  }

  onAddRoleBtnClick(): void {
    const dialogRef = this.dialog.open(AddRoleComponent,
      {
        width: '600px',
        panelClass: 'app-dialog',
        data: {allRoles: this.allRoles}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    });
  }

  onBtnEditRoleClick(role: userRole): void {
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

  onBtnDeleteRoleClick(role: userRole): void {
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

  onAddAuthBtnClick(roleId: string): void {
    const dialogRef = this.dialog.open(AddEditAuthorizeComponent,
      {
        width: '700px',
        panelClass: 'app-dialog',
        data: {roleId: roleId}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      }
    });
  }

  userDropped(event: CdkDragDrop<User[]>, group: userGroup) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.addUserInGroup(group.id, event.item.data);
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
    this.store.dispatch(new fromUserMembership.addUserMembership(json));
  }

  authDropped(event: CdkDragDrop<AuthorizationData[]>, role: userRole) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.assignAuthToRole(role.id, event.item.data);
    }
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
      this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    }, err => {
      console.log(err);
    });
  }

  openUserContextMenu(event: MouseEvent, data?: any): void {
    this.contextMenuFor = 'user';
    this.openContextmenu(event, data);
  }

  openAuthContextMenu(event: MouseEvent, data?: any): void {
    this.contextMenuFor = 'auth';
    this.openContextmenu(event, data);
  }

  openContextmenu(event: MouseEvent, data?: any) {
    event.preventDefault();
    if (data) {
      this.contextMenuData = data;
    }
    this.contextMenuStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
    this.contextMenuActive = true;
  }

  onContextMenuEditBtnClick(): void {
    this.contextMenuActive = false;
    this.onEditUserTileClick(<User> this.contextMenuData);
  }

  onBtnDeleteGroupClick(group: userGroup): void {
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

  onBtnEditGroupClick(group: userGroup): void {
    const dialogRef = this.dialog.open(EditGroupComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {group: group}
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
