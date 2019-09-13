import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExeDialogComponent } from '../dialogs/add-exe-dialog/add-exe-dialog.component';
import { Subscription } from 'rxjs';
import { EditExeTypeDialogComponent } from '../dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';
import { ConfirmationAlertComponent } from '../../../../shared/components/confirmation-alert/confirmation-alert.component';
import { HttpClient } from '@angular/common/http';
import { AssignConnectionExeComponent } from '../dialogs/assign-connection-exe/assign-connection-exe.component';

@Component({
  selector: 'app-exe-tile-list',
  templateUrl: './exe-tile-list.component.html',
  styleUrls: ['./exe-tile-list.component.scss']
})
export class ExeTileListComponent implements OnInit {
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  contextMenuData: any;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  subscription: Subscription;
  public selectedTile;
  public selectedCxn;
  public selectedCxnData = [];
  @Input() exes;
  @Input() userAccess;
  @Input() platData;
  @Input() selectedExeType;
  @Output() selectedExeTile = new EventEmitter();
  @Output() deleteExeEvent = new EventEmitter();
  public selectedMachine;
  @ViewChild('contextMenu', { static: false } as any) set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }
  constructor(private systemOverview:SystemAdminOverviewService, public dialog: MatDialog, private http:HttpClient) { }

  ngOnInit() {
    //console.log(this.exes);
    this.subscription = this.systemOverview.selectedCxn$.subscribe(data => {
      if(data) {
        this.selectedTile = null;
        this.selectedCxn = data.V_EXE_ID;
      } else {
        this.selectedCxn = [];
      }
    });
  
    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }

  isHighLightTile(exeData) { 
    if(this.selectedCxn != null) {
      for(let i=0; i<this.selectedCxn.length; i++) {
          if(exeData.V_EXE_ID == this.selectedCxn[i]) {
            return true;
          }
      }
      return false;
    }
  }

  onAddExeTileClick(exeType) {
    const dialogRef = this.dialog.open(AddExeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {EXE_TYP:exeType, platformData: this.platData}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        if(result) {
          this.systemOverview.getAllExes();
        }
      }
    });
  }

  exeDropped(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        // console.log("event.previousContainer.data",event.previousContainer.data);
        // console.log("event.container.data", event.container.data[event.currentIndex]);
        let eventData = event.container.data[event.currentIndex]; 
        
        let data = {
          // "V_EXE_CD": eventData.V_EXE_CD,
          // "V_SRC_CD": this.V_SRC_CD,
          // "V_EXE_SIGN": eventData.V_EXE_SIGN,
          // "V_PARAM_DLMTR_STRT": eventData.V_PARAM_DLMTR_STRT,
          // "V_PARAM_DLMTR_END":eventData.V_PARAM_DLMTR_END,
          // "V_EXE_VRSN": eventData.V_EXE_VRSN,
          // "V_EXE_TYP": eventData.V_EXE_TYP,
          // "V_SYNC_FLG": eventData.V_SYNC_FLG,
          // "V_EXE_DSC": eventData.V_EXE_DSC,
          // "V_EXE_OUT_PARAMS": eventData.V_EXE_OUT_PARAMS,
          // "V_USR_NM": this.V_USR_NM,
          // "V_EXE_IN_ARTFCTS": eventData.V_EXE_IN_ARTFCTS,
          // "V_EXE_OUT_ARTFCTS":eventData.V_EXE_OUT_ARTFCTS,
          // "V_SERVER_CD":this.exes.SERVER_TYP.SERVER_CD,
          // "V_COMMNT": '',
          // "V_ICN_TYP":eventData.V_ICN_TYP,
          // "REST_Service":["Exe"],
          // "Verb":["PUT"]
          "V_SERVER_CD":this.exes.SERVER_TYP.SERVER_CD,
          "V_SRC_CD":this.V_SRC_CD,
          "V_EXE_CD":eventData.V_EXE_CD,
          "V_EXE_TYP":eventData.V_EXE_TYP,
          "V_USR_NM":this.V_USR_NM,
          "V_COMMNT":"",
          "REST_Service":"Exe_Server",
          "Verb":"PUT"
        }
        this.systemOverview.addExe(data).subscribe(res => {
          this.systemOverview.getAllExes();
        }, err => {
           
        })
    }
  }

  onExeTileClick(exe) {
    
    if(this.selectedTile === exe) {
      this.selectedTile = null;
      this.selectedExeTile.emit(this.selectedTile);
    } else {
      this.selectedCxn = '';
      this.selectedTile = exe;
      this.selectedExeTile.emit(this.selectedTile);
    }

  }

  onTileMouseDownEventHandler(ev: MouseEvent): void {
    document.dispatchEvent(new MouseEvent('mousedown', ev));
  }

  openContextmenu(event: MouseEvent, data?: any, exeType?:any, index?:any) {
    event.preventDefault();
    if (data) {
      this.contextMenuData = {
        EXE_TYP: exeType,
        exeData:data,
        index:index,
        platFormData: this.platData
      }
    }
    this.contextMenuStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
    this.contextMenuActive = true;
  }

  onContextMenuEditExeBtnClick(): void {
    this.contextMenuActive = false;
    this.onBtnEditExeClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuDeleteExeBtnClick(): void {
    this.contextMenuActive = false;
    // this.deleteExeEvent.emit(this.contextMenuData);
    this.onBtnDeleteExeClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuRemoveFromAllExeBtnClick(): void {
    this.contextMenuActive = false;
    // this.deleteExeEvent.emit(this.contextMenuData);
    this.onBtnRemoveFromAllExeClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuRemoveExeBtnClick(): void {
    this.contextMenuActive = false;
    // this.deleteExeEvent.emit(this.contextMenuData);
    this.onBtnRemoveExeClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnEditExeClick(exeData) {
    //console.log(exeData);
    const dialogRef = this.dialog.open(EditExeTypeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: exeData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.systemOverview.getAllExes();
      }
    });
  }

  onContextMenuAssigneConnBtnClick() {
    this.contextMenuActive = false;
    this.onBtnAssignCxnClick(this.contextMenuData);
    this.contextMenuData = null;
  }

  onBtnAssignCxnClick(exe) {
    const dialogRef = this.dialog.open(AssignConnectionExeComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {exe:exe, isSelectedEntity:'EXE', type:'Connections'}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.systemOverview.getAllExes();
        this.systemOverview.getAllMachineConnections();
      }
    });
  }

  onBtnDeleteExeClick(exe) {
    //console.log(exe);
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete Exe- ${exe.EXE_TYP}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Exe <strong>${exe.exeData.V_EXE_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.get('https://enablement.us/Enablement/rest/v1/securedJSON?V_EXE_TYP='+ exe.EXE_TYP + '&V_EXE_CD='+ exe.exeData.V_EXE_CD + '&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Exe&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllExes();
        }, err => {
          console.log("err", err)
        }); 
      }
    });
  }

  onBtnRemoveFromAllExeClick(exe) {
    //console.log(exe);
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Remove Exe- ${exe.EXE_TYP}`;
    dialogRef.componentInstance.message = `Are you sure, you want to remove Exe <strong>${exe.exeData.V_EXE_CD}</strong> from all platforms?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.get('https://enablement.us/Enablement/rest/v1/secured?V_EXE_CD='+exe.exeData.V_EXE_CD+'&V_EXE_TYP='+exe.EXE_TYP+'&V_SERVER_CD=&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Exe_Server&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllExes();
        }, err => {
          console.log("err", err)
        }); 
      }
    });
  }

  onBtnRemoveExeClick(exe) {
    //console.log(exe);
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Remove Exe- ${exe.EXE_TYP}`;
    dialogRef.componentInstance.message = `Are you sure, you want to remove Exe <strong>${exe.exeData.V_EXE_CD}</strong> from the platform?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.get('https://enablement.us/Enablement/rest/v1/secured?V_EXE_CD='+exe.exeData.V_EXE_CD+'&V_EXE_TYP='+exe.EXE_TYP+'&V_SERVER_CD='+ exe.platFormData.SERVER_CD +'&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Exe_Server&Verb=DELETE').subscribe(res => {
          this.systemOverview.getAllExes();
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
