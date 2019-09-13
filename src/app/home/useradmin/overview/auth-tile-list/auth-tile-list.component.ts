import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { OverviewService } from '../overview.service';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthorizationData } from '../../../../store/user-admin/user-authorization/authorization.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-auth-tile-list',
  templateUrl: './auth-tile-list.component.html',
  styleUrls: ['./auth-tile-list.component.scss']
})
export class AuthTileListComponent implements OnInit {
  @Input() authPermission: boolean;
  @Input() authorizationPermission: boolean;
  @Input() auths: AuthorizationData[];
  @Input() selectedAuth: AuthorizationData;
  @Input() highlightedAuths: SelectionModel<AuthorizationData> = new SelectionModel<AuthorizationData>(true, []);
  @Input() controlVariables: any;
  environment = environment;
  @Output() addAuthEvent: EventEmitter<AuthorizationData> = new EventEmitter<AuthorizationData>();
  @Output() deleteAuthEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('contextMenu', { static: false } as any) set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  contextMenuData: AuthorizationData;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  selectedAuthType: { key: string, label: string };

  constructor(public overviewService: OverviewService) {
    this.overviewService.selectedAuth$.pipe(takeUntil(this.unsubscribeAll)).subscribe(auth => this.selectedAuth = auth);
    this.overviewService.selectedAuthType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedAuthType = type);
    this.overviewService.highlightedAuths$.pipe(takeUntil(this.unsubscribeAll)).subscribe(auths => this.highlightedAuths = auths);
  }

  ngOnInit() {
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }

  method2CallForDblClick() {
  }

  authDropped(event: CdkDragDrop<AuthorizationData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.addAuthEvent.emit(event.item.data);
    }
  }

  onAddAuthTileClick(): void {
    this.addAuthEvent.emit(null);
  }

  onTileMouseDownEventHandler(ev: MouseEvent): void {
    document.dispatchEvent(new MouseEvent('mousedown', ev));
  }

  openContextmenu(event: MouseEvent, data?: AuthorizationData) {
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

  onContextMenuEditAuthBtnClick(): void {
    this.contextMenuActive = false;
    this.overviewService.openEditAuthDialog(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuRemoveAuthBtnClick(deleteFromAllRoles): void {
    this.contextMenuActive = false;
    this.deleteAuthEvent.emit({ 'authData': this.contextMenuData, 'deleteFromAllRoles': deleteFromAllRoles });
    this.contextMenuData = null;
  }

  onAuthTileClick(auth: AuthorizationData): void {
    if (this.selectedAuth == auth) {
      this.overviewService.resetSelection();
    } else {
      this.overviewService.resetSelection();
      this.overviewService.selectAuth(auth);
      this.overviewService.highlightUsers(auth);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }
}
