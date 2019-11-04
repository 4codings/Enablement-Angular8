import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RollserviceService } from '../../../services/rollservice.service';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../../service/api/api.service';
import { environment } from '../../../../environments/environment';

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
    // this.rollserviceService.getRollCd().then((res) => {
    //   this.httpClient.get('../../../../assets/control-variable.json').subscribe(cvres => {
    //     this.ctrl_variables = cvres;
    //     this.headerTxt = this.ctrl_variables.user_admin_header;
    //     res.map((role) => {
    //       switch (role) {
    //         case 'Enablement User Admin Overview Role':
    //           if (this.ctrl_variables.show_UserAdminOverviewTab) {
    //             this.roll_overview = true;
    //           }
    //           break;
    //         case 'Enablement User Admin User Role':
    //           if (this.ctrl_variables.show_UserAdminUserTab) {
    //             this.roll_user = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Group Role':
    //           if (this.ctrl_variables.show_UserAdminGroupTab) {
    //             this.roll_group = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Membership Role':
    //           if (this.ctrl_variables.show_UserAdminMembershipTab) {
    //             this.roll_membership = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Role Role':
    //           if (this.ctrl_variables.show_UserAdminRoleTab) {
    //             this.roll_role = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Assign Roles Role':
    //           if (this.ctrl_variables.show_UserAdminAssignRoleTab) {
    //             this.roll_assignRole = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Auth Role':
    //           if (this.ctrl_variables.show_UserAdminAuthTab) {
    //             this.roll_auth = true;
    //           }
    //           break;
    //         case 'Enablement User Admin Authorize Roles Role':
    //           if (this.ctrl_variables.show_UserAdminAuthorizationTab) {
    //             this.roll_authorization = true;
    //           }
    //           break;
    //         default:
    //           break;
    //       }
    //     });
    //   });
    // });
  }

  public getLinkPicture() {
    if(this.timeStamp) {
      return this.imageUrl + '?' + this.timeStamp;
    }
    return this.imageUrl;
  } 

}
