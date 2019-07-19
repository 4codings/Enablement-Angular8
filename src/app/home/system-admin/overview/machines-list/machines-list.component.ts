import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';

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
  public selectedMachineType= "All";
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  machineTypeOptions;
  @Output() selectedMachine: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private http:HttpClient, private systemOverview:SystemAdminOverviewService) { }

  ngOnInit() {
    //this.getMachine();
    this.systemOverview.getMachine();
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=MACHINES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.machineTypeOptions = res;
      this.machineTypeOptions.push({V_PLATFORM_CD:"All"});
    }, err => {
      console.log(err);
    });
    this.systemOverview.getMachineConnection$.subscribe(res => {
      this.sortedAllConnections = res;
    })
  }

  // getMachine() {
  //   this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=MACHINES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
  //     this.machines = res;
  //     this.getAllMachineConnections();
  //   }, err => {
  //      console.log(err);
  //   })
  // }

  // getAllMachineConnections() {
  //   this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=CXNS&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
  //     this.machines.forEach(item => {
  //       let arr = res.filter(data => {
  //         return item.V_PLATFORM_ID == data.V_PLATFORM_ID
  //       })
  //       this.connections.push({V_PLATFORM_CD: item.V_PLATFORM_CD, V_CXN:arr});
  //       this.sortedAllConnections = this.connections.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
  //     });
  //   }, err => {
  //      console.log(err);
  //   })
  // }

  changeMachineType(type) {
    this.selectedMachineType = type.V_PLATFORM_CD;
    this.selectedMachine.emit(type.V_PLATFORM_CD);
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
  
  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
