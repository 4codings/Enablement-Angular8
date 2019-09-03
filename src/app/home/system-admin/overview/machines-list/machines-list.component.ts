import { Component, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { ManageMachinesComponent } from '../dialogs/manage-machines/manage-machines.component';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']
})
export class MachinesListComponent implements OnInit {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  machines = [];
  public connections=[];
  public sortedAllConnections = [];
  @Input() selectedConnectionType;
  @Input() userAccess;
  
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  connectionTypeOptions;
  @Output() selectedMachine: EventEmitter<any> = new EventEmitter();
  domain_name=this.globals.domain_name;

  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(public dialog: MatDialog, private http:HttpClient, private systemOverview:SystemAdminOverviewService, private globals:Globals) { }

  ngOnInit() {
    //this.systemOverview.getAllMachineConnections();
    this.systemOverview.typeOptions$.subscribe(types => {
      this.connectionTypeOptions = types;
    })
   
    this.systemOverview.getMachineConnection$.subscribe(res => {
      this.sortedAllConnections = res;
    });

    this.MachineCode();
  }

  MachineCode() {
    this.http.get(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=Users_Machines&Verb=GET").subscribe((res:any)=>{
      this.machines=res;
    });
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

  onAssignMcnPlfClick() {
    const dialogRef = this.dialog.open(AssignMcnPlfComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {isSelectedEntity: "MACHINE"}
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
