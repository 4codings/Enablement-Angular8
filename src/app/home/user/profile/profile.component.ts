import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {Router, NavigationEnd} from '@angular/router';
import {filter, take} from 'rxjs/operators';

import {StorageSessionService} from 'src/app/services/storage-session.service';
import {RollserviceService} from 'src/app/services/rollservice.service';
import {UseradminService} from '../../../services/useradmin.service2';

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
    public toastr: ToastrService,
    public userAdmin: UseradminService
  ) {
  }

  options = [];
  optionSelected: string = '';

  chooseWorkingProfile() {
    this.rollserviceService.getRollCd().then((res) => {
      if (res) {
        if (this.hasRole('End User Role', res)) {
          this.router.navigateByUrl('End_User', {skipLocationChange: true});
        }else if(this.hasRole('System Admin Role', res)){
          this.router.navigateByUrl('System_Admin', {skipLocationChange: true});
        }else if(this.hasRole('Developer Role', res)){
          this.router.navigateByUrl('Developer', {skipLocationChange: true});
        }else if(this.hasRole('Finance Role', res)){
          this.router.navigateByUrl('Cost', {skipLocationChange: true});
        }else if(this.hasRole('IT Asset Role', res)){
          this.router.navigateByUrl('Assets', {skipLocationChange: true});
        }else {
            this.toastr.info(this.userAdmin.controlVariables['noRole'],'No Role');
        }
      }
    });
  }

  hasRole(roleName: string, allroles: string[]): boolean {
    return !!(allroles &&  allroles.filter(role => role === roleName).length);
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(' ', '_'), {skipLocationChange: true});
    //this.router.navigateByUrl(e);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      take(1)
    )
      .subscribe(() => this.location.replaceState(''));
    this.chooseWorkingProfile();
  }

}
