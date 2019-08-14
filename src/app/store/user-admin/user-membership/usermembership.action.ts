import {Action} from '@ngrx/store';
import {userMemberShip} from './usermembership.model';

export const GET_USER_MEMBERSHIP = '[MEMBERSHIP] User membership';
export const GET_USER_MEMBERSHIP_SUCCESS = '[MEMBERSHIP] User membership Success';
export const GET_USER_MEMBERSHIP_FAIL = '[MEMBERSHIP] User membership Fail';
export const ADD_USER_MEMBERSHIP = '[MEMBERSHIP] User membership Add';
export const ADD_USER_MEMBERSHIP_SUCCESS = '[MEMBERSHIP] User membership Add Success';
export const ADD_USER_MEMBERSHIP_FAIL = '[MEMBERSHIP] User membership Add Fail';

export class getUserMembership implements Action {
  readonly type = GET_USER_MEMBERSHIP;
}

export class getUserMembershipSuccess implements Action {
  readonly type = GET_USER_MEMBERSHIP_SUCCESS;

  constructor(public payload: userMemberShip[]) {
  }
}

export class getUserMembershipFail implements Action {
  readonly type = GET_USER_MEMBERSHIP_FAIL;

  constructor(public payload: string) {
  }
}

export class addUserMembership implements Action {
  readonly type = ADD_USER_MEMBERSHIP;

  constructor(public payload: any) {

  }
}

export class addUserMembershipSuccess implements Action {
  readonly type = ADD_USER_MEMBERSHIP_SUCCESS;

  constructor(public payload: any) {

  }
}

export class addUserMembershipFail implements Action {
  readonly type = ADD_USER_MEMBERSHIP_FAIL;

  constructor(public payload: string) {
  }
}

export type Actions = getUserMembership
  | getUserMembershipSuccess
  | getUserMembershipFail
  | addUserMembership
  | addUserMembershipSuccess
  | addUserMembershipFail;
