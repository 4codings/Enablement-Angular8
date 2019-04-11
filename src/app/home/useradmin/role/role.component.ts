import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { Observable } from 'rxjs';
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from "../../../store/user-admin/user-role/userrole.selectors";
import * as userRoleActions from "../../../store/user-admin/user-role/userrole.action";
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  Label: any[] = [];
  userRoles$:Observable<userRole[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;

  constructor(
    public noAuthData: NoAuthDataService,
    private store:Store<AppState>
  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    this.store.dispatch(new userRoleActions.getUserRole());
    this.userRoles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));
  }

}
