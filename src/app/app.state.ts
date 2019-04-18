import { UserLoginState } from './store/auth/userlogin.reducer';
import { UserState } from './store/user-admin/user/user.reducer';
import { UserGroupState } from './store/user-admin/user-group/usergroup.reducer';
import { UserRoleState } from './store/user-admin/user-role/userrole.reducer';
import { UserMemberShipState } from './store/user-admin/user-membership/usermembership.reducer';
import { AuthState } from './store/user-admin/user-authorization/authorization.reducers';

export interface AppState {
  readonly userInfo: UserLoginState;
  readonly user: UserState;
  readonly userGroup: UserGroupState;
  readonly userRole: UserRoleState;
  readonly userMemberShip: UserMemberShipState;
  readonly userAuthorization: AuthState;
}
