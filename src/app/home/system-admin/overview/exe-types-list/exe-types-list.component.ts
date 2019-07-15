import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { forEach } from '@angular/router/src/utils/collection';
import { ConfirmationAlertComponent } from 'src/app/shared/components/confirmation-alert/confirmation-alert.component';
import { EditExeTypeDialogComponent } from '../dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';

@Component({
  selector: 'app-exe-types-list',
  templateUrl: './exe-types-list.component.html',
  styleUrls: ['./exe-types-list.component.scss']
})
export class ExeTypesListComponent implements OnInit, OnDestroy {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public exes;
  public allExes = [];
  public sortedAllExes = [];
  public selectedExeType= {EXE_TYP:"E_REST"};
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  exeTypeOptions;
  @Output() selectedExe: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private http:HttpClient) { }

  ngOnInit() {
    this.getExe();
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.exeTypeOptions = res;
      this.exeTypeOptions.push({EXE_TYP:"All"});
    }, err => {
       console.log(err);
    });
  }

  getExe() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res) => {
      this.exes = res;
      this.getAllExes();
    }, err => {
       console.log(err);
    })
  }

  getAllExes() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.exes.forEach(item => {
        let arr = res.filter(data => {
          return item.EXE_TYP == data.V_EXE_TYP
        })
        this.allExes.push({EXE_TYP: item.EXE_TYP, EXES:arr})
      });
      this.sortedAllExes = this.allExes.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
    }, err => {
       console.log(err);
    })
  }


  changeExeType(type): void {
    this.selectedExeType = type;
    this.selectedExe.emit(type.EXE_TYP);
  }

  onAddExeBtnClick() {
    const dialogRef = this.dialog.open(AddPlatformDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {platform_cd: "platform_cd", platform_des: "platform_des"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onBtnDeleteExeClick() {
    /*
    const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
      panelClass: 'app-dialog',
      width: '600px',
    });

    dialogRef.componentInstance.title = `Delete ExeType - ${exe.EXE_TYP}`;
    dialogRef.componentInstance.message = `Are you sure, you want to delete ExeType <strong>${exe.EXE_TYP}</strong>?`;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    */
  }

  onBtnEditExeClick() {
    /*
    const dialogRef = this.dialog.open(EditExeTypeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {platform_cd: "platform_cd", platform_des: "platform_des"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    */
  }
  
  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
