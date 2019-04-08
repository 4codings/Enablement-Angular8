import { UserLoginState } from "./store/auth/userlogin.reducer";
import { UserState } from "./store/user-admin/user/user.reducer";
import { UserGroupState } from "./store/user-admin/user-group/usergroup.reducer";

export interface AppState {
  readonly userInfo: UserLoginState;
  readonly user: UserState;
  readonly userGroup: UserGroupState;
}
