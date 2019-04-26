import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User } from './user.model';

export const GET_USER = '[User] User';
export const GET_USER_SUCCESS = '[User] User Success';
export const GET_USER_FAIL = '[User] User Fail';
export const ADD_USER = '[User] Add User';
export const ADD_USER_SUCCESS = '[User] Add User Success';
export const ADD_USER_FAIL = '[User] Add User Fail';
export const UPDATE_USER = '[User] Update User';
export const UPDATE_USER_SUCCESS = '[User] Update User Success';
export const UPDATE_USER_FAIL = '[User] Update User Fail';
export const SELECT_USER_GROUP_RELATION = '[USER] Select User Group Relation';
export const REMOVE_SELECTED_USER_GROUP_RELATION = '[USER] Remove Selected User Group Relation';
export const CHECKED_USER_GROUP = '[USER] Checked User Group';
export const SELECT_USER_ID = '[User] Select User Id';
export const REMOVE_USER_ID = '[User] Remove User Id';
export const UPDATE_USER_GROUP_IDS = '[User] Update User Group Ids';

export class getUser implements Action {
  readonly type = GET_USER;
  constructor(public payload: any) {
  }
}

export class getUserSuccess implements Action {
  readonly type = GET_USER_SUCCESS;
  constructor(public payload: User[]) {
  }
}

export class getUserFail implements Action {
  readonly type = GET_USER_FAIL;

  constructor(public payload: string) {}
}

export class AddUser implements Action {
  readonly type = ADD_USER;
  constructor(public payload: any) {
  }
}

export class AddUserSuccess implements Action {
  readonly type = ADD_USER_SUCCESS;
  constructor(public payload: any) {
  }
}

export class AddUserFail implements Action {
  readonly type = ADD_USER_FAIL;
  constructor(public payload: any) {
  }
}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: any) {
  }
}

export class UpdateUserSuccess implements Action {
  readonly type = UPDATE_USER_SUCCESS;
  constructor(public payload: any) {
  }
}

export class UpdateUserFail implements Action {
  readonly type = UPDATE_USER_FAIL;
  constructor(public payload: any) {
  }
}

export class selectUserId implements Action {
  readonly type = SELECT_USER_ID;
  constructor(public payload: any) {
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

export class RemoveUserId implements Action {
  readonly type = REMOVE_USER_ID;
}

export class UpdateUserGroupIds implements Action {
  readonly type = UPDATE_USER_GROUP_IDS;

  constructor(public payload:any) {}
}


export type Actions = getUser
| getUserSuccess
| getUserFail
| AddUser
| AddUserSuccess
| AddUserFail
| UpdateUser
| UpdateUserSuccess
| UpdateUserFail
| SelectUserGroupRelation
| RemoveSelectedUserGroupRelation
| CheckedUserGroup
| selectUserId
| RemoveUserId
| UpdateUserGroupIds;
