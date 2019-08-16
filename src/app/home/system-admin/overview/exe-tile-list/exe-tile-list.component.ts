import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { MatDialog } from '@angular/material/dialog';
import { AddExeDialogComponent } from '../dialogs/add-exe-dialog/add-exe-dialog.component';
import { Subscription } from 'rxjs';
import { EditExeTypeDialogComponent } from '../dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';
import { ConfirmationAlertComponent } from '../../../../shared/components/confirmation-alert/confirmation-alert.component';
import { HttpClient } from '@angular/common/http';

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
  @Input() exes;
  @Input() userAccess;
  @Output() selectedExeTile = new EventEmitter();
  @Output() deleteExeEvent = new EventEmitter();
  public selectedMachine;
  @ViewChild('contextMenu', { static: false }) set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }
  constructor(private systemOverview:SystemAdminOverviewService, public dialog: MatDialog, private http:HttpClient) { }

  ngOnInit() {
    //console.log(this.exes);
    this.subscription = this.systemOverview.selectedCxn$.subscribe(data => {
      //console.log(data);
      if(data) {
        this.selectedTile = null;
        this.selectedCxn = data.V_CXN_TYP;
      } else {
        this.selectedCxn = '';
      }
    });

    document.addEventListener('mousedown', event => {
      this.contextMenuActive = false;
      this.contextMenuData = null;
    });
  }

  onAddExeTileClick(exeType) {
    const dialogRef = this.dialog.open(AddExeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {EXE_TYP:exeType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        if(result) {
          this.systemOverview.getExe();
        }
      }
    });
  }

  exeDropped(event: CdkDragDrop<any[]>) {
    console.log("event.previousContainer", event.previousContainer);
    console.log("event.container", event.container);
    if (event.previousContainer === event.container) {
      console.log("event",event);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        console.log("event.previousContainer.data",event.previousContainer.data);
        console.log("event.container.data", event.container.data);
        console.log("event.previousIndex", event.previousIndex);
        console.log("event.currentIndex", event.currentIndex);
      //this.addAuthEvent.emit(event.item.data);
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
        index:index
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
        this.systemOverview.getExe();
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
          console.log("res",res);
          this.systemOverview.getExe();
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
