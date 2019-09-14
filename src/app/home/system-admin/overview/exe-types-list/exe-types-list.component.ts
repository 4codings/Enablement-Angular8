import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { AddPlatformDialogComponent } from '../add-platform-dialog/add-platform-dialog.component';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { AssignMcnPlfComponent } from '../dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { Globals } from 'src/app/services/globals';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-exe-types-list',
  templateUrl: './exe-types-list.component.html',
  styleUrls: ['./exe-types-list.component.scss']
})
export class ExeTypesListComponent implements OnInit, OnDestroy {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public exes;
  public plat;
  public allExes = [];
  public sortedAllExes = [];
  @Input() selectedExeType;
  public selectedPlatform = 'All';
  @Input() userAccess;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  exeTypeOptions;
  platformOptions;
  @Output() selectedExe: EventEmitter<any> = new EventEmitter();
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrldelete = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(public dialog: MatDialog, private http:HttpClient, private systemOverview:SystemAdminOverviewService, private globals:Globals) { }

  ngOnInit() {
    this.systemOverview.getExe();
    //this.systemOverview.getTypes();
    this.systemOverview.typeOptions$.subscribe(types => {
      this.exeTypeOptions = types;
    });
    
    this.systemOverview.platformOptions$.subscribe(platform => {
      this.platformOptions = platform;
    });

    this.systemOverview.getExe$.subscribe(res => {
      this.sortedAllExes = res;
    })
    //this.getPlatforms();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.platformOptions.filter(option => option.SERVER_CD.toLowerCase().includes(filterValue));
  }

  // getPlatforms(){
  //   this.http.get(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_CD_TYP=SERVER&REST_Service=Masters&Verb=GET").subscribe(
  //     (res:any)=>{
  //       this.plat=res;
  //     });
  // }

  onChange() {

  }

  changeExeType(type): void {
    //console.log(type);
    this.selectedExeType = type;
    this.selectedExe.emit(type);
  }

  changePlatform(platform): void {
    //console.log(type);
    this.selectedPlatform = platform;
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
