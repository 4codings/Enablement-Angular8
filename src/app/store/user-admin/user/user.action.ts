import { Injectable } from '@angular/core'
import { Action } from '@ngrx/store'
import { User } from './user.model';

export const GET_USER = '[User] User';
export const GET_USER_SUCCESS = '[User] User Success';
export const GET_USER_FAIL = '[User] User Fail';

export class getUser implements Action {
    readonly type = GET_USER
}

export class getUserSuccess implements Action {
    readonly type = GET_USER_SUCCESS
    constructor(public payload: User[]) {
        console.log(payload);
    }
}

export class getUserFail implements Action {
    readonly type = GET_USER_FAIL

    constructor(public payload: string) {}
}

export type Actions = getUser 
| getUserSuccess
| getUserFail

