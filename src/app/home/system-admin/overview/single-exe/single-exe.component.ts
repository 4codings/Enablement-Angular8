import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { EditExeTypeDialogComponent } from '../dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-single-exe',
  templateUrl: './single-exe.component.html',
  styleUrls: ['./single-exe.component.scss']
})
export class SingleExeComponent implements OnInit {

  @Input() exeType;
  @Input() exes;
  @Input() selectedExeType;
  @Input() userRoleAccess;
  
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrldelete = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(private http:HttpClient, public dialog: MatDialog, private systemOverview:SystemAdminOverviewService, private globals:Globals) { }

  ngOnInit() {
    // this.exes = this.allExes.filter(item => {
    //     return item.V_EXE_TYP == this.exeType.EXE_TYP;
    // });
  }

  onBtnEditExeClick(plat) {
    const dialogRef = this.dialog.open(AddPlatformDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: plat
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnAssignRoleClick(plat) {
    const dialogRef = this.dialog.open(AssignMcnPlfComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {isSelectedEntity: "PLATFORM", server:plat}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnDeleteExeClick(p) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete Server - ${p.SERVER_CD}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete Server <strong>${p.SERVER_CD}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.http.delete(this.apiUrlGet+"V_SERVER_CD="+p.SERVER_CD+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Platform_Master&Verb=DELETE").subscribe(
          res=>{
            (res);
            
          });
      }
      console.log('The dialog was closed');
    });
  }

  selectedExeTile(exe) {
    //console.log("parent", exe);
    this.systemOverview.selectExe(exe);
  }

}
