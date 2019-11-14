import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OverviewService } from '../overview.service';
import { takeUntil } from 'rxjs/operators';
import { userRole } from '../../../../store/user-admin/user-role/userrole.model';
import { AuthorizationData } from '../../../../store/user-admin/user-authorization/authorization.model';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-single-role',
  templateUrl: './single-role.component.html',
  styleUrls: ['./single-role.component.scss']
})
export class SingleRoleComponent implements OnInit {

  @Input() rolePermission: boolean;
  @Input() authPermission: boolean;
  @Input() authorizationPermission: boolean;
  @Input() assignPermission: boolean;
  @Input() role: userRole;
  auths: AuthorizationData[];
  copyAuths: AuthorizationData[];
  @Input() controlVariables: any;
  selectedApp: any;
  selectedProcess: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(public overviewService: OverviewService) {
    this.overviewService.selectedApp$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => {
      this.selectedApp = type;
      this.getFilteredData();
    });
    this.overviewService.selectedProcess$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => {
      this.selectedProcess = type;
      this.getFilteredData();
    });
  }

  ngOnChanges() {
  }
  ngOnInit() {
    this.overviewService.authRoleMap$.pipe(takeUntil(this.unsubscribeAll)).subscribe(flag => {
      if (flag) {
        this.auths = this.overviewService.authRoleMap.get(this.role.id);
        this.getFilteredData();
      }
    });
  }

  onBtnDeleteRoleClick(role: userRole): void {
    this.overviewService.deleteRole(role);
  }

  onBtnEditRoleClick(role: userRole): void {
    this.overviewService.openEditRoleDialog(role);
  }

  onAddAuthEventHandler(auth: AuthorizationData): void {
    if (auth) {
      this.overviewService.assignAuthToRole(this.role.id, auth);
    } else {
      this.overviewService.openAddAuthDialog(this.role.id);
    }
  }
  getFilteredData() {
    // console.log('selectedApp', this.selectedApp);
    // console.log('selectedProcess', this.selectedProcess);
    // console.log('auths', this.auths);
    this.copyAuths = [];
    if (this.auths != undefined && this.auths.length) {
      this.copyAuths = [...this.auths];
      if (this.selectedApp != undefined && this.selectedApp.authType != '' && this.selectedProcess != undefined && this.selectedProcess.authType != '') {
        // console.log('service');
        let filterAuth = [];
        if (this.copyAuths.length) {
          if (this.selectedProcess.authType.toLowerCase() == 'service') {
            if (this.selectedProcess.process != '') {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase() && v.V_APP_CD == this.selectedApp.app && v.V_PRCS_CD == this.selectedProcess.process);
            } else {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase() && v.V_APP_CD == this.selectedApp.app);
            }
            this.copyAuths = [...filterAuth];
          }
        }
      } else if (this.selectedApp != undefined && this.selectedApp.authType != '' && (this.selectedProcess == undefined || this.selectedProcess.authType == '')) {
        let filterAuth = [];
        // console.log('app,procecess');
        if (this.copyAuths.length) {
          if (this.selectedApp.authType.toLowerCase() == 'process' || this.selectedApp.authType.toLowerCase() == 'service') {
            if (this.selectedApp.app != '') {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase() && v.V_APP_CD == this.selectedApp.app);
            } else {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase());
            }
            this.copyAuths = [...filterAuth];
          } else if (this.selectedApp.authType.toLowerCase() == 'artifact') {
            if (this.selectedApp.app != '') {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase() && v.V_ARTFCT_TYP == this.selectedApp.app);
            } else {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase());
            }
            this.copyAuths = [...filterAuth];
          } else if (this.selectedApp.authType.toLowerCase() == 'exe') {
            if (this.selectedApp.app != '') {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase() && v.V_EXE_TYP == this.selectedApp.app);
            } else {
              filterAuth = this.copyAuths.filter(v => v.V_AUTH_TYP.toLowerCase() == this.selectedApp.authType.toLowerCase());
            }
            this.copyAuths = [...filterAuth];
          }
        }
      }
    }
    // console.log('copyAuths', this.copyAuths);
  }
  // auth: AuthorizationData
  onDeleteAuthEventHandler(data: any): void {
    this.overviewService.deleteAuthFromRole(this.role, data['authData'], data['deleteFromAllRoles']);
  }

  onBtnAssignGroupClick(role: userRole): void {
    this.overviewService.openAssignGroupToRoleDialog(role);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
