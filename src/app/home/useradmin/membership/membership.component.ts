import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { userMemberShip } from 'src/app/store/user-admin/user-membership/usermembership.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as userMemberShipSelectors from "../../../store/user-admin/user-membership/usermembership.selectors";
import * as userMemberShipActions from "../../../store/user-admin/user-membership/usermembership.action";

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  Label: any[] = [];
  userMemberShips$:Observable<userMemberShip[]>;
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
    this.store.dispatch(new userMemberShipActions.getUserMembership());
    this.userMemberShips$ = this.store.pipe(select(userMemberShipSelectors.selectAllUserMemberShips));
    this.error$ = this.store.pipe(select(userMemberShipSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userMemberShipSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userMemberShipSelectors.getLoaded));
  }

}
