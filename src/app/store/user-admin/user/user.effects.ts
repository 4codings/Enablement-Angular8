import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userActions from './user.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { User } from './user.model';
import { AuthService } from '../../../services/auth.service';
import { UserAdminService } from '../../../services/user-admin.service';
import * as userGroupActions from '../user-group/usergroup.action';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserEffects {
  public domain_name = environment.domainName;
  constructor(private actions$: Actions, private useradmin: UserAdminService,
              private http: HttpClient) {}

  @Effect({ dispatch: true })
  getUsers$: Observable<Action> = this.actions$.pipe(
    ofType<userActions.getUser>(userActions.GET_USER),
    mergeMap((action: userActions.getUser) =>
      this.http.get('https://'+this.domain_name+'/rest/v1/securedJSON?V_CD_TYP=USER&V_SRC_CD='
        + action.payload.V_SRC_CD + '&REST_Service=Masters&Verb=GET')
        .pipe(
          map((user: User[]) => new userActions.getUserSuccess(user)),
            catchError(err => of(new userActions.getUserFail(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  addUser: Observable<Action> = this.actions$.pipe(
    ofType<userActions.AddUser>(userActions.ADD_USER),
    mergeMap((action: userActions.AddUser) =>
      this.http.post('https://'+this.domain_name+'/rest/User/AddAndSendEmail', action.payload)
        .pipe(map((res) => new userActions.AddUserSuccess(res)),
        catchError(err => of(new userActions.AddUserFail(err.error))))
    )
  );

  @Effect({ dispatch: true })
  updateUser: Observable<Action> = this.actions$.pipe(
    ofType<userActions.UpdateUser>(userActions.UPDATE_USER),
    mergeMap((action: userActions.UpdateUser) =>
      this.http.patch('https://'+this.domain_name+'/rest/v1/securedJSON', action.payload)
        .pipe(
          map((res) => new userActions.UpdateUserSuccess(action.payload)),
            catchError(err => of(new userActions.UpdateUserFail(err.error)))
        )
    )
  );
}
