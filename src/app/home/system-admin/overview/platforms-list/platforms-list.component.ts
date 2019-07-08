import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';

@Component({
  selector: 'app-platforms-list',
  templateUrl: './platforms-list.component.html',
  styleUrls: ['./platforms-list.component.scss']
})
export class PlatformsListComponent implements OnInit, OnDestroy {
  
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public exes;
  public allExes;
  public selectedPlatFormType= "All";
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  platformTypeOptions;
  @Output() selectedPlatform: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog, private http:HttpClient) { }

  ngOnInit() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=PLATFORM&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.platformTypeOptions = res;
      this.platformTypeOptions.push({PLATFORM_DSC: "All", PLATFORM_ID: 1, PLATFORM_CD: "All"});
      //console.log(this.platformTypeOptions);
    }, err => {
      console.log(err);
    });
    this.getExe();
    this.getAllExes();
  }

  getExe() {
    this.http.get("https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=EXE&V_SRC_CD=cbp75&REST_Service=Masters&Verb=GET").subscribe(res => {
      //console.log(res);
      this.exes = res;
    }, err => {
       console.log(err);
    })
  }

  getAllExes() {
    this.http.get("https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=EXES&V_SRC_CD=cbp75&REST_Service=Masters&Verb=GET").subscribe(res => {
      //console.log(res);
      this.allExes = res;
    }, err => {
       console.log(err);
    })
  }

  changePlatformType(type): void {
    this.selectedPlatFormType = type.PLATFORM_CD;
    this.selectedPlatform.emit(type.PLATFORM_CD);
  }

  onAddPlatformBtnClick() {
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

export interface DialogData {
  platform_cd: string;
  platform_des: string;
}
