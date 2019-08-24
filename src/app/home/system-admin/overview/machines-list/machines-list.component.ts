import { Component, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { ManageMachinesComponent } from '../dialogs/manage-machines/manage-machines.component';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']
})
export class MachinesListComponent implements OnInit {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public machines;
  public connections=[];
  public sortedAllConnections = [];
  @Input() selectedConnectionType;
  @Input() userAccess;
  
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  connectionTypeOptions;
  @Output() selectedMachine: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private http:HttpClient, private systemOverview:SystemAdminOverviewService) { }

  ngOnInit() {
    this.systemOverview.getMachine();
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.connectionTypeOptions = res;
      this.connectionTypeOptions.push({EXE_TYP:"All"});
      this.connectionTypeOptions = this.connectionTypeOptions.sort((a,b) => {
        if (a.EXE_TYP < b.EXE_TYP) //sort string ascending
          return -1;
        if (a.EXE_TYP > b.EXE_TYP)
          return 1;
        return 0; 
      });
    }, err => {
       console.log(err);
    });
    this.systemOverview.getMachineConnection$.subscribe(res => {
      this.sortedAllConnections = res;
    })
  }


  changeMachineType(type) {
    this.selectedConnectionType = type.EXE_TYP;
    this.selectedMachine.emit(type.EXE_TYP);
  }
  
  onAddMachineBtnClick() {
    const dialogRef = this.dialog.open(AddPlatformDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {platform_cd: "platform_cd", platform_des: "platform_des"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onManageMachineBtnClick() {
    const dialogRef = this.dialog.open(ManageMachinesComponent, {
      panelClass: 'app-dialog',
      width: '650px',
      data: {platform_cd: "platform_cd", platform_des: "platform_des"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
