import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router'
import { filter, take } from 'rxjs/operators';

import { StorageSessionService } from 'src/app/services/storage-session.service';
import { RollserviceService } from 'src/app/services/rollservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  //   styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private StorageSessionService: StorageSessionService,
    private rollserviceService: RollserviceService,
    private location: Location,
    public toastr: ToastrService
  ) { }

  options = [];
  optionSelected: string = "";

  chooworkingProfile() {
    this.rollserviceService.getRollCd().then((res) => {
      if (res) {
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
      }
      if (this.options.length == 1) {
        this.toastr.info(this.options[0].toString(), "profile");
        this.router.navigateByUrl(this.options.pop(), { skipLocationChange: true });
      }
      this.StorageSessionService.setLocatS("profileopt", this.options);
    });
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(" ", "_"), { skipLocationChange: true });
    //this.router.navigateByUrl(e);
  }
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1)
    )
      .subscribe(() => this.location.replaceState(''));
    this.chooworkingProfile();
  }

}
