import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { AuthorizationData } from 'src/app/store/user-admin/user-authorization/authorization.model';
import { Observable } from 'rxjs';
import * as userAuthorizationSelectors from "../../../store/user-admin/user-authorization/authorization.selectors";
import * as userAuthorizationpActions from "../../../store/user-admin/user-authorization/authorization.actions";

@Component({
  selector: 'app-authorizerole',
  templateUrl: './authorizerole.component.html',
  styleUrls: ['./authorizerole.component.scss']
})
export class AuthorizeroleComponent implements OnInit {
  Label:any[] = [];
  authData$:Observable<AuthorizationData[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser:string;

  constructor(public noAuthData: NoAuthDataService, private store:Store<AppState>) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });

    this.store.dispatch(new userAuthorizationpActions.getAuth());
    this.authData$ = this.store.pipe(select(userAuthorizationSelectors.selectAllAutorizationvalues));
    this.error$ = this.store.pipe(select(userAuthorizationSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userAuthorizationSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userAuthorizationSelectors.getLoaded));
  }

}