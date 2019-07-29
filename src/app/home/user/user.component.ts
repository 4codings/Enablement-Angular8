import { Component, OnInit } from '@angular/core';
import * as usreActions from '../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../store/user-admin/user/user.model';
import * as userSelectors from '../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../store/user-admin/user-group/usergroup.action';
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { Router, NavigationEnd } from '@angular/router';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ToastrService } from 'ngx-toastr';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { filter, take } from 'rxjs/operators';
import {Location} from '@angular/common';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

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
          this.router.navigateByUrl('End_User', { skipLocationChange: true });
        } else if (this.hasRole('System Admin Role', res)) {
          this.router.navigateByUrl('System_Admin', { skipLocationChange: true });
        } else if (this.hasRole('Developer Role', res)) {
          this.router.navigateByUrl('Developer', { skipLocationChange: true });
        } else if (this.hasRole('Finance Role', res)) {
          this.router.navigateByUrl('Cost', { skipLocationChange: true });
        } else if (this.hasRole('IT Asset Role', res)) {
          this.router.navigateByUrl('Assets', { skipLocationChange: true });
        } else {
          this.toastr.info(this.userAdmin.controlVariables['noRole'], 'No Role');
        }
      }
    });
  }

  hasRole(roleName: string, allroles: string[]): boolean {
    return !!(allroles && allroles.filter(role => role === roleName).length);
  }

  //Selected option in the profile section
  optionSelecteds(e: any) {
    //if(e.split(" ") > 0)
    // this.toastr.info("your profile "+e+"profile");
    this.router.navigateByUrl(e.replace(' ', '_'), { skipLocationChange: true });
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

  // public users$: Observable<User[]>;
  // public userGroups$: Observable<userGroup[]>;
  // error$: Observable<string>;
  // didLoading$: Observable<boolean>;
  // didLoaded$: Observable<boolean>;

  // constructor(private store: Store<AppState>) { }

  // ngOnInit() {
  //   //this.store.dispatch(new usreActions.getUser());
  //   //this.store.dispatch(new userGroupActions.getUserGroup());
  //   this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
  //   this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
  //   this.error$ = this.store.pipe(select(userSelectors.getErrors));
  //   this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
  //   this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));

  //   this.users$.subscribe(data => {
  //     if (data.length) {
  //       console.log('users', data);
  //     }
  //   });

  //   this.userGroups$.subscribe(data => {
  //     if (data.length) {
  //       console.log('userGroups-roles', data);
  //     }
  //   });

  // }

}
