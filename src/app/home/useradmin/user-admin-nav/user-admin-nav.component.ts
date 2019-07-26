import { Component, OnInit } from '@angular/core';

import { RollserviceService } from '../../../services/rollservice.service';

@Component({
  selector: 'app-user-admin-nav',
  templateUrl: './user-admin-nav.component.html',
  styleUrls: ['./user-admin-nav.component.scss']
})
export class UserAdminNavComponent implements OnInit {
  isCollapsed: boolean;
  isNavbarCollapsed = true;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;

  showOverview: boolean = false;
  showUser: boolean = false;
  showGroup: boolean = false;
  showMembership: boolean = false;
  showRole: boolean = false;
  showAssignRole: boolean = false;
  showAuth: boolean = false;
  showAuthorization: boolean = false;

  constructor(
    private rollserviceService: RollserviceService
  ) {
    this.isCollapsed = true;
  }

  ngOnInit() {
    this.rollserviceService.getRollCd().then((res) => {
      res.map((role) => {
        switch (role) {
          case 'Enablement User Admin Overview Role':
            this.showOverview = true;
            break;
          case 'Enablement User Admin Membership Role':
            this.showMembership = true;
            break;
          case 'Enablement User Admin User Role':
            this.showRole = true;
            break;
          default:
            break;
        }
      });
    });
  }

}
