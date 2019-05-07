import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { AuthorizationData } from './authorization.model';

export const GET_AUTH = '[AUTH] Auth Data';
export const GET_AUTH_SUCCESS = '[AUTH] Auth Data Success';
export const GET_AUTH_FAIL = '[AUTH] Auth Data Fail';
export const SELECT_ROLE_AUTH_RELATION = '[AUTH] Select Role Auth Relation';
export const REMOVE_SELECTED_ROLE_AUTH_RELATION = '[AUTH] Remove Selected Role Auth Relation';
export const CHECKED_AUTH_ROLE = '[AUTH] Checked Auth Role';
export const SELECT_AUTH_ID = '[AUTH] Select Auth Id';
export const REMOVE_AUTH_ID = '[AUTH] Remove Auth Id';
export const UPDATE_AUTH_IDS = '[AUTH] Update Auth Ids';

export class getAuth implements Action {
    readonly type = GET_AUTH;
    constructor(public payload: any) {}
}

export class getAuthSuccess implements Action {
    readonly type = GET_AUTH_SUCCESS;
    constructor(public payload: AuthorizationData[]) {
      //console.log('authorization', payload);
    }
}

export class getAuthFail implements Action {
    readonly type = GET_AUTH_FAIL;

    constructor(public payload: string) {}
}

export class SelectRoleAuthRelation implements Action {
    readonly type = SELECT_ROLE_AUTH_RELATION;
  
    constructor(public payload: any) {
      //console.log('relation', payload);
    }
  }
  
  export class RemoveSelectedRoleAuthRelation implements Action {
    readonly type = REMOVE_SELECTED_ROLE_AUTH_RELATION;
  
    constructor(public payload: any) {
      //console.log('remove relation', payload);
    }
  }
  
  export class CheckedRoleAuth implements Action {
    readonly type = CHECKED_AUTH_ROLE;
  
    constructor(public payload: any) {
    }
  }
  
  export class selectAuthId implements Action {
    readonly type = SELECT_AUTH_ID;
    constructor(public payload: any) {
    }
  }
  
  export class RemoveAuthId implements Action {
    readonly type = REMOVE_AUTH_ID;
  }
  
  export class UpdateAuthIds implements Action {
    readonly type = UPDATE_AUTH_IDS;
  
    constructor(public payload: any) {}
  }
  

export type Actions = getAuth
| getAuthSuccess
| getAuthFail
| SelectRoleAuthRelation
| RemoveSelectedRoleAuthRelation
| CheckedRoleAuth
| selectAuthId
| RemoveAuthId
| UpdateAuthIds;
