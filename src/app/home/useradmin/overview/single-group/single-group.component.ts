import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';
import {User} from '../../../../store/user-admin/user/user.model';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import * as fromUserMembership from '../../../../store/user-admin/user-membership/usermembership.action';
import {SelectionModel} from '@angular/cdk/collections';
import {ConfirmationAlertComponent} from '../../../../shared/components/confirmation-alert/confirmation-alert.component';
import {take, takeUntil} from 'rxjs/operators';
import {EditGroupComponent} from '../../user-admin-group/edit-group/edit-group.component';
import {OverviewService} from '../overview.service';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit, OnDestroy {

  @Input() group: userGroup;
  users: User[];
  @Input() controlVariables: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(public overviewService: OverviewService) {
  }

  ngOnInit() {
    this.overviewService.userGroupMap$.pipe(takeUntil(this.unsubscribeAll)).subscribe(flag => {
      if (flag) {
        this.users = this.overviewService.userGroupMap.get(this.group.id);
      }
    });
  }

  onBtnDeleteGroupClick(group: userGroup): void {
    this.overviewService.deleteGroup(group);
  }

  onBtnEditGroupClick(group: userGroup): void {
    this.overviewService.openEditGroupDialog(group);
  }

  onAddUserEventHandler(user: User): void {
    if (user) {
      this.overviewService.addUserInGroup(this.group, user);
    } else {
      this.overviewService.openAddUserDialog(this.group.id);
    }
  }

  onDeleteUserEventHandler(user: User): void {
    this.overviewService.deleteUserFromGroup(this.group, user);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
