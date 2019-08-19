import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { Subscription } from 'rxjs';
import { AddConnectionDialogComponent } from '../dialogs/add-connection-dialog/add-connection-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationAlertComponent } from '../../../../shared/components/confirmation-alert/confirmation-alert.component';
import { HttpClient } from '@angular/common/http';
import { EditConnectionDialogComponent } from '../dialogs/edit-connection-dialog/edit-connection-dialog.component';
import { Globals } from '../../../../services/globals';
import { AssignConnectionExeComponent } from '../dialogs/assign-connection-exe/assign-connection-exe.component';

@Component({
  selector: 'app-machine-tile-list',
  templateUrl: './machine-tile-list.component.html',
  styleUrls: ['./machine-tile-list.component.scss']
})
export class MachineTileListComponent implements OnInit {
  contextMenuData: any;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  public selectedMachine;
  public selectedExe;
  V_SRC_CD:string;
  V_USR_NM:string;
  subscription: Subscription;
  @Output() selectedMachineTile = new EventEmitter();
  @Input() connectionList;
  @Input() machineType;
  @Input() userAccess;
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  @ViewChild('contextMenu', { static: false } as any) set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  constructor(private systemOverview:SystemAdminOverviewService, public dialog: MatDialog, private http:HttpClient, private globals:Globals) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
    //console.log(this.connectionList);
    this.subscription = this.systemOverview.selectedExe$.subscribe(data => {
      //console.log(data);
      if(data) {
        this.selectedMachine = null;
        this.selectedExe = data.V_EXE_TYP;
      } else {
        this.selectedExe = '';
      }
    });
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }
  
  onAddConnTileClick() {
    const dialogRef = this.dialog.open(AddConnectionDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {machineType:this.machineType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  connectionDropped(event: CdkDragDrop<any[]>) {
    console.log(event.item.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      //this.addAuthEvent.emit(event.item.data);
    }
  }

  onContextMenuAssigneConnBtnClick() {
    this.contextMenuActive = false;
    this.onBtnAssignCxnClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnAssignCxnClick(cxn) {
    const dialogRef = this.dialog.open(AssignConnectionExeComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {cxn:cxn, isSelectedEntity:'CXN', type:'Executable'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.systemOverview.getMachine();
        this.systemOverview.getExe();
      }
    });
  }

  onConnectionTileClick(connection) {
    
    if(this.selectedMachine === connection) {
      this.selectedMachine = null;
      this.selectedMachineTile.emit(this.selectedMachine);
    } else {
      this.selectedExe = '';
      this.selectedMachine = connection;
      this.selectedMachineTile.emit(this.selectedMachine);
    }
      
  }

  onTileMouseDownEventHandler(ev: MouseEvent): void {
    document.dispatchEvent(new MouseEvent('mousedown', ev));
  }

  openContextmenu(event: MouseEvent, data?: any, machineType?:any, index?:any) {
    event.preventDefault();
    if (data) {
      this.contextMenuData = {
        V_PLATFORM_CD: machineType,
        cnxData:data,
        index:index
      };
    }
    this.contextMenuStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
    this.contextMenuActive = true;
  }

  onContextMenuEditConnBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnEditExeClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnEditExeClick(cxn) {
    const dialogRef = this.dialog.open(EditConnectionDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: cxn
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.systemOverview.getMachine();
      }
    });
  }

  onContextMenuDeleteConnBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnDeleteConnectionClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnDeleteConnectionClick(cnx) {
    //console.log(cnx);
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete Machine- ${cnx.V_PLATFORM_CD} connection`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Connection <strong>${cnx.cnxData.V_CXN_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let body = {
          "V_CXN_CD": cnx.cnxData.V_CXN_CD,
          "V_SRC_CD": this.V_SRC_CD,
          "V_CXN_TYP": cnx.cnxData.V_CXN_TYP,
          "REST_Service": "Connection",
          "Verb": "DELETE",
          "RESULT": "@RESULT"
        };

        this.http.delete(this.apiUrlGet+'V_CXN_TYP='+ cnx.cnxData.V_CXN_TYP + '&V_CXN_CD='+ cnx.cnxData.V_CXN_CD + '&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=CXN&Verb=DELETE').subscribe(res => {
          console.log("res",res);
          this.systemOverview.getMachine();
        }, err => {
          console.log("err", err)
        }); 
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
