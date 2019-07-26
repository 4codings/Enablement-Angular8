import {Component, Input, OnInit} from '@angular/core';
import {authorizationTypeOptions} from '../../useradmin.constants';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {UseradminService} from '../../../../services/useradmin.service2';
import {OverviewService} from '../overview.service';
import {takeUntil} from 'rxjs/operators';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';
import { RollserviceService } from '../../../../services/rollservice.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  roles: userRole[];
  rolePermission = false;
  @Input() controlVariables: any;
  authorizationTypeOptions = authorizationTypeOptions;
  selectedAuthType = this.authorizationTypeOptions[0];
  V_SRC_CD_DATA: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    private userAdminService: UseradminService,
    public overviewService: OverviewService,
    private rollserviceService: RollserviceService,
  ) {
    this.overviewService.roles$.pipe(takeUntil(this.unsubscribeAll)).subscribe(roles => {
      this.roles = roles;
    });
    this.overviewService.selectedAuthType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedAuthType = type);
  }

  ngOnInit() {
    this.controlVariables = this.userAdminService.controlVariables;
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };

    this.rollserviceService.getRollCd().then((res) => {
      const role = res.find(item => item === 'Enablement User Admin User Role');
      if (role) {
        this.rolePermission = true;
      }
    });
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
