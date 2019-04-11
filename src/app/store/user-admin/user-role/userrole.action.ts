import { Action } from "@ngrx/store";
import { userRole } from "./userrole.model";

export const GET_USER_ROLE = "[ROLE] User Role";
export const GET_USER_ROLE_SUCCESS = "[ROLE] User Role Success";
export const GET_USER_ROLE_FAIL = "[ROLE] User Role Fail";

export class getUserRole implements Action {
  readonly type = GET_USER_ROLE;
}

export class getUserRoleSuccess implements Action {
  readonly type = GET_USER_ROLE_SUCCESS;
  constructor(public payload: userRole[]) {
    console.log("roles", payload);
  }
}

export class getUserRoleFail implements Action {
  readonly type = GET_USER_ROLE_FAIL;

  constructor(public payload: string) {
    console.log("err", payload);
  }
}

export type Actions = getUserRole 
| getUserRoleSuccess 
| getUserRoleFail;
