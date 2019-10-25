import * as UserLoginActions from './userlogin.action';
import { userInfo } from './userinfo.model';

const userinfoData: userInfo = {
  USR_ID: null,
  SRC_ID: null,
  SRC_CD: '',
  TOKEN: '',
  USR_NM: '',
  resultLoginValidity: "",
  resultSrc: "",
  resultSrcAdminEmailID: "",
  resultSrcId: "",
  resultUsrId: "",
  resultUsrOnly: "",
  resultUsrPwd: "",
  resultUsrname: ""
};

export interface UserLoginState {
  userInfo: userInfo;
  loading: boolean;
  loaded: boolean;
  isSignUp: boolean;
  isPasswordReset: boolean;
  error: any;
  count: number
}

export const initialState: UserLoginState = {
  userInfo: userinfoData,
  loading: false,
  loaded: false,
  isSignUp: false,
  isPasswordReset: false,
  error: '',
  count : 0
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
        loaded: false,
        isPasswordReset: false,
        isSignUp: false
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
        count: state.count+1,
        error: action.payload
      };

    case UserLoginActions.USER_SIGN_UP:
      return {
        ...state,
        loading: true,
        loaded: false
      };   

    case UserLoginActions.USER_SIGNUP_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        isSignUp: true,
      };

    case UserLoginActions.USER_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case UserLoginActions.CHANGE_PASSWORD:
      return {
        ...state,
        loading: true,
        loaded: false
      };   

    case UserLoginActions.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        isPasswordReset: true,
      };

    case UserLoginActions.CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };  
      
      case UserLoginActions.CLEAR_USER_INFO:
      return {
        userInfo: {'USR_ID': null, 'SRC_ID': null,'SRC_CD': '', 'TOKEN': '', 'USR_NM': '', 'resultLoginValidity': "", 'resultSrc': "", 'resultSrcAdminEmailID': "" , 'resultSrcId': "", 'resultUsrId': "", 'resultUsrOnly': "NO_SOURCE", 'resultUsrPwd': "", 'resultUsrname': ""},
        loading: false,
        loaded: false,
        isSignUp: false,
        isPasswordReset: false,
        error: '',
        count:0
      };

      case UserLoginActions.RESET_COUNT:
      return {
        ...state,
        count:0
      };

    default:
      return state;
  }
}
