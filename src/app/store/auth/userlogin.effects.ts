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
        catchError(err => of(new userLoginActions.userLoginFail('invalid-pwd')))
      )
    )
  );

  @Effect({ dispatch: true })
  UserSignUp$: Observable<Action> = this.actions$.pipe(
    ofType<userLoginActions.userSignUp>(userLoginActions.USER_SIGN_UP),
    mergeMap((action: userLoginActions.userSignUp) =>
      this.auth.userSignUp(action.payload).pipe(
        map((user: any) => new userLoginActions.userSignUpSuccess(user)),
        catchError(err => of(new userLoginActions.userSignUpFail(err.error)))
      )
    )
  );

  @Effect({ dispatch: true })
  ChangePassword$: Observable<Action> = this.actions$.pipe(
    ofType<userLoginActions.changePassword>(userLoginActions.CHANGE_PASSWORD),
    mergeMap((action: userLoginActions.changePassword) =>
      this.auth.changePassword(action.payload).pipe(
        map((res: any) => new userLoginActions.changePasswordSuccess(res)),
        catchError(err => of(new userLoginActions.changePasswordFail(err.error)))
      )
    )
  );
}
