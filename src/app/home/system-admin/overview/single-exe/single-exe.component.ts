import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { EditExeTypeDialogComponent } from '../dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';

@Component({
  selector: 'app-single-exe',
  templateUrl: './single-exe.component.html',
  styleUrls: ['./single-exe.component.scss']
})
export class SingleExeComponent implements OnInit {

  @Input() exeType;
  @Input() allExes;
  public exes = [];
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;

  constructor(private http:HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    // this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_SRC_CD="+this.V_SRC_CD+"&V_EXE_TYP="+this.exeType.EXE_TYP+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=UsersExe&Verb=GET").subscribe(res => {
    //   //console.log(res);
    //   this.exes = res;
    // });
    this.exes = this.allExes.filter(item => {
      return item.V_EXE_TYP == this.exeType.EXE_TYP;
    });

  }

  onBtnDeleteExeClick(exe) {
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete ExeType - ${exe.EXE_TYP}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete ExeType <strong>${exe.EXE_TYP}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnEditExeClick(exe) {
    const dialogRef = this.dialog.open(EditExeTypeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {platform_cd: "platform_cd", platform_des: "platform_des"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnAssignRoleClick(exeType) {

  }

}
