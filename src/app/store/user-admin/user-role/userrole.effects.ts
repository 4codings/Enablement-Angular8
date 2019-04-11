import { Injectable } from "@angular/core";
import { Effect, ofType, Actions } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import * as userRoleActions from "./userrole.action";
import { mergeMap, map, catchError } from "rxjs/operators";
import { userRole } from "./userrole.model";
import { UserAdminService } from "src/app/services/user-admin.service";

@Injectable()
export class UserRoleEffects {
  constructor(private actions$: Actions, private useradmin: UserAdminService) {}

  @Effect({ dispatch: true })
  getUsersRoles$: Observable<Action> = this.actions$.pipe(
    ofType<userRoleActions.getUserRole>(userRoleActions.GET_USER_ROLE),
    mergeMap((action: userRoleActions.getUserRole) =>
      this.useradmin.getUserRoles().pipe(
        map(
          (userRole: userRole[]) => new userRoleActions.getUserRoleSuccess(userRole)
        ),
        catchError(err => of(new userRoleActions.getUserRoleFail(err.error)))
      )
    )
  );
}
