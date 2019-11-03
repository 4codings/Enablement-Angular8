import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userRoleActions from './userrole.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userRole } from './userrole.model';
import { UserAdminService } from '../../../services/user-admin.service';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserRoleEffects {
  public domain_name = environment.domainName;
  constructor(private actions$: Actions, private useradmin: UserAdminService,
              private http: HttpClient) {}

  @Effect({dispatch: true})
  getUsersRoles$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.getUserRole>(userRoleActions.GET_USER_ROLE),
    mergeMap((action: userRoleActions.getUserRole) =>
      this.http.get('https://'+this.domain_name+'/rest/v1/securedJSON?V_CD_TYP=ROLE&V_SRC_CD='
        + action.payload.V_SRC_CD + '&REST_Service=Masters&Verb=GET')
        .pipe(
          map(
            (userrole: userRole[]) => new userRoleActions.getUserRoleSuccess(userrole)
          ),
          catchError(err => of(new userRoleActions.getUserRoleFail(err.error)))
        )
    )
  );

  @Effect({dispatch: true})
  addUserRole$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.AddUserRole>(userRoleActions.ADD_USER_ROLE),
    mergeMap((action: userRoleActions.AddUserRole) =>
      this.http.post('https://'+this.domain_name+'/rest/v1/securedJSON', action.payload)
        .pipe(
          map(
            (res) => new userRoleActions.AddUserRoleSuccess(res)
          ),
          catchError(err => of(new userRoleActions.AddUserRoleFail(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  updateUserRole$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.UpdateUserRole>(userRoleActions.UPDATE_USER_ROLE),
    mergeMap((action: userRoleActions.UpdateUserRole) =>
      this.http.patch('https://'+this.domain_name+'/rest/v1/securedJSON', action.payload)
        .pipe(
          map(
            (res) => new userRoleActions.UpdateUserRoleSuccess(action.payload)
          ),
          catchError(err => of(new userRoleActions.UpdateUserRoleFail(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  deleteUserRole$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.DeleteUserRole>(userRoleActions.DELETE_USER_ROLE),
    mergeMap((action: userRoleActions.DeleteUserRole) =>
      this.http.get('https://'+this.domain_name+'/rest/v1/securedJSON?V_ROLE_CD='
      + action.payload.V_ROLE_CD + '&V_SRC_CD=' + action.payload.V_SRC_CD + '&REST_Service=Role&Verb=DELETE', action.payload)
        .pipe(
          map(
            (res) => new userRoleActions.DeleteUserRoleSuccess(res,action.payload)
          ),
          catchError(err => of(new userRoleActions.DeleteUserRoleFail(err.error)))
        )
    )
  );
}
