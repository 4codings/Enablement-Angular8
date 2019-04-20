import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { User } from './user.model';

export const GET_USER = '[User] User';
export const GET_USER_SUCCESS = '[User] User Success';
export const GET_USER_FAIL = '[User] User Fail';
export const ADD_USER = '[User] Add User';
export const UPDATE_USER = '[User] Update User';
export const ACTION_SUCCESS = '[User] Action Success';
export const ACTION_ERROR = '[User] Action Error';

export class getUser implements Action {
  readonly type = GET_USER;
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

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: any) {
  }
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

export type Actions = getUser
| getUserSuccess
| AddUser
| ActionError
| UpdateUser
| ActionSuccess
| getUserFail;
