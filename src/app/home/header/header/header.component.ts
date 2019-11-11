import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../../core/user.service';
import { OptionalValuesService } from '../../../services/optional-values.service';
import { ApiService } from '../../../service/api/api.service';
import { RollserviceService } from '../../../services/rollservice.service';
import { MatDialog } from '@angular/material';
import { ChangeImageComponent } from '../../../shared/components/change-image/change-image.component';
import { environment } from '../../../../environments/environment';
import { roleTypeConstant } from 'src/app/shared/_models/role.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  options: any = [];
  domain = environment.apiURL;
  showprofilebtn: boolean = true;
  public userName: string = '';
  public agency: string = '';
  public index: any;
  // public selectedProfile = '';
  optionSelected: string = "";
  timeStamp;
  imageUrl = `https://${this.domain}/${JSON.parse(sessionStorage.getItem('u')).USR_NM}/pic`;
  @Input() selectedProfile = '';
  changeLogoFlag = false;
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
    this.userName = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.agency = JSON.parse(sessionStorage.getItem('u')).SRC_CD;

    this.chooworkingProfile();
    // let url:string="user";
    // this.router.navigateByUrl(url);
    if (this.router.url == "/End_User/Design") {
      this.selectedProfile = "Workflow";
    } else if (this.router.url == "/User_Admin/Adminuser") {
      this.selectedProfile = "Administrator";
    } else if (this.router.url == "/System_Admin/AppDeploy") {
      this.selectedProfile = "System";
    }
  }

  logout() {
    this.apiService.logout('LOGOUT');
    // sessionStorage.removeItem('u');
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
    if (this.selectedProfile == 'Workflow') {
      e = "End_User"
    } else if (this.selectedProfile == 'Administrator') {
      e = "User_Admin"
    } else if (this.selectedProfile == 'IT Infrastructure') {
      e = "System_Admin"
    }
    this.router.navigateByUrl(e.replace(" ", "_"), { skipLocationChange: true });
    //this.router.navigateByUrl(e);
  }

  public getLinkPicture() {
    if (this.timeStamp) {
      return this.imageUrl + '?' + this.timeStamp;
    }
    return this.imageUrl;
  }

  chooworkingProfile() {
    this.rollserviceService.getRollCd().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].includes(roleTypeConstant.WORKFLOW)) {
          this.setOptions("Workflow");
        } else if (res[i].includes(roleTypeConstant.SYSTEM)) {
          this.setOptions("IT Infrastructure");
        } else if (res[i].includes(roleTypeConstant.FINANCE)) {
          this.setOptions("Cost");
        } else if (res[i].includes(roleTypeConstant.ASSET)) {
          this.setOptions("Assets");
        } else if (res[i].includes(roleTypeConstant.ADMINISTRATOR)) {
          this.setOptions("Administrator");
        }
        if (res[i] == 'Enablement User Admin Organization Role') {
          this.changeLogoFlag = true;
        }
      }
    });
  }

  setOptions(roleName) {
    if (this.options.length) {
      if (this.options.findIndex(v => v == roleName) == -1) {
        this.options.push(roleName);
      }
    } else {
      this.options.push(roleName);
    }
  }
  changeProfileImg() {
    const dialogRef = this.dialog.open(ChangeImageComponent, {
      panelClass: 'app-dialog',
      width: '400px',
      data: { heading: "Profile Image", name: 'profile-pic' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.imageUrl = "https://" + this.domain + "/" + this.userName + "/pic" + "?" + (new Date()).getTime();
        this.timeStamp = (new Date()).getTime();
      }
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
      if (result) {
        this.apiService.imageLogoUrlSubject.next("https://" + this.domain + "/" + this.agency + "/logo");
      }
    });
  }

}
