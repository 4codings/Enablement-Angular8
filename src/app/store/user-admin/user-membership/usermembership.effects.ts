import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userMemberShipActions from './usermembership.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userMemberShip } from './usermembership.model';
import { UserAdminService } from 'src/app/services/user-admin.service';
import {UseradminService} from '../../../services/useradmin.service2';

@Injectable()
export class UserMembershipEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService) {}

  @Effect({ dispatch: true })
  getUsersMemberShip$: Observable<Action> = this.actions$.pipe(
    ofType<userMemberShipActions.getUserMembership>(userMemberShipActions.GET_USER_MEMBERSHIP),
    mergeMap((action: userMemberShipActions.getUserMembership) =>
      this.useradmin.getUserMemberShip().pipe(
        map(
          (userRole: userMemberShip[]) => new userMemberShipActions.getUserMembershipSuccess(userRole)
        ),
        catchError(err => of(new userMemberShipActions.getUserMembershipFail(err.error)))
      )
    )
  );

  @Effect({ dispatch: true })
  addUsersMemberShip$: Observable<Action> = this.actions$.pipe(
    ofType<userMemberShipActions.addUserMembership>(userMemberShipActions.ADD_USER_MEMBERSHIP),
    mergeMap((action: userMemberShipActions.addUserMembership) =>
      this.useradmin.postSecuredJSON(action.payload).pipe(map(
          (result: any) => new userMemberShipActions.addUserMembershipSuccess(result)
        ),
        catchError(err => of(new userMemberShipActions.addUserMembershipFail(err.error)))
      )
    )
  );

}
