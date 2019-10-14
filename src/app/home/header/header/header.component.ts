import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../../core/user.service';
import { OptionalValuesService } from '../../../services/optional-values.service';
import { ApiService } from '../../../service/api/api.service';
import { RollserviceService } from '../../../services/rollservice.service';
import { MatDialog } from '@angular/material';
import { ChangeImageComponent } from '../../../shared/components/change-image/change-image.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  options: any = [];
  showprofilebtn: boolean = true;
  public userName: string = '';
  public agency: string = '';
  public index: any;
  // public selectedProfile = '';
  optionSelected: string = "";
  imageUrl;
  @Input() selectedProfile = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private optionalService: OptionalValuesService,
    private apiService: ApiService,
    private rollserviceService: RollserviceService,
    public toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.index = this.userName.indexOf('@');
    this.userName = this.userName.substring(0, this.index).toUpperCase();
    if (this.userName == undefined) {
      this.router.navigate([''], { skipLocationChange: true });
    }
  }
  switchprofile() {
    this.router.navigateByUrl('/user', { skipLocationChange: true });
  }
  ngOnInit() {
    this.userName = JSON.parse(sessionStorage.getItem('u')).USR_NM
    this.agency = JSON.parse(sessionStorage.getItem('u')).SRC_CD;;
    this.imageUrl = "https://enablement.us/" + this.userName + "/pic"; 

    this.chooworkingProfile();
    // let url:string="user";
    // this.router.navigateByUrl(url);
    if (this.router.url == "/End_User/Design") {
      this.selectedProfile = "End_User";
    } else if (this.router.url == "/User_Admin/Adminuser") {
      this.selectedProfile = "User_Admin";
    } else if (this.router.url == "/System_Admin/AppDeploy") {
      this.selectedProfile = "System_Admin";
    }
  }

  logout() {
    this.apiService.logout('LOGOUT');
    this.optionalService.applicationOptionalValue.next(null);
    this.optionalService.processOptionalValue.next(null);
    this.optionalService.serviceOptionalValue.next(null);
    this.optionalService.applicationProcessValue.next(null);
    this.optionalService.applicationArray = [];
    this.optionalService.serviceArray = [];
    this.optionalService.processArray = [];
    this.optionalService.applicationProcessArray = [];
    this.userService.clear();
    this.rollserviceService.clear();
    this.router.navigateByUrl('/login', { skipLocationChange: true });
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
   
    this.selectedProfile = e;
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(" ", "_"), { skipLocationChange: true });
    //this.router.navigateByUrl(e);
  }

  chooworkingProfile() {
    this.rollserviceService.getRollCd().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i] == "End User Role") {
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

  changeProfileImg() {
    const dialogRef = this.dialog.open(ChangeImageComponent, {
      panelClass: 'app-dialog',
      width: '400px',
      data: { heading: "Profile Image", name: 'profile-pic' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  changeAgencyLogo() {
    const dialogRef = this.dialog.open(ChangeImageComponent, {
      panelClass: 'app-dialog',
      width: '400px',
      data: { heading: "Agency Image", name: 'logo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
