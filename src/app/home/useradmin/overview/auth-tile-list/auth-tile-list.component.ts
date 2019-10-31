import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { OverviewService } from '../overview.service';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthorizationData } from '../../../../store/user-admin/user-authorization/authorization.model';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as authActions from '../../../../store/user-admin/user-authorization/authorization.actions';

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

  constructor(public overviewService: OverviewService, private http: HttpClient, protected store: Store<AppState>, ) {
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

  method2CallForDblClick(item, data) {
    if (this.authPermission) {
      switch (item) {
        case 'read':
          if (data.V_READ === 'Y')
            data.V_READ = 'N';
          else
            data.V_READ = 'Y'
          break;
        case 'update':
          if (data.V_UPDATE === 'Y')
            data.V_UPDATE = 'N';
          else
            data.V_UPDATE = 'Y'
          break;
        case 'delete':
          if (data.V_DELETE === 'Y')
            data.V_DELETE = 'N';
          else
            data.V_DELETE = 'Y'
          break;
        case 'add':
          if (data.V_CREATE === 'Y')
            data.V_CREATE = 'N';
          else
            data.V_CREATE = 'Y'
          break;
        case 'execute':
          if (data.V_EXECUTE === 'Y')
            data.V_EXECUTE = 'N';
          else
            data.V_EXECUTE = 'Y'
          break;
      }

      let body = {
        'V_AUTH_ID': parseInt(data.V_AUTH_ID), 
        'V_AUTH_DSC': data.V_AUTH_DSC,
        'V_AUTH_CD': data.V_AUTH_CD,
        'V_AUTH_TYP': data.V_AUTH_TYP,
        'V_SRC_CD': JSON.parse(sessionStorage.getItem('u')).SRC_CD,
        'V_APP_CD': data.V_APP_CD,
        'V_PRCS_CD': data.V_PRCS_CD,
        'V_ARTFCT_TYP': data.V_ARTFCT_TYP,
        'V_EXE_TYP': data.V_EXE_TYP,
        'V_READ': data.V_READ,
        'V_UPDATE': data.V_UPDATE,
        'V_DELETE': data.V_DELETE,
        'V_CREATE': data.V_CREATE,
        'V_EXECUTE': data.V_EXECUTE,
        'V_USR_NM': JSON.parse(sessionStorage.getItem('u')).USR_NM,
        'V_COMMNT': '',
        'REST_Service': 'Auth',
        'Verb': 'PUT'
      };

      //console.log('data', data);
      this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON', body).subscribe(res => {
        this.store.dispatch(new authActions.UpdateAuth(data));

        this.overviewService.afterEditAuth(true);
      },
        err => {
        });
    }
    console.log('item', item)
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
