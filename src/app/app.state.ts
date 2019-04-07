import { UserLoginState } from './store/auth/userlogin.reducer';

export interface AppState {
    readonly userInfo:UserLoginState
}