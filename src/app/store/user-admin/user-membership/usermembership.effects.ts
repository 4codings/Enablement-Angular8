import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userMemberShipActions from './usermembership.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userMemberShip } from './usermembership.model';
import { UserAdminService } from 'src/app/services/user-admin.service';

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
}
