import { Injectable } from "@angular/core";
import { Effect, ofType, Actions } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import * as userActions from "./user.action";
import { mergeMap, map, catchError } from "rxjs/operators";
import { User } from "./user.model";
import { AuthService } from "src/app/services/auth.service";
import { UserAdminService } from "src/app/services/user-admin.service";

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService) {}

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
}
