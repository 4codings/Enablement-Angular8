import { Component, OnInit, HostListener } from '@angular/core';
import { NoAuthDataService } from '../../../services/no-auth-data.service';
import { Observable } from 'rxjs';
import { userRole } from '../../../store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../app.state';
import {addUserGroup, UpdateUserGroup} from '../../../store/user-admin/user-group/usergroup.action';
import {AddUserRole, DeleteUserRole, UpdateUserRole} from '../../../store/user-admin/user-role/userrole.action';
import { UserAdminService } from '../../../services/user-admin.service';
import { UseradminService } from '../../../services/useradmin.service2';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  Label: any[] = [];
  userRoles$: Observable<userRole[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  roleData = new roleData;
  selecteduser: string;
  public screenHeight = 0;
  public screenWidth = 0;
  public mobileView = false;
  public desktopView = true;

  updateBtn = false;

  public nameChanged = false;
  protected clonedName = '';

  public descChanged = false;
  protected clonedDesc = '';

  public duplicated = false;
  protected roleList = [];

  public totalDuplicated = false;
  public hideButton = false;

  public showDelete = false;
  selectedRoleid;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }

  constructor(
    public noAuthData: NoAuthDataService,
    protected store: Store<AppState>,
    protected userAdminService:UseradminService
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      this.Label = data;
    });
    const data = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.store.dispatch(new userRoleActions.getUserRole(data));
    this.userRoles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));

    this.userRoles$
      .subscribe((val) => {
        this.roleList = val;
      });

    this.setButtonLabel();
  }
  getRollData(roleSelectData) {
    this.roleData = roleSelectData;
  }
  selected(index) {
    this.selecteduser = index.toString();
    this.setButtonLabel();
    this.clonedName = this.roleData.V_ROLE_CD;
    this.clonedDesc = this.roleData.V_ROLE_DSC;
    this.updateBtn = true;
    this.nameChanged = false;
    this.descChanged = false;
    this.duplicated = true;
  }

  protected setButtonLabel() {
    this.updateBtn = !!this.selecteduser;
  }

  public addRole() {
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'POST'
    };
    this.store.dispatch(new userRoleActions.AddUserRole(data));
  }

  public updateRole() {
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'PATCH'
    };
    this.store.dispatch(new userRoleActions.UpdateUserRole(data));
  }

  public deleteRole() {
    const data = {
      V_ROLE_CD: this.roleData.V_ROLE_CD,
      V_ROLE_DSC: this.roleData.V_ROLE_DSC,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      REST_Service: 'Role',
      Verb: 'DELETE',
      id:this.selectedRoleid
    };

    this.store.dispatch(new userRoleActions.DeleteUserRole(data));
  }

  changeRole() {
    // const x = roleData.ROLE_CD;
    // if (this.roleData != null) {
    //   this.userRoles$.subscribe(data => {
    //     const result = data.filter(s => s.ROLE_CD == x);
    //   });
    // }
  }

  public nameModelChanged() {
    if (this.clonedName.toLowerCase() !== this.roleData.V_ROLE_CD.toLowerCase()) {
      this.nameChanged = true;
    } else {
      this.nameChanged = false;
    }
    this.checkDuplications();
  }

  public descModelChanged() {
    if (this.clonedDesc !== this.roleData.V_ROLE_DSC) {
      this.descChanged = true;
    } else {
      this.descChanged = false;
    }
    this.checkDuplications();
  }

  public checkDuplications() {
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].V_ROLE_CD === this.roleData.V_ROLE_CD) {
        this.duplicated = true;
        this.updateBtn = true;
        this.hideButton = false;
        this.deepCheck();
        return;
      } else {
        this.duplicated = false;
        this.hideButton = true;
      }
    }
  }

  protected deepCheck() {
    if (this.duplicated) {
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].V_ROLE_DSC === this.roleData.V_ROLE_DSC) {
          this.totalDuplicated = true;
          return;
        } else {
          this.totalDuplicated = false;
        }
      }
    }
  }

  downloadFile() {
    this.userAdminService.downloadFile('RoleDL.xlsx');
  }

  uploadData() {
    document.getElementById('Document_File').click();
  }

  fileChangeEvent(event: any, file: any) {
    const fileList: FileList = event.target.files;
    ('====================');
    (fileList.item(0));
    this.userAdminService.fileUpload(fileList.item(0), 'RoleDL.xlsx', 'role').subscribe(
      res => {
        (res);
        setTimeout(() => {
          //this.getUser();
        }, 3000);
    },
      error => {
        console.error(error);

      }
    );
  }

  selectedRoleId(id) {
    this.selectedRoleid = id;
    this.store.dispatch(new userRoleActions.selectRoleId(id));
  }

}

export class roleData {
  ROLE_CD: string;
  V_ROLE_CD: string;
  ROLE_DSC: string;
  V_ROLE_DSC: string;
  ROLE_ID: number;
  USR_GRP_ID: any;
  id: number;
  is_selected: boolean;
  is_selected_usr_grp: boolean;
}
