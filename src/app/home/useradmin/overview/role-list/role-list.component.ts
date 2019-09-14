import { Component, Input, OnInit } from '@angular/core';
import { authorizationTypeOptions, authorizationTypeConstants } from '../../useradmin.constants';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UseradminService } from '../../../../services/useradmin.service2';
import { OverviewService } from '../overview.service';
import { takeUntil } from 'rxjs/operators';
import { userRole } from '../../../../store/user-admin/user-role/userrole.model';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';

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

  constructor(
    private dialog: MatDialog,
    private userAdminService: UseradminService,
    public overviewService: OverviewService,
    public sortPipe: SortPipe
  ) {
    this.overviewService.roles$.pipe(takeUntil(this.unsubscribeAll)).subscribe(roles => {
      console.log('roles', roles);
      // this.roles = roles;
      this.defaultRoles = roles.length ? this.sortPipe.transform(roles, 'V_ROLE_CD') : [];
      if (this.defaultRoles.length) {
        let index = this.defaultRoles.findIndex(v => v.V_ROLE_CD == 'Super Application Role');
        let role = this.defaultRoles[index];
        this.defaultRoles.splice(index, 1);
        this.defaultRoles.unshift(role);
      }
      this.roles = [...this.defaultRoles];
      console.log('this.roles', this.roles);
    });
    this.overviewService.selectedAuthType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedAuthType = type);
  }

  ngOnInit() {
    this.controlVariables = this.userAdminService.controlVariables;
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.index = this.authorizationTypeOptions.findIndex(v => v.key == authorizationTypeConstants.PROCESS);
    this.selectedAuthType = this.authorizationTypeOptions[this.index];
    this.selectAuthType(this.selectedAuthType);
  }

  selectAuthType(authType): void {
    this.overviewService.selectAuthType(authType);
  }

  onAddRoleBtnClick(): void {
    this.overviewService.openAddRoleDialog();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
