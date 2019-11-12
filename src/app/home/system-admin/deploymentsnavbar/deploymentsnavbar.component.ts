import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from '../../../services/rollservice.service';
import { ApiService } from '../../../service/api/api.service';
import { environment } from '../../../../environments/environment';
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
  domain = environment.apiURL;

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
        this.imageUrl = `https://${this.domain}/${JSON.parse(sessionStorage.getItem('u')).SRC_CD}/logo`;
      } else {
        this.imageUrl = data;
        this.timeStamp = (new Date()).getTime();
      }
    });
  }

  public getLinkPicture() {
    if(this.timeStamp) {
      return this.imageUrl + '?' + this.timeStamp;
    }
    return this.imageUrl;
  } 

}
