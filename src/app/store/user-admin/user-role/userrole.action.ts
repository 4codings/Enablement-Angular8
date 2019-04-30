import { Action } from '@ngrx/store';
import { userRole } from './userrole.model';

export const GET_USER_ROLE = '[ROLE] User Role';
export const GET_USER_ROLE_SUCCESS = '[ROLE] User Role Success';
export const GET_USER_ROLE_FAIL = '[ROLE] User Role Fail';
export const ADD_USER_ROLE = '[ROLE] User Role Add';
export const ADD_USER_ROLE_SUCCESS = '[ROLE] User Role Add Success';
export const ADD_USER_ROLE_FAIL = '[ROLE] User Role Add Fail';
export const UPDATE_USER_ROLE = '[ROLE] User Role Update';
export const UPDATE_USER_ROLE_SUCCESS = '[ROLE] User Role Update Success';
export const UPDATE_USER_ROLE_FAIL = '[ROLE] User Role Update Fail';
export const DELETE_USER_ROLE = '[ROLE] User Role Delete';
export const DELETE_USER_ROLE_SUCCESS = '[ROLE] User Role Delete Success';
export const DELETE_USER_ROLE_FAIL = '[ROLE] User Role Delete Fail';
export const SELECT_ROLE_GROUP_RELATION = '[ROLE] Select Role Group Relation';
export const REMOVE_SELECTED_ROLE_GROUP_RELATION = '[ROLE] Remove Selected Role Group Relation';
export const CHECKED_ROLE_GROUP = '[ROLE] Checked Role Group';
export const SELECT_ROLE_ID = '[ROLE] Select Role Id';
export const REMOVE_ROLE_ID = '[ROLE] Remove Role Id';
export const UPDATE_GROUP_IDS = '[ROLE] Update Group Ids';

export class getUserRole implements Action {
  readonly type = GET_USER_ROLE;
  constructor(public payload: any) {
    //console.log(this.payload);
  }
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
    //console.log('err', payload);
  }
}

export class AddUserRole implements Action {
  readonly type = ADD_USER_ROLE;

  constructor(public payload: any) {}
}

export class AddUserRoleSuccess implements Action {
  readonly type = ADD_USER_ROLE_SUCCESS;
  constructor(public payload: any) {
    // console.log("roles", payload);
  }
}

export class AddUserRoleFail implements Action {
  readonly type = ADD_USER_ROLE_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class UpdateUserRole implements Action {
  readonly type = UPDATE_USER_ROLE;

  constructor(public payload: any) {}
}

export class UpdateUserRoleSuccess implements Action {
  readonly type = UPDATE_USER_ROLE_SUCCESS;
  constructor(public payload: any) {
    // console.log("roles", payload);
  }
}

export class UpdateUserRoleFail implements Action {
  readonly type = UPDATE_USER_ROLE_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class DeleteUserRole implements Action {
  readonly type = DELETE_USER_ROLE;

  constructor(public payload: any) {
  }
}

export class DeleteUserRoleSuccess implements Action {
  readonly type = DELETE_USER_ROLE_SUCCESS;
  constructor(public res:any, public payload: any) {
    // console.log("roles", payload);
  }
}

export class DeleteUserRoleFail implements Action {
  readonly type = DELETE_USER_ROLE_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class SelectRoleGroupRelation implements Action {
  readonly type = SELECT_ROLE_GROUP_RELATION;

  constructor(public payload: any) {
    //console.log('relation', payload);
  }
}

export class RemoveSelectedRoleGroupRelation implements Action {
  readonly type = REMOVE_SELECTED_ROLE_GROUP_RELATION;

  constructor(public payload: any) {
    //console.log('remove relation', payload);
  }
}

export class CheckedRoleGroup implements Action {
  readonly type = CHECKED_ROLE_GROUP;

  constructor(public payload: any) {
  }
}

export class selectRoleId implements Action {
  readonly type = SELECT_ROLE_ID;
  constructor(public payload: any) {
  }
}

export class RemoveRoleId implements Action {
  readonly type = REMOVE_ROLE_ID;
}

export class UpdateGroupIds implements Action {
  readonly type = UPDATE_GROUP_IDS;

  constructor(public payload: any) {}
}


export type Actions = getUserRole
| getUserRoleSuccess
| getUserRoleFail
| UpdateUserRole
| UpdateUserRoleSuccess
| UpdateUserRoleFail
| DeleteUserRole
| DeleteUserRoleSuccess
| DeleteUserRoleFail
| AddUserRole
| AddUserRoleSuccess
| AddUserRoleFail
| SelectRoleGroupRelation
| RemoveSelectedRoleGroupRelation
| CheckedRoleGroup
| selectRoleId
| RemoveRoleId
| UpdateGroupIds;
