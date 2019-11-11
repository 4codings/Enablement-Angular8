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
  @Input() selectedConnectionType;
  @Input() machine;
  @Input() selectedConn;
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
    this.subscription = this.systemOverview.selectedExe$.subscribe(data => {
      if(data) {
        this.selectedMachine = null;
        this.selectedMachineTile.emit('exeSelect');
        this.selectedExe = data.V_CXN_ID;
      } else {
        this.selectedExe = '';
      }
    });
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }
  
  isHighLightTile(cxnData) { 
    if(this.selectedExe != null) {
      for(let i=0; i<this.selectedExe.length; i++) {
          if(cxnData.V_CXN_ID == this.selectedExe[i]) {
            return true;
          }
      }
      return false;
    }
  }

  onAddConnTileClick() {
    const dialogRef = this.dialog.open(AddConnectionDialogComponent, {
      panelClass: 'app-dialog',
      width: '730px',
      data: {machineType:this.machineType, selectedConnectionType:this.selectedConnectionType, machineData:this.machine}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.systemOverview.getAllMachineConnections();
    });
  }

  connectionDropped(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        let eventData = event.container.data[event.currentIndex]; 
        
        // let V_PARAM_N = '';
        // let V_PARAM_V = '';
        // Object.keys(eventData).forEach((key, index) => {
        //   if(key == "V_CXN_CD" || key == "V_CXN_DSC" || key == "V_CXN_TYP" || key == "PLF_CD" || key == "PLF_DSC") {

        //   } else {
        //     V_PARAM_N += key + "|";
        //     V_PARAM_V += eventData[key] + "|"
        //   }
        // })
        
        var data = {
          // "V_CXN_CD":eventData.V_CXN_CD,
          // "V_CXN_TYP":eventData.V_CXN_TYP,
          // "V_SRC_CD":this.V_SRC_CD,
          // "V_USR_NM":this.V_USR_NM,
          // "V_PARAM_N":eventData.V_PARAM_NM,
          // "V_PARAM_V":eventData.V_PARAM_VAL,
          // "V_PLATFORM_CD": this.connectionList.PLATFORM_TYP.PLATFORM_CD,
          // "V_PLATFORM_DSC": this.connectionList.PLATFORM_TYP.PLATFORM_DSC,
          // "REST_Service":["CXN"],
          // "Verb":["PUT"]
          "V_PLATFORM_CD":this.connectionList.PLATFORM_TYP.PLATFORM_CD,
          "V_SRC_CD":this.V_SRC_CD,
          "V_CXN_CD":eventData.V_CXN_CD,
          "V_USR_NM":this.V_USR_NM,
          "V_CXN_TYP":eventData.V_CXN_TYP,
          "V_COMMNT":"initial comment",
          "REST_Service":"Machine_Connection",
          "Verb":"PUT"
        }
      
        this.systemOverview.addCxn(data).subscribe(res => {
          this.systemOverview.getAllMachineConnections();
        }, err => {
           
        })
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
      width: '300px',
      data: {cxn:cxn, isSelectedEntity:'CXN', type:'Executable'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.systemOverview.getAllMachineConnections();
        this.systemOverview.getAllExes();
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
        index:index,
        machineData: this.machine
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
      width: '730px',
      data: cxn
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.systemOverview.getAllMachineConnections();
      }
    });
  }

  onContextMenuDeleteConnBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnDeleteConnectionClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnDeleteConnectionClick(cnx) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '300px',
    });

    dialogRef.componentInstance.title = `Delete Machine- ${cnx.V_PLATFORM_CD} connection`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Connection <strong>${cnx.cnxData.V_CXN_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.delete(this.apiUrlGet+'V_CXN_TYP='+ cnx.cnxData.V_CXN_TYP + '&V_CXN_CD='+ cnx.cnxData.V_CXN_CD + '&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=CXN&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllMachineConnections();
        }, err => {
        }); 
      }
    });
  }

  onContextMenuRemoveConnBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnRemoveConnectionClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnRemoveConnectionClick(cnx) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '300px',
    });

    dialogRef.componentInstance.title = `Remove Machine- ${cnx.V_PLATFORM_CD} connection`;
    dialogRef.componentInstance.message = `Are you sure, you want to remove Connection <strong>${cnx.cnxData.V_CXN_CD}</strong> from machine?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {

        this.http.delete(this.apiUrlGet+'V_PLATFORM_CD='+ cnx.machineData.PLATFORM_CD +'&V_CXN_TYP='+ cnx.cnxData.V_CXN_TYP +'&V_COMMNT="initial comment"&V_USR_NM='+ this.V_USR_NM +'&V_CXN_CD='+ cnx.cnxData.V_CXN_CD +'&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Machine_Connection&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllMachineConnections();
        }, err => {
        }); 
      }
    });
  }

  onContextMenuRemoveFromAllConnBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnRemoveFromAllConnectionClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnRemoveFromAllConnectionClick(cnx) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '300px',
    });

    dialogRef.componentInstance.title = `Remove Machine- ${cnx.V_PLATFORM_CD} connection`;
    dialogRef.componentInstance.message = `Are you sure, you want to remove Connection <strong>${cnx.cnxData.V_CXN_CD}</strong> from all machines?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        
        this.http.delete(this.apiUrlGet+'V_PLATFORM_CD=""&V_CXN_TYP='+ cnx.cnxData.V_CXN_TYP +'&V_COMMNT="initial comment"&V_USR_NM='+ this.V_USR_NM +'&V_CXN_CD='+ cnx.cnxData.V_CXN_CD +'&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Machine_Connection&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllMachineConnections();
        }, err => {
        }); 
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
