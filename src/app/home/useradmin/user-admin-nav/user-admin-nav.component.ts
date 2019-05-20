import { Component, OnInit } from '@angular/core';

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
  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit() {
  }

}
