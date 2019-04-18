import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userLoginActions from './userlogin.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { userInfo } from './userinfo.model';

@Injectable()
export class UserLoginEffects {
  constructor(private actions$: Actions, private auth: AuthService) {}

  @Effect({ dispatch: true })
  UserLogin$: Observable<Action> = this.actions$.pipe(
    ofType<userLoginActions.userLogin>(userLoginActions.USER_LOGIN),
    mergeMap((action: userLoginActions.userLogin) =>
      this.auth.userLogin(action.payload).pipe(
        map((user: userInfo) => new userLoginActions.userLoginSuccess(user)),
        catchError(err => of(new userLoginActions.userLoginFail(err.error)))
      )
    )
  );
}
