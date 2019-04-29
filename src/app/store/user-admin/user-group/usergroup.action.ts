import { Action } from '@ngrx/store';
import { userGroup } from './usergroup.model';

export const GET_USER_GROUP = '[GROUP] User Group';
export const GET_USER_GROUP_SUCCESS = '[GROUP] User Group Success';
export const GET_USER_GROUP_FAIL = '[GROUP] User Group Fail';
export const ADD_USER_GROUP = '[GROUP] User Group Add';
export const ADD_USER_GROUP_SUCCESS = '[GROUP] User Group Add success';
export const ADD_USER_GROUP_FAIL = '[GROUP] User Group Add Fail';
export const UPDATE_USER_GROUP = '[GROUP] User Group Update';
export const UPDATE_USER_GROUP_SUCCESS = '[GROUP] User Group Update Success';
export const UPDATE_USER_GROUP_FAIL = '[GROUP] User Group Update Fail';
export const DELETE_USER_GROUP = '[GROUP] Delete Group';
export const DELETE_USER_GROUP_SUCCESS = '[GROUP] Delete Group Success';
export const DELETE_USER_GROUP_FAIL = '[GROUP] Delete Group Fail';
export const SELECT_USER_GROUP_RELATION = '[GROUP] Select User Group Relation';
export const REMOVE_SELECTED_USER_GROUP_RELATION = '[GROUP] Remove Selected User Group Relation';
export const CHECKED_USER_GROUP = '[GROUP] Checked User Group';
export const SELECT_GROUP_ID = '[GROUP] Select Group Id';
export const REMOVE_GROUP_ID = '[GROUP] Remove Group Id';
export const UPDATE_USER_IDS = '[GROUP] UPDATE User Ids';

export class getUserGroup implements Action {
  readonly type = GET_USER_GROUP;
  constructor(public payload: any) {
  }
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

  constructor(public payload: any) {
    //console.log("addgroup", payload)
  }
}

export class addUserGroupSuccess implements Action {
  readonly type = ADD_USER_GROUP_SUCCESS;
  constructor(public payload: any) {
    //console.log("addgroup success",payload[0]);
  }
}

export class addUserGroupFail implements Action {
  readonly type = ADD_USER_GROUP_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class UpdateUserGroup implements Action {
  readonly type = UPDATE_USER_GROUP;

  constructor(public payload: any) {
    //console.log("userGroup",payload);
  }
}

export class UpdateUserGroupSuccess implements Action {
  readonly type = UPDATE_USER_GROUP_SUCCESS;
  constructor(public payload: any) {
    //console.log("userGroup update",payload);
  }
}

export class UpdateUserGroupFail implements Action {
  readonly type = UPDATE_USER_GROUP_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class DeleteUserGroup implements Action {
  readonly type = DELETE_USER_GROUP;

  constructor(public payload: any) {
  }
}

export class DeleteUserGroupSuccess implements Action {
  readonly type = DELETE_USER_GROUP_SUCCESS;
  constructor(public res:any, public payload: any) {
  }
}

export class DeleteUserGroupFail implements Action {
  readonly type = DELETE_USER_GROUP_FAIL;

  constructor(public payload: string) {
    console.log('err', payload);
  }
}

export class SelectUserGroupRelation implements Action {
  readonly type = SELECT_USER_GROUP_RELATION;

  constructor(public payload: any) {
    //console.log('relation', payload);
  }
}

export class RemoveSelectedUserGroupRelation implements Action {
  readonly type = REMOVE_SELECTED_USER_GROUP_RELATION;

  constructor(public payload: any) {
    //console.log('remove relation', payload);
  }
}

export class CheckedUserGroup implements Action {
  readonly type = CHECKED_USER_GROUP;

  constructor(public payload: any) {
  }
}

export class selectGroupId implements Action {
  readonly type = SELECT_GROUP_ID;
  constructor(public payload: any) {
  }
}

export class RemoveGroupId implements Action {
  readonly type = REMOVE_GROUP_ID;
}

export class UpdateUserIds implements Action {
  readonly type = UPDATE_USER_IDS;

  constructor(public payload: any) {
  }
}

export type Actions = getUserGroup
| getUserGroupSuccess
| getUserGroupFail
| UpdateUserGroup
| UpdateUserGroupSuccess
| UpdateUserGroupFail
| addUserGroup
| addUserGroupSuccess
| addUserGroupFail
| DeleteUserGroup
| DeleteUserGroupSuccess
| DeleteUserGroupFail
| SelectUserGroupRelation
| RemoveSelectedUserGroupRelation
| CheckedUserGroup
| selectGroupId
| RemoveGroupId
| UpdateUserIds;
