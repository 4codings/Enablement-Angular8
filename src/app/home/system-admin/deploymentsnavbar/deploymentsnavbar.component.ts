import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from 'src/app/services/rollservice.service';
@Component({
  selector: 'app-deploymentsnavbar',
  templateUrl: './deploymentsnavbar.component.html',
  styleUrls: ['./deploymentsnavbar.component.scss']
})
export class DeploymentsnavbarComponent implements OnInit {
  ctrl_variables: any;
  role_status:boolean=false;
  role_install:boolean=false;
  role_Install:boolean=false;
  role_machineConnection:boolean=false;
  role_deployment:boolean=false;
  role_connection:boolean=false;
  role_machine:boolean=false;
  role_machineSpec:boolean=false;
  role_platform:boolean=false;
  role_overview:boolean = true;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private rollserviceService: RollserviceService,
    private httpClient: HttpClient) { 
  
    iconRegistry.addSvgIcon(
      'machines',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/navbaricons/machines.svg'));
  }

  ngOnInit() {
    this.rollserviceService.getRollCd().then((res) => {
      this.httpClient.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        res.map((role) => {
          switch (role) {
            case 'Enablement System Admin Status Role':
              if (this.ctrl_variables.show_SystemAdminStatusTab) {
                this.role_status = true;
              }
              break;
            case 'Enablement System Admin Install Role':
              if (this.ctrl_variables.show_SystemAdminInstallTab) {
                this.role_install = true;
              }
              break;
            case 'Enablement System Admin Machine Connection Role':
              if (this.ctrl_variables.show_SystemAdminMachineConnectionTab) {
                this.role_machineConnection = true;
              }
              break;
            case 'Enablement System Admin Deployment Role':
              if (this.ctrl_variables.show_SystemAdminDeploymentTab) {
                this.role_deployment = true;
              }
              break;
            case 'Enablement System Admin Connection Role':
              if (this.ctrl_variables.show_SystemAdminConnectionTab) {
                this.role_connection = true;
              }
              break;
            case 'Enablement System Admin Machine Role':
              if (this.ctrl_variables.show_SystemAdminMachineTab) {
                this.role_machine = true;
              }
              break;
            case 'Enablement System Admin Machine Specs Role':
              if (this.ctrl_variables.show_SystemAdminMachineSpecTab) {
                this.role_machineSpec = true;
              }
              break;
            case 'Enablement System Admin Platform Role':
              if (this.ctrl_variables.show_SystemAdminPlatformTab) {
                this.role_platform = true;
              }
              break;
            case 'Enablement System Admin Overview Role':
              if (this.ctrl_variables.show_SystemAdminOverViewTab) {
                this.role_overview = true;
              }
              break;    
            default:
              break;
          }
        });
      });
    });
  }

}
