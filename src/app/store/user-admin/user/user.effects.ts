import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userActions from './user.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { User } from './user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserAdminService } from 'src/app/services/user-admin.service';
import * as userGroupActions from '../user-group/usergroup.action';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService,
              private http: HttpClient) {}

  @Effect({ dispatch: true })
  getUsers$: Observable<Action> = this.actions$.pipe(
    ofType<userActions.getUser>(userActions.GET_USER),
    mergeMap((action: userActions.getUser) =>
      this.useradmin.getUsers().pipe(
        map((user: User[]) => new userActions.getUserSuccess(user)),
        catchError(err => of(new userActions.getUserFail(err.error)))
      )
    )
  );

  @Effect({ dispatch: true })
  addUser: Observable<Action> = this.actions$.pipe(
    ofType<userActions.AddUser>(userActions.ADD_USER),
    mergeMap((action: userActions.AddUser) =>
      this.http.post('https://enablement.us/Enablement/rest/User/AddAndSendEmail', action.payload)
        .pipe(
          map(
            () => new userActions.ActionSuccess()
          ),
          catchError(err => of(new userActions.ActionError(err.error)))
        )
    )
  );

  @Effect({ dispatch: true })
  updateUser: Observable<Action> = this.actions$.pipe(
    ofType<userActions.UpdateUser>(userActions.UPDATE_USER),
    mergeMap((action: userActions.UpdateUser) =>
      this.http.patch('https://enablement.us/Enablement/rest/E_DB/SP', action.payload)
        .pipe(
          map(
            () => new userActions.ActionSuccess()
          ),
          catchError(err => of(new userActions.ActionError(err.error)))
        )
    )
  );
}
