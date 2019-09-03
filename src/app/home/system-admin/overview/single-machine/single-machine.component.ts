import { Component, OnInit, Input } from '@angular/core';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { MatDialog } from '@angular/material';
import { ManageMachinesComponent } from '../dialogs/manage-machines/manage-machines.component';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
import { Globals } from 'src/app/services/globals';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-single-machine',
  templateUrl: './single-machine.component.html',
  styleUrls: ['./single-machine.component.scss']
})
export class SingleMachineComponent implements OnInit {

  @Input() machineData;
  @Input() cxnData;
  @Input() machines;
  @Input() userRoleAccess;
  @Input() selectedConnectionType;
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrl = "https://"+this.domain_name+"/rest/v1/secured";


  constructor(private systemOverview:SystemAdminOverviewService, public dialog: MatDialog, private globals:Globals, private http: HttpClient) { }

  ngOnInit() {
  }

  onBtnDeleteMachineClick(machine) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete Machine - ${machine.PLATFORM_CD}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Machine <strong>${machine.PLATFORM_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.delete(this.apiUrlGet+"V_PLATFORM_CD="+machine.PLATFORM_CD+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Machine&Verb=DELETE").subscribe(
          res=>{
            console.log('The dialog was closed');
          });
      }
    });
  }

  onBtnEditMachineClick(machine) {
    const dialogRef = this.dialog.open(ManageMachinesComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: machine
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnAssignRoleClick(machine) {
    const dialogRef = this.dialog.open(AssignMcnPlfComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {isSelectedEntity: "MACHINE", machine:machine}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  selectedMachineTile(connection) {
    //console.log("connection", connection);
    this.systemOverview.selectCxn(connection);
  }

}
