import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { RollserviceService } from '../../../services/rollservice.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  //   styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public selectedProfile = '';
  options = [];
  optionSelected: string = "";

  constructor(
    private router: Router,
    private rollserviceService: RollserviceService,
    public toastr: ToastrService
  ) { }

  chooworkingProfile() {
    this.rollserviceService.getRollCd().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i] == "Developer Role") {
          this.options.push("Developer");
        } else if (res[i] == "End User Role") {
          this.options.push("End_User");
        } else if (res[i] == 'System Admin Role') {
          this.options.push("System_Admin");
        } else if (res[i] == 'Finance Role') {
          this.options.push("Cost");
        } else if (res[i] == 'IT Asset Role') {
          this.options.push("Assets");
        } else if (res[i] == 'User Admin Role') {
          this.options.push("User_Admin");
        }
      }
    });
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
     this.selectedProfile = e;
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(" ", "_"), { skipLocationChange: true });
    //this.router.navigateByUrl(e);
  }
  ngOnInit() {
    this.chooworkingProfile();
    // let url:string="user";
    // this.router.navigateByUrl(url);
    if(this.router.url == "/End_User/Design") {
      this.selectedProfile = "End_User";
    } else if(this.router.url == "/User_Admin/Adminuser") {
      this.selectedProfile = "User_Admin";
    } else if(this.router.url == "/Developer") {
      this.selectedProfile = "Devloper";
    } else if(this.router.url == "/System_Admin/AppDeploy") {
      this.selectedProfile = "System_Admin";
    }
  }

}
