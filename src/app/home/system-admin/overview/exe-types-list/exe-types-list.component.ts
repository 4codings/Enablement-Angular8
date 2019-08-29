import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';

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
  @Input() selectedExeType;
  @Input() userAccess;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  exeTypeOptions;
  @Output() selectedExe: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private http:HttpClient, private systemOverview:SystemAdminOverviewService) { }

  ngOnInit() {
    this.systemOverview.getExe();
    //this.systemOverview.getTypes();
    this.systemOverview.typeOptions$.subscribe(types => {
      this.exeTypeOptions = types;
    });
    // this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
    //   this.exeTypeOptions = res;
    //   this.exeTypeOptions.push({EXE_TYP:"All"});
    //   this.exeTypeOptions = this.exeTypeOptions.sort((a,b) => {
    //     if (a.EXE_TYP < b.EXE_TYP) //sort string ascending
    //       return -1;
    //     if (a.EXE_TYP > b.EXE_TYP)
    //       return 1;
    //     return 0; 
    //   });
    // }, err => {
    //    console.log(err);
    // });
    this.systemOverview.getExe$.subscribe(res => {
      this.sortedAllExes = res;
    })
  }

  changeExeType(type): void {
    //console.log(type);
    this.selectedExeType = type;
    this.selectedExe.emit(type);
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

  onAssignMcnPlfClick() {
    const dialogRef = this.dialog.open(AssignMcnPlfComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {isSelectedEntity: "PLATFORM"}
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
