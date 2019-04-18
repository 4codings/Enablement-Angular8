import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-admin-nav',
  templateUrl: './user-admin-nav.component.html',
  styleUrls: ['./user-admin-nav.component.scss']
})
export class UserAdminNavComponent implements OnInit {

  isCollapsed: boolean;
  isNavbarCollapsed = true;
  constructor() {
    this.isCollapsed = true;
  }

  ngOnInit() {
  }

}
