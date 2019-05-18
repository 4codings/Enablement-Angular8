import * as UserLoginActions from './userlogin.action';
import { userInfo } from './userinfo.model';

const userinfoData: userInfo = {
  USR_ID: null,
  SRC_ID: null,
  SRC_CD: '',
  TOKEN: '',
  USR_NM: ''
};

export interface UserLoginState {
  userInfo: userInfo;
  loading: boolean;
  loaded: boolean;
  error: string;
}

export const initialState: UserLoginState = {
  userInfo: userinfoData,
  loading: false,
  loaded: false,
  error: ''
};

export function userLoginReducer(
  state = initialState,
  action: UserLoginActions.Actions
): UserLoginState {
  switch (action.type) {
    case UserLoginActions.USER_LOGIN:
      return {
        ...state,
        loading: true,
        loaded: false
      };

    case UserLoginActions.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        loaded: true
      };

    case UserLoginActions.USER_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
      case UserLoginActions.CLEAR_USER_INFO:
      return {
        userInfo: {'USR_ID': null, 'SRC_ID': null,'SRC_CD': '', 'TOKEN': '', 'USR_NM': ''},
        loading: false,
        loaded: false,
        error: ''
      };

    default:
      return state;
  }
}
