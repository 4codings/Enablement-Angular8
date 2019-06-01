import {Component, OnInit} from '@angular/core';
import {NoAuthDataService} from '../../../services/no-auth-data.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {UseradminService} from '../../../services/useradmin.service2';
import * as usreActions from '../../../store/user-admin/user/user.action';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import {Observable, zip} from 'rxjs';
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

@Component({
  selector: 'app-authorize-user',
  templateUrl: './authorize-user.component.html',
  styleUrls: ['./authorize-user.component.scss']
})
export class AuthorizeUserComponent implements OnInit {
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

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private userAdminService: UseradminService,
    private dialog: MatDialog
  ) {
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
  }

  ngOnInit() {
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
  }

  getAllData() {
    combineLatest(this.users$, this.groups$, this.roles$, this.authData$).subscribe(result => {
      this.users = result[0];
      // TODO : @hiren check if constants are define for Group type
      this.groups = result[1];
      this.roles = result[2];
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
    const dialogRef = this.dialog.open(AddEditUserComponent,
      {
        panelClass: 'app-dialog',
        width: '600px',
        data: {groupId: groupId}
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
        panelClass: 'app-dialog'
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }
    });
  }

  onAddRoleBtnClick(): void {
    const dialogRef = this.dialog.open(AddEditRoleComponent,
      {
        width: '600px',
        panelClass: 'app-dialog'
      });
    dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
      if (flag) {
        this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
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

}
