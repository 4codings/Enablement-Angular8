import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {User} from '../../../../store/user-admin/user/user.model';
import {CdkDragDrop, copyArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';
import {SelectionModel} from '@angular/cdk/collections';
import * as fromUserMembership from '../../../../store/user-admin/user-membership/usermembership.action';
import {AddUserComponent} from '../../user-admin-user/add-user/add-user.component';
import {take, takeUntil} from 'rxjs/operators';
import * as usreActions from '../../../../store/user-admin/user/user.action';
import {OverviewService} from '../overview.service';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../../../environments/environment';

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
  environment = environment;
  @Output() addUserEvent: EventEmitter<User> = new EventEmitter<User>();
  @Output() deleteUserEvent: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild('contextMenu') set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  contextMenuData: User;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(public overviewService: OverviewService) {
    this.overviewService.selectedUser$.pipe(takeUntil(this.unsubscribeAll)).subscribe(user => this.selectedUser = user);
    this.overviewService.highlightedUsers$.pipe(takeUntil(this.unsubscribeAll)).subscribe(users => this.highlightedUsers = users);
  }

  ngOnInit() {
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
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

  onContextMenuDeleteUserBtnClick(): void {
    this.contextMenuActive = false;
    this.deleteUserEvent.emit(this.contextMenuData);
    this.contextMenuData = null;
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

}
