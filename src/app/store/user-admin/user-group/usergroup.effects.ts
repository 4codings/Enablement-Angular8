import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as userGroupActions from './usergroup.action' 
import { mergeMap, map, catchError } from 'rxjs/operators';
import { userGroup } from './usergroup.model';
import { UserAdminService } from 'src/app/services/user-admin.service';

@Injectable()
export class UserGroupEffects {
      
    constructor(private actions$:Actions, private useradmin:UserAdminService) {}

    @Effect({dispatch:true})
    getUsersGroup$: Observable<Action> = this.actions$.pipe(
    ofType<userGroupActions.getUserGroup>(
        userGroupActions.GET_USER_GROUP
    ),
    mergeMap((action: userGroupActions.getUserGroup) =>
      this.useradmin.getUserGroups().pipe(
        map(
          (user: userGroup[]) =>
            new userGroupActions.getUserGroupSuccess(user)
        ),
        catchError(err => of(new userGroupActions.getUserGroupFail(err.error)))
      )
    )
  );

}