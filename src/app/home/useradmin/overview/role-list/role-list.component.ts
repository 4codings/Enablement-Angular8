import { Component, Input, OnInit } from '@angular/core';
import { authorizationTypeOptions, authorizationTypeConstants } from '../../useradmin.constants';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UseradminService } from '../../../../services/useradmin.service2';
import { OverviewService } from '../overview.service';
import { takeUntil } from 'rxjs/operators';
import { userRole } from '../../../../store/user-admin/user-role/userrole.model';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as authActions from '../../../../store/user-admin/user-authorization/authorization.actions';
import * as authSelectors from '../../../../store/user-admin//user-authorization/authorization.selectors';
import { AuthorizationData } from 'src/app/store/user-admin/user-authorization/authorization.model';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  providers: [SortPipe]
})
export class RoleListComponent implements OnInit {
  @Input() authorizationPermission: boolean;
  @Input() rolePermission: boolean;
  @Input() authPermission: boolean;
  @Input() assignPermission: boolean;
  @Input() controlVariables: any;

  roles: userRole[];
  defaultRoles: userRole[];
  authorizationTypeOptions = this.sortPipe.transform(authorizationTypeOptions, 'label');
  index = this.authorizationTypeOptions.findIndex(v => v.key == authorizationTypeConstants.PROCESS);
  selectedAuthType = this.authorizationTypeOptions[this.index];
  V_SRC_CD_DATA: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  public authValues$: Observable<AuthorizationData[]>;
  authValues: AuthorizationData[] = [];
  filteredAuthValues: AuthorizationData[] = [];
  filteredApplicationValues = [];
  filteredProcessValues = [];
  selectedApp: any = { 'app': '', 'authType': '' };
  selectedProcess: any = { 'process': '', 'authType': '' };

