import { Component, OnInit, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { ManageMachinesComponent } from '../dialogs/manage-machines/manage-machines.component';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { Globals } from 'src/app/services/globals';
import { FormControl } from '@angular/forms';

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
  public selectedMachineType = 'All';
  public machineTypeOptions;
  @Input() selectedConnectionType;
  @Input() userAccess;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  
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

    this.systemOverview.machineOptions$.subscribe(machine => {
      this.machineTypeOptions = machine;
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    //this.MachineCode();
  }

  // MachineCode() {
  //   this.http.get(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=Users_Machines&Verb=GET").subscribe((res:any)=>{
  //     this.machines=res;
  //   });
  // }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.machineTypeOptions.filter(option => option.PLATFORM_CD.toLowerCase().includes(filterValue));
  }

  onChange() {

  }

  changeMachineType(type) {
    this.selectedConnectionType = type.EXE_TYP;
    this.selectedMachine.emit(type.EXE_TYP);
  }

  changeMachine(machine) {
    this.selectedMachineType = machine;
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
