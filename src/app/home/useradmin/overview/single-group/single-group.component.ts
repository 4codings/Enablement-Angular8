import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';
import { User } from '../../../../store/user-admin/user/user.model';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import * as fromUserMembership from '../../../../store/user-admin/user-membership/usermembership.action';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationAlertComponent } from '../../../../shared/components/confirmation-alert/confirmation-alert.component';
import { take, takeUntil } from 'rxjs/operators';
import { EditGroupComponent } from '../../user-admin-group/edit-group/edit-group.component';
import { OverviewService } from '../overview.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit, OnDestroy {

  @Input() groupPermission: boolean;
  @Input() userPermission: boolean;
  @Input() membershipPermission: boolean;
  @Input() assignPermission: boolean;
  @Input() group: userGroup;
  users: User[];
  @Input() groups: userGroup[];
  @Input() controlVariables: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(public overviewService: OverviewService) {
  }

  ngOnInit() {
    this.overviewService.userGroupMap$.pipe(takeUntil(this.unsubscribeAll)).subscribe(flag => {
      if (flag) {
        this.users = this.overviewService.userGroupMap.get(this.group.id);
        console.log('this.users', this.users);
      }
    });
  }

  onBtnDeleteGroupClick(group: userGroup): void {
    this.overviewService.deleteGroup(group);
  }

  onBtnEditGroupClick(group: userGroup): void {
    this.overviewService.openEditGroupDialog(group);
  }

  onAddUserInCustomEventHandler(user: User): void {
    if (user) {
      this.overviewService.addUserInCustomGroup(this.group, user);
    } else {
      this.overviewService.openAddUserDialog(this.group.id);
    }
  }
  onAddUserInGroupEventHandler(user): void {
    this.overviewService.addUserInOtherGroup(user['group'], user['userData']);
  }

  onDeleteCustomUserEventHandler(user): void {
    this.overviewService.deleteUserFromCustomGroup(this.group, user['userData'], user['deleteFromAllGroups']);
  }
  onDeleteOtherUserEventHandler(user): void {
    this.overviewService.deleteUserFromDifferentGroup(user['group'], user['userData'], user['deleteFromAllGroups']);
  }

  onBtnAssignRoleClick(group: userGroup): void {
    this.overviewService.openAssignRoleToGroupDialog(group);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
