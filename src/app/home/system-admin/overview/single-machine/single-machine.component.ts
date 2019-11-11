import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() selectedExe;
  @Input() selectedConn;
  @Output() selectedConntile = new EventEmitter();

  V_SRC_CD: string = '';
  V_USR_NM: string = '';
  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrl = "https://" + this.domain_name + "/rest/v1/secured";


  constructor(private systemOverview: SystemAdminOverviewService, public dialog: MatDialog, private globals: Globals, private http: HttpClient) { }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  }

  onBtnDeleteMachineClick(machine) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '300px',
    });

    dialogRef.componentInstance.title = `Delete Machine - ${machine.PLATFORM_CD}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Machine <strong>${machine.PLATFORM_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(this.apiUrlGet + "V_PLATFORM_CD=" + machine.PLATFORM_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine&Verb=DELETE").subscribe(
          res => {
            this.systemOverview.getExe();
          });
      }
    });
  }

  onBtnEditMachineClick(machine) {
    const dialogRef = this.dialog.open(ManageMachinesComponent, {
      panelClass: 'app-dialog',
      width: '300px',
      data: machine
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onBtnAssignRoleClick(machine) {
    const dialogRef = this.dialog.open(AssignMcnPlfComponent, {
      panelClass: 'app-dialog',
      width: '300px',
      data: { isSelectedEntity: "MACHINE", machine: machine }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  selectedMachineTile(connection) {
    if (connection === 'exeSelect') {
      this.selectedConntile.emit(null);
    } else {
      this.systemOverview.selectCxn(connection);
      this.selectedConntile.emit(connection);
    }
  }

}
