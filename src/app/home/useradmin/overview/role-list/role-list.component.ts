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
  selectedApp = '';

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
      console.log('auth', this.authValues);
      this.getFilterData(this.selectedAuthType.label);
    });
  }

  selectAuthType(authType): void {
    this.selectedApp = '';
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
    console.log('data', data);
    this.filteredAuthValues = this.authValues.filter(v => v['V_AUTH_TYP'].toLowerCase() === data.toLowerCase());
    if (this.selectedAuthType.label.toUpperCase() == 'PROCESS' || this.selectedAuthType.label.toUpperCase() == 'SERVICE') {
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
      }
    } else if (this.selectedAuthType.label.toUpperCase() == 'ARTIFACT') {
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
      }
    } else if (this.selectedAuthType.label.toUpperCase() == 'EXE') {
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
      }
    }
  }
  onProcessSelect(authData) {
    if (this.selectedAuthType.label.toUpperCase() == 'SERVICE') {
      if (this.filteredAuthValues.length) {
        this.filteredAuthValues.forEach(ele => {
          if (this.filteredProcessValues.length) {
            let i = this.filteredProcessValues.findIndex(v => v.V_PRCS_CD == ele.V_PRCS_CD);
            if (i == -1) {
              this.filteredProcessValues.push(ele);
            }
          } else {
            this.filteredProcessValues.push(ele);
          }
        })
      }
    }
  }
  onAuthSelect(data) {
    console.log('app/process', data);
  }
}
