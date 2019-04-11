import { Action } from "@ngrx/store";
import { userGroup } from "./usergroup.model";

export const GET_USER_GROUP = "[GROUP] User Group";
export const GET_USER_GROUP_SUCCESS = "[GROUP] User Group Success";
export const GET_USER_GROUP_FAIL = "[GROUP] User Group Fail";

export class getUserGroup implements Action {
  readonly type = GET_USER_GROUP;
}

export class getUserGroupSuccess implements Action {
  readonly type = GET_USER_GROUP_SUCCESS;
  constructor(public payload: userGroup[]) {
    console.log("userGroup",payload);
  }
}

export class getUserGroupFail implements Action {
  readonly type = GET_USER_GROUP_FAIL;

  constructor(public payload: string) {
    console.log("err", payload);
  }
}

export type Actions = getUserGroup 
| getUserGroupSuccess 
| getUserGroupFail;
