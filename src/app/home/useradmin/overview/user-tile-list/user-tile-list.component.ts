import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/app.state';
import { environment } from '../../../../../environments/environment';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';
import { UpdateUser } from '../../../../store/user-admin/user/user.action';
import { User } from '../../../../store/user-admin/user/user.model';
import { groupNameList, groupTypeConstant } from '../../useradmin.constants';
import { OverviewService } from '../overview.service';

@Component({
  selector: 'app-user-tile-list',
  templateUrl: './user-tile-list.component.html',
  styleUrls: ['./user-tile-list.component.scss']
})
export class UserTileListComponent implements OnInit, OnDestroy {
  @Input() userPermission: boolean;
  @Input() membershipPermission: boolean;
  @Input() groupId: string;
  @Input() users: User[];
  @Input() selectedUser: User;
  @Input() highlightedUsers: SelectionModel<User> = new SelectionModel<User>(true, []);
  @Input() controlVariables: any;
  @Input() groupList: userGroup[];
  environment = environment;
  user: any;
  @Output() addUserEvent: EventEmitter<User> = new EventEmitter<User>();
  @Output() deleteUserEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('contextMenu', { static: false } as any) set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  contextMenuData: User;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  groupNameList = groupNameList;
  groupTypeConstant = groupTypeConstant;
  selectedUserProfile = groupTypeConstant.WORKFLOW;
  constructor(public overviewService: OverviewService, private store: Store<AppState>) {
    this.overviewService.selectedUser$.pipe(takeUntil(this.unsubscribeAll)).subscribe(user => this.selectedUser = user);
    this.overviewService.highlightedUsers$.pipe(takeUntil(this.unsubscribeAll)).subscribe(users => this.highlightedUsers = users);
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.setGroupId();
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }
  setGroupId() {
    this.groupNameList.forEach(ele => {
      let index = this.groupList.findIndex(v => v.V_USR_GRP_DSC == ele.label);
      if (index > -1) {
        ele.groupId = this.groupList[index].V_USR_GRP_ID;
      }
    })
  }
  userDropped(event: CdkDragDrop<User[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.addUserEvent.emit(event.item.data);
    }
  }

  onAddUserTileClick(): void {
    this.addUserEvent.emit(null);
  }

  onTileMouseDownEventHandler(ev: MouseEvent): void {
    document.dispatchEvent(new MouseEvent('mousedown', ev));
  }

  openContextmenu(event: MouseEvent, data?: any) {
    event.preventDefault();
    if (data) {
      this.contextMenuData = data;
    }
    this.contextMenuStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
    this.contextMenuActive = true;
  }

  onContextMenuEditUserBtnClick(): void {
    this.contextMenuActive = false;
    this.overviewService.openEditUserDialog(this.contextMenuData, this.groupId);
    this.contextMenuData = null;
  }

  onContextMenuDeleteUserBtnClick(deleteFromAllGroups): void {
    this.contextMenuActive = false;
    this.deleteUserEvent.emit({ 'userData': this.contextMenuData, 'deleteFromAllGroups': deleteFromAllGroups });
    this.contextMenuData = null;
  }
  ondblclick(currentUser: User, action: string) {
    console.log('user', currentUser);
    switch (action) {
      case 'Status': {
        currentUser.V_STS = currentUser.V_STS.toUpperCase() === 'ACTIVE' ? 'TERMINATED' : 'ACTIVE'
        break;
      }
    }
    const data = {
      ...currentUser,
      V_USR_NM: this.user.USR_NM,
      V_SRC_ID: this.user.SRC_CD,
      REST_Service: 'User',
      Verb: 'PATCH',
      id: currentUser.id,
    };
    console.log('data', data);
    this.store.dispatch(new UpdateUser(data));
  }
  onUserTileClick(user: User): void {
    if (this.selectedUser == user) {
      this.overviewService.resetSelection();
    } else {
      this.overviewService.resetSelection();
      this.overviewService.selectUser(user);
      this.overviewService.highlightAuthorizations(user);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
  onProfileClick(userProfile) {
    this.selectedUserProfile = userProfile;
  }
}
