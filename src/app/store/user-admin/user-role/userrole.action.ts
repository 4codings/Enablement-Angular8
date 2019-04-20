import { Action } from '@ngrx/store';
import { userRole } from './userrole.model';

export const GET_USER_ROLE = '[ROLE] User Role';
export const GET_USER_ROLE_SUCCESS = '[ROLE] User Role Success';
export const GET_USER_ROLE_FAIL = '[ROLE] User Role Fail';
export const ADD_USER_ROLE = '[ROLE] User Role Add';
export const UPDATE_USER_ROLE = '[ROLE] User Role Update';
export const DELETE_USER_ROLE = '[ROLE] User Role Delete';
export const ACTION_SUCCESS = '[GROUP] Action Success';
export const ACTION_ERROR = '[GROUP] Action Error';

export class getUserRole implements Action {
  readonly type = GET_USER_ROLE;
}

export class getUserRoleSuccess implements Action {
  readonly type = GET_USER_ROLE_SUCCESS;
  constructor(public payload: userRole[]) {
    // console.log("roles", payload);
  }
}

export class getUserRoleFail implements Action {
  readonly type = GET_USER_ROLE_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class AddUserRole implements Action {
  readonly type = ADD_USER_ROLE;

  constructor(public payload: any) {}
}

export class UpdateUserRole implements Action {
  readonly type = UPDATE_USER_ROLE;

  constructor(public payload: any) {}
}

export class DeleteUserRole implements Action {
  readonly type = DELETE_USER_ROLE;

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

export type Actions = getUserRole
| getUserRoleSuccess
| getUserRoleFail
| DeleteUserRole
| ActionError
| ActionSuccess
| AddUserRole;
