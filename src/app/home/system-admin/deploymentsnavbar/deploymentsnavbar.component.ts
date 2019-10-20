import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from '../../../services/rollservice.service';
import { ApiService } from '../../../service/api/api.service';
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
  imageUrl;
  timeStamp;
  V_SRC_CD;
  V_USR_NM;
  headerTxt = '';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private rollserviceService: RollserviceService,
    private httpClient: HttpClient, private apiService:ApiService) {

    iconRegistry.addSvgIcon(
      'machines',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/navbaricons/machines.svg'));
  }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.apiService.imageLogoUrlSubject.subscribe(data => {
      if(data == '') {
        this.imageUrl = `https://enablement.us/${JSON.parse(sessionStorage.getItem('u')).SRC_CD}/logo`;
      } else {
        this.imageUrl = data;
        this.timeStamp = (new Date()).getTime();
      }
    });
    this.rollserviceService.getRollCd().then((res) => {
      this.httpClient.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        this.headerTxt = this.ctrl_variables.system_admin_header;
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

  public getLinkPicture() {
    if(this.timeStamp) {
      return this.imageUrl + '?' + this.timeStamp;
    }
    return this.imageUrl;
  } 

}
