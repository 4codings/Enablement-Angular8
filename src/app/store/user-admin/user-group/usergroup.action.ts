import { Action } from '@ngrx/store';
import { userGroup } from './usergroup.model';

export const GET_USER_GROUP = '[GROUP] User Group';
export const GET_USER_GROUP_SUCCESS = '[GROUP] User Group Success';
export const GET_USER_GROUP_FAIL = '[GROUP] User Group Fail';
export const ADD_USER_GROUP = '[GROUP] User Group Add';
export const UPDATE_USER_GROUP = '[GROUP] User Group Update';
export const DELETE_USER_GROUP = '[GROUP] Delete Group';
export const ACTION_SUCCESS = '[GROUP] Action Success';
export const ACTION_ERROR = '[GROUP] Action Error';

export class getUserGroup implements Action {
  readonly type = GET_USER_GROUP;
}

export class getUserGroupSuccess implements Action {
  readonly type = GET_USER_GROUP_SUCCESS;
  constructor(public payload: userGroup[]) {
    // console.log("userGroup",payload);
  }
}

export class getUserGroupFail implements Action {
  readonly type = GET_USER_GROUP_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class addUserGroup implements Action {
  readonly type = ADD_USER_GROUP;

  constructor(public payload: any) {}
}

export class UpdateUserGroup implements Action {
  readonly type = UPDATE_USER_GROUP;

  constructor(public payload: any) {}
}

export class DeleteUserGroup implements Action {
  readonly type = DELETE_USER_GROUP;

  constructor(public payload: any) {}
}

export class ActionSuccess implements Action {
  readonly type = ACTION_SUCCESS;
}

export class ActionError implements Action {
  readonly type = ACTION_ERROR;
  constructor(msg: string) {
    console.log(msg);
  }
}

export type Actions = getUserGroup
| getUserGroupSuccess
| getUserGroupFail
| ActionSuccess
| ActionError
| UpdateUserGroup
| addUserGroup
| DeleteUserGroup;
