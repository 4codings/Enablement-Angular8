import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { AuthorizationData } from './authorization.model';

export const GET_AUTH = '[AUTH] Auth Data';
export const GET_AUTH_SUCCESS = '[User] Auth Data Success';
export const GET_AUTH_FAIL = '[User] Auth Data Fail';

export class getAuth implements Action {
    readonly type = GET_AUTH;
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

export type Actions = getAuth
| getAuthSuccess
| getAuthFail;
