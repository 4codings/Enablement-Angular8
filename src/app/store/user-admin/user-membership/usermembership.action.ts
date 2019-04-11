import { Action } from "@ngrx/store";
import { userMemberShip } from "./usermembership.model";

export const GET_USER_MEMBERSHIP = "[MEMBERSHIP] User membership";
export const GET_USER_MEMBERSHIP_SUCCESS = "[MEMBERSHIP] User membership Success";
export const GET_USER_MEMBERSHIP_FAIL = "[MEMBERSHIP] User membership Fail";

export class getUserMembership implements Action {
  readonly type = GET_USER_MEMBERSHIP;
}

export class getUserMembershipSuccess implements Action {
  readonly type = GET_USER_MEMBERSHIP_SUCCESS;
  constructor(public payload: userMemberShip[]) {
    console.log("member", payload);
  }
}

export class getUserMembershipFail implements Action {
  readonly type = GET_USER_MEMBERSHIP_FAIL;

  constructor(public payload: string) {
    console.log("err", payload);
  }
}

export type Actions = getUserMembership 
| getUserMembershipSuccess 
| getUserMembershipFail;
