import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { SystemAdminOverviewService } from './system-admin-overview.service';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from '../../../services/rollservice.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit,OnDestroy {

  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  selectedExeType: string = 'E_REST';
  //selectedMachineType: string = 'All';
  ctrl_variables;

  public userAccess = {
    role_status:false,
    role_install:false,
    role_machineConnection:false,
    role_deployment:false,
    role_connection:false,
    role_machine:false,
    role_machineSpec:false,
    role_platform:false
  }

  constructor(private systemOverview:SystemAdminOverviewService, private rollserviceService: RollserviceService, private http:HttpClient) {}

  ngOnInit() {
    this.getRollAccess();
  }

  onFileUploadBtnClick(inputId: string): void {
    document.getElementById(inputId).click();
  }

  downloadFile(fileName: any) {
    //this.overviewService.downloadFile(fileName);
  }

  onFileSelectEvent(event, filename, moduleName): void {
    //this.overviewService.uploadFile(event, filename, moduleName);
  }
  
  selectedExe(type) {
    console.log(type);
    this.selectedExeType = type;
  }

  selectedMachine(type) {
     this.selectedExeType = type
  }

  getRollAccess() {
    this.rollserviceService.getRollCd().then((res) => {
      this.http.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        res.map((role) => {
          switch (role) {
            case 'Enablement System Admin Status Role':
              if (this.ctrl_variables.show_SystemAdminStatusTab) {
                this.userAccess.role_status = true;
              }
              break;
            case 'Enablement System Admin Install Role':
              if (this.ctrl_variables.show_SystemAdminInstallTab) {
                this.userAccess.role_install = true;
              }
              break;
            case 'Enablement System Admin Machine Connection Role':
              if (this.ctrl_variables.show_SystemAdminMachineConnectionTab) {
                this.userAccess.role_machineConnection = true;
              }
              break;
            case 'Enablement System Admin Deployment Role':
              if (this.ctrl_variables.show_SystemAdminDeploymentTab) {
                this.userAccess.role_deployment = true;
              }
              break;
            case 'Enablement System Admin Connection Role':
              if (this.ctrl_variables.show_SystemAdminConnectionTab) {
                this.userAccess.role_connection = true;
              }
              break;
            case 'Enablement System Admin Machine Role':
              if (this.ctrl_variables.show_SystemAdminMachineTab) {
                this.userAccess.role_machine = true;
              }
              break;
            case 'Enablement System Admin Machine Specs Role':
              if (this.ctrl_variables.show_SystemAdminMachineSpecTab) {
                this.userAccess.role_machineSpec = true;
              }
              break;
            case 'Enablement System Admin Platform Role':
              if (this.ctrl_variables.show_SystemAdminPlatformTab) {
                this.userAccess.role_platform = true;
              }
              break;
            default:
              break;
          }
        });
      });
    });
  }

  ngOnDestroy(): void {
    //this.unsubscribeAll.next(true);
    //this.unsubscribeAll.complete();
  }

}
