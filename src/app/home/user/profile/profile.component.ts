import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  api = environment.domainName;
  options = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const data = {
      agency : 'CBP 4',
      V_USR_NM: 'cbp4@adventbusiness.com'
    };
    this.http.get<data>(this.api + 'rest/E_DB/SP?V_SRC_CD=' + data.agency + '&V_USR_NM=' + data.V_USR_NM + '&REST_Service=UserRoles&Verb=GET').subscribe(
      data => {
        // (data);
        if (data.ROLE_CD) {
          for (let i = 0; i < data.ROLE_CD.length; i++) {
            // (data.ROLE_CD[i]);
            if (data.ROLE_CD[i] == 'Developer Role') {
             const data = {Lable: 'Developer' , path: '../developer'};
             this.options.push(data);
            } else if (data.ROLE_CD[i] == 'End User Role') {
              const data = {Lable: 'End_User' , path: '../End_User'};
              this.options.push(data);
            } else if (data.ROLE_CD[i] == 'System Admin Role') {
              const data = {Lable: 'System_Admin' , path: '../System_Admin'};
              this.options.push(data);
            } else if (data.ROLE_CD[i] == 'Finance Role') {
              const data = {Lable: 'Cost' , path: '../Cost'};
              this.options.push(data);
            } else if (data.ROLE_CD[i] == 'IT Asset Role') {

              const data = {Lable: 'Assets' , path: '../Assets'};
              this.options.push(data);
            } else if (data.ROLE_CD[i] == 'User Admin Role') {
              // this.options.push("User_Admin");
              const data = {Lable: 'User_Admin' , path: '../User_Admin'};
              this.options.push(data);
            }

          }
        }

      });
  }

}

export interface data {
  ROLE_CD: string[];
}
