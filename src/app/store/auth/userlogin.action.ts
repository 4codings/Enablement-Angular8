import { Action } from '@ngrx/store';
import { userInfo } from './userinfo.model';

export const USER_LOGIN = 'User login';
export const USER_LOGIN_SUCCESS = 'User login Success';
export const USER_LOGIN_FAIL = 'User login Fail';
export const USER_SIGN_UP = 'User Sign Up';
export const USER_SIGNUP_SUCCESS = 'User Sign Up Success';
export const USER_SIGNUP_FAIL = 'User Sign UP Fail';
export const CHANGE_PASSWORD = 'Change Password';
export const CHANGE_PASSWORD_SUCCESS = 'Change Password Success';
export const CHANGE_PASSWORD_FAIL = 'Change Password Fail';
export const CLEAR_USER_INFO = 'Clear user info';
export const RESET_COUNT = 'Reset Count';

export class userLogin implements Action {
  readonly type = USER_LOGIN;
  constructor(public payload: any) {
  }
}

export class userLoginSuccess implements Action {
  readonly type = USER_LOGIN_SUCCESS;
  constructor(public payload: userInfo) {
  }
}

export class userLoginFail implements Action {
  readonly type = USER_LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class userSignUp implements Action {
  readonly type = USER_SIGN_UP;
  constructor(public payload: any) {
  }
}

export class userSignUpSuccess implements Action {
  readonly type = USER_SIGNUP_SUCCESS;
  constructor(public payload: any) {
  }
}

export class userSignUpFail implements Action {
  readonly type = USER_SIGNUP_FAIL;
  constructor(public payload: any) {
  }
}

export class changePassword implements Action {
  readonly type = CHANGE_PASSWORD;
  constructor(public payload: any) {
  }
}

export class changePasswordSuccess implements Action {
  readonly type = CHANGE_PASSWORD_SUCCESS;
  constructor(public payload: any) {
  }
}

export class changePasswordFail implements Action {
  readonly type = CHANGE_PASSWORD_FAIL;
  constructor(public payload: any) {
  }
}

export class resetCount implements Action {
  readonly type = RESET_COUNT;
}

export class clearUserInfo implements Action {
  readonly type = CLEAR_USER_INFO;
}

export type Actions = userLogin 
| userLoginSuccess 
| userLoginFail 
| userSignUp 
| userSignUpSuccess 
| userSignUpFail 
| changePassword 
| changePasswordSuccess 
| changePasswordFail 
| resetCount
| clearUserInfo;
