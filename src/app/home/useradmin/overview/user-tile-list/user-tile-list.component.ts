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
import * as userGroupActions from '../../../../store/user-admin/user-group/usergroup.action';
import { UseradminService } from '../../../../services/useradmin.service2';

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
  @Output() addCustomUserEvent: EventEmitter<User> = new EventEmitter<User>();
  @Output() addOtherUserEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteCustomUserEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteOtherUserEvent: EventEmitter<any> = new EventEmitter<any>();

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
  constructor(public overviewService: OverviewService, private store: Store<AppState>, private userAdminService: UseradminService) {
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
      this.addCustomUserEvent.emit(event.item.data);
    }
  }

  onAddUserTileClick(): void {
    this.addCustomUserEvent.emit(null);
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
    this.deleteCustomUserEvent.emit({ 'userData': this.contextMenuData, 'deleteFromAllGroups': deleteFromAllGroups });
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
  ondblclickGroup(currentUser, group) {
    console.log('currentUser', currentUser);
    console.log('group', group);
    let index = this.checkIndex(currentUser.V_USR_GRP_ID, group.groupId)
    // add user in group
    if (!index) {
      this.addOtherUserEvent.emit({ 'userData': currentUser, 'group': group });
    } else { // delete user from group
      this.deleteOtherUserEvent.emit({ 'group': group, 'userData': currentUser, 'deleteFromAllGroups': false });
    }

  }
  addUserInGroup(groupId: string, user: User): void {
    let json = {
      'V_DELETED_ID_ARRAY': '',
      'V_ADDED_ID_ARRAY': groupId + '',
      'SELECTED_ENTITY': ['USER'],
      'SELECTED_ENTITY_ID': user.id.split(' '),
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
      'REST_Service': ['User_Group'],
      'Verb': ['POST']
    };
    this.userAdminService.postSecuredJSON(json).subscribe(res => {
      const V_SRC_CD_DATA = {
        V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      };
      this.store.dispatch(new userGroupActions.getUserGroup(V_SRC_CD_DATA));
    }, err => {
    });
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
  checkIndex(groupIdList, groupId) {
    // console.log('groupIdList', groupIdList)
    // console.log('groupId', groupId)
    if (groupIdList.findIndex(v => v == groupId) > -1) {
      return 1;
    } else {
      return 0;
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
