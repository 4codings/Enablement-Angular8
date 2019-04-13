import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as authActions from './authorization.actions' 
import { mergeMap, map, catchError } from 'rxjs/operators';
import { AuthorizationData } from './authorization.model';
import { UserAdminService } from 'src/app/services/user-admin.service';

@Injectable()
export class AuthEffects {
      
    constructor(private actions$:Actions, private userAdminService:UserAdminService) {}

    @Effect({dispatch:true})
    getAuthData$: Observable<Action> = this.actions$.pipe(
    ofType<authActions.getAuth>(
        authActions.GET_AUTH
    ),
    mergeMap((action: authActions.getAuth) =>
      this.userAdminService.getAuthorizationData().pipe(
        map(
          (userAuth: AuthorizationData[]) =>
            new authActions.getAuthSuccess(userAuth)
        ),
        catchError(err => of(new authActions.getAuthFail(err.error)))
      )
    )
    );

}