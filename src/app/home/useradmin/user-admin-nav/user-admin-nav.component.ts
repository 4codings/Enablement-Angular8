import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../service/api/api.service';
import { RollserviceService } from '../../../services/rollservice.service';


@Component({
  selector: 'app-user-admin-nav',
  templateUrl: './user-admin-nav.component.html',
  styleUrls: ['./user-admin-nav.component.scss']
})
export class UserAdminNavComponent implements OnInit {
  isCollapsed: boolean;
  isNavbarCollapsed = true;
  domain = environment.apiURL;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;

  roll_overview: boolean = false;
  roll_user: boolean = false;
  roll_group: boolean = false;
  roll_membership: boolean = false;
  roll_role: boolean = false;
  roll_assignRole: boolean = false;
  roll_auth: boolean = false;
  roll_authorization: boolean = false;
  headerTxt = '';
  ctrl_variables: any;
  imageUrl;
  timeStamp;
  navigationSubscription;
  constructor(
    private rollserviceService: RollserviceService,
    private httpClient: HttpClient,
    private router: Router,
    private apiService:ApiService
  ) {
    this.isCollapsed = true;
  }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
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
