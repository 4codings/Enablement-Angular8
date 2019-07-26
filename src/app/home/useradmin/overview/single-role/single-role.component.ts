import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {OverviewService} from '../overview.service';
import {takeUntil} from 'rxjs/operators';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';
import {AuthorizationData} from '../../../../store/user-admin/user-authorization/authorization.model';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-single-role',
  templateUrl: './single-role.component.html',
  styleUrls: ['./single-role.component.scss']
})
export class SingleRoleComponent implements OnInit {

  @Input() rolePermission: boolean;
  @Input() role: userRole;
  auths: AuthorizationData[];
  @Input() controlVariables: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(public overviewService: OverviewService) {
  }

  ngOnInit() {
    this.overviewService.authRoleMap$.pipe(takeUntil(this.unsubscribeAll)).subscribe(flag => {
      if (flag) {
        this.auths = this.overviewService.authRoleMap.get(this.role.id);
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

  onDeleteAuthEventHandler(auth: AuthorizationData): void {
    this.overviewService.deleteAuthFromRole(this.role, auth);
  }

  onBtnAssignGroupClick(role: userRole): void {
    this.overviewService.openAssignGroupToRoleDialog(role);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
