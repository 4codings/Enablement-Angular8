import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userRoleActions from './userrole.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userRole } from './userrole.model';
import { UserAdminService } from 'src/app/services/user-admin.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserRoleEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService,
              private http: HttpClient) {}

  @Effect({ dispatch: true })
  getUsersRoles$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.getUserRole>(userRoleActions.GET_USER_ROLE),
    mergeMap((action: userRoleActions.getUserRole) =>
      this.useradmin.getUserRoles().pipe(
        map(
          (userrole: userRole[]) => new userRoleActions.getUserRoleSuccess(userrole)
        ),
        catchError(err => of(new userRoleActions.getUserRoleFail(err.error)))
      )
    )
  );

  @Effect({ dispatch: true })
  addUserRole: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.AddUserRole>(userRoleActions.ADD_USER_ROLE),
    mergeMap((action: userRoleActions.AddUserRole) =>
      this.http.post('https://enablement.us/Enablement/rest/E_DB/SP', action.payload)
        .pipe(
          map(
            () => new userRoleActions.ActionSuccess()
          ),
          catchError(err => of(new userRoleActions.ActionError(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  updateUserRole: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.UpdateUserRole>(userRoleActions.UPDATE_USER_ROLE),
    mergeMap((action: userRoleActions.UpdateUserRole) =>
      this.http.patch('https://enablement.us/Enablement/rest/E_DB/SP', action.payload)
        .pipe(
          map(
            () => new userRoleActions.ActionSuccess()
          ),
          catchError(err => of(new userRoleActions.ActionError(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  deleteUserRole: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.DeleteUserRole>(userRoleActions.DELETE_USER_ROLE),
    mergeMap((action: userRoleActions.DeleteUserRole) =>
      this.http.delete('https://enablement.us/Enablement/rest/E_DB/SP?V_ROLE_CD='
        + action.payload.V_ROLE_CD + '&V_SRC_CD=' + action.payload.V_SRC_CD + '&REST_Service=Role&Verb=DELETE')
        .pipe(
          map(
            () => new userRoleActions.ActionSuccess()
          ),
          catchError(err => of(new userRoleActions.ActionError(err.error)))
        )
    )
  );
}
