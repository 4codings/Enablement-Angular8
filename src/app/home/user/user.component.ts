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
import { StorageSessionService } from '../../services/storage-session.service';
import { RollserviceService } from '../../services/rollservice.service';
import { ToastrService } from 'ngx-toastr';
import { UseradminService } from '../../services/useradmin.service2';
import { filter, take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { ApiService } from 'src/app/service/api/api.service';
import { UserService } from 'src/app/core/user.service';
import { roleTypeConstant } from 'src/app/shared/_models/role.constants';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private router: Router,
    private StorageSessionService: StorageSessionService,
    private userService: UserService,
    private optionalService: OptionalValuesService,
    private apiService: ApiService,
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
        if (this.hasRole(roleTypeConstant.WORKFLOW, res)) {
          this.router.navigateByUrl('End_User', { skipLocationChange: true });
        } else if (this.hasRole(roleTypeConstant.SYSTEM, res)) {
          this.router.navigateByUrl('System_Admin', { skipLocationChange: true });
        } else if (this.hasRole(roleTypeConstant.FINANCE, res)) {
          this.router.navigateByUrl('Cost', { skipLocationChange: true });
        } else if (this.hasRole(roleTypeConstant.ASSET, res)) {
          this.router.navigateByUrl('Assets', { skipLocationChange: true });
        } else if (this.hasRole(roleTypeConstant.ADMINISTRATOR, res)) {
          this.router.navigateByUrl('User_Admin', { skipLocationChange: true });
        } else {
          this.logout();
          this.toastr.info(this.userAdmin.controlVariables['noRole'], 'No Role');
        }
      }
    });
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

  hasRole(roleName: string, allroles: string[]): boolean {
    return !!(allroles && allroles.filter(role => role.includes(roleName)).length);
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
  //     }
  //   });

  //   this.userGroups$.subscribe(data => {
  //     if (data.length) {
  //     }
  //   });

  // }

}