  constructor(
    private dialog: MatDialog,
    private userAdminService: UseradminService,
    public overviewService: OverviewService,
    public sortPipe: SortPipe,
    protected store: Store<AppState>,
  ) {
    this.overviewService.roles$.pipe(takeUntil(this.unsubscribeAll)).subscribe(roles => {
      // this.roles = roles;
      this.defaultRoles = roles.length ? this.sortPipe.transform(roles, 'V_ROLE_CD') : [];
      if (this.defaultRoles.length) {
        let index = this.defaultRoles.findIndex(v => v.V_ROLE_CD == 'Super Application Role');
        let role = this.defaultRoles[index];
        this.defaultRoles.splice(index, 1);
        this.defaultRoles.unshift(role);
      }
      this.roles = [...this.defaultRoles];
    });
    this.overviewService.selectedAuthType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedAuthType = type);
    this.overviewService.selectedApp$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedApp = type);
    this.overviewService.selectedProcess$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedProcess = type);
  }

  ngOnInit() {
    this.authValues$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.controlVariables = this.userAdminService.controlVariables;
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.index = this.authorizationTypeOptions.findIndex(v => v.key == authorizationTypeConstants.PROCESS);
    this.selectedAuthType = this.authorizationTypeOptions[this.index];
    this.selectAuthType(this.selectedAuthType);
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    this.authValues$.subscribe(data => {
      this.authValues = data;
    });
    setTimeout(() => {
      this.getFilterData(this.selectedAuthType.label);
    }, 1000);
  }

  selectAuthType(authType): void {
    this.selectedApp = { 'app': '', 'authType': '' };
    this.selectedProcess = { 'process': '', 'authType': '' };
    this.selectedAuthType = authType;
    this.getFilterData(authType.key);
    this.overviewService.selectAuthType(authType);
  }

  onAddRoleBtnClick(): void {
    this.overviewService.openAddRoleDialog();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  getFilterData(data: string) {
    this.filteredAuthValues = [];
    this.filteredApplicationValues = [];
    this.filteredProcessValues = [];
    this.filteredAuthValues = this.authValues.filter(v => v['V_AUTH_TYP'].toLowerCase() === data.toLowerCase());
    if (this.selectedAuthType.label.toUpperCase() == 'PROCESS' || this.selectedAuthType.label.toUpperCase() == 'SERVICE') {
      this.overviewService.selectProcess({ 'process': '', 'authType': '' });
      if (this.filteredAuthValues.length) {
        this.filteredAuthValues.forEach(ele => {
          if (this.filteredApplicationValues.length) {
            let i = this.filteredApplicationValues.findIndex(v => v.V_APP_CD == ele.V_APP_CD);
            if (i == -1) {
              this.filteredApplicationValues.push(ele);
            }
          } else {
            this.filteredApplicationValues.push(ele);
          }
        })
        this.selectedApp.app = this.filteredApplicationValues[0].V_APP_CD;
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
        if (this.selectedAuthType.label.toUpperCase() == 'SERVICE') {
          this.onProcessSelect(this.filteredApplicationValues[0])
        }
      } else {
        this.selectedApp.app = '';
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
      }
    } else if (this.selectedAuthType.label.toUpperCase() == 'ARTIFACT') {
      this.overviewService.selectProcess({ 'process': '', 'authType': '' });
      if (this.filteredAuthValues.length) {
        this.filteredAuthValues.forEach(ele => {
          if (this.filteredApplicationValues.length) {
            let i = this.filteredApplicationValues.findIndex(v => v.V_ARTFCT_TYP == ele.V_ARTFCT_TYP);
            if (i == -1) {
              this.filteredApplicationValues.push(ele);
            }
          } else {
            this.filteredApplicationValues.push(ele);
          }
        })
        this.selectedApp.app = this.filteredApplicationValues[0].V_ARTFCT_TYP;
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
      } else {
        this.selectedApp.app = '';
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
      }
    } else if (this.selectedAuthType.label.toUpperCase() == 'EXE') {
      this.overviewService.selectProcess({ 'process': '', 'authType': '' });
      if (this.filteredAuthValues.length) {
        this.filteredAuthValues.forEach(ele => {
          if (this.filteredApplicationValues.length) {
            let i = this.filteredApplicationValues.findIndex(v => v.V_EXE_TYP == ele.V_EXE_TYP);
            if (i == -1) {
              this.filteredApplicationValues.push(ele);
            }
          } else {
            this.filteredApplicationValues.push(ele);
          }
        })
        this.selectedApp.app = this.filteredApplicationValues[0].V_EXE_TYP;
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
      } else {
        this.selectedApp.app = '';
        this.selectedApp.authType = this.selectedAuthType.label;
        this.overviewService.selectApp(this.selectedApp);
      }
    }
  }
  onProcessSelect(authData) {
    this.selectedApp.app = authData.V_APP_CD;
    this.selectedApp.authType = this.selectedAuthType.label;
    this.overviewService.selectApp(this.selectedApp);
    this.filteredProcessValues = [];
    if (this.selectedAuthType.label.toUpperCase() == 'SERVICE') {
      if (this.filteredAuthValues.length) {
        this.filteredAuthValues.forEach(ele => {
          if (ele.V_APP_CD == authData.V_APP_CD) {
            if (this.filteredProcessValues.length) {
              let i = this.filteredProcessValues.findIndex(v => v.V_PRCS_CD == ele.V_PRCS_CD);
              if (i == -1) {
                this.filteredProcessValues.push(ele);
              }
            } else {
              this.filteredProcessValues.push(ele);
            }
          }
        });
        this.selectedProcess.process = this.filteredProcessValues[0].V_PRCS_CD;
        this.selectedProcess.authType = this.selectedAuthType.label;
        this.overviewService.selectProcess(this.selectedProcess);
      } else {
        this.selectedProcess.process = '';
        this.selectedProcess.authType = this.selectedAuthType.label;
        this.overviewService.selectProcess(this.selectedProcess);
      }
    }
  }
  onAuthSelect(data, isService) {
    if (isService) {
      this.selectedProcess.process = data;
      this.selectedProcess.authType = this.selectedAuthType.label;
      this.overviewService.selectProcess(this.selectedProcess);
    } else {
      this.selectedApp.authType = this.selectedAuthType.label;
      this.selectedApp.app = data;
      this.overviewService.selectApp(this.selectedApp);
    }
  }
}
