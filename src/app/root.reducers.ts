import { ActionReducerMap, ActionReducer, MetaReducer } from "@ngrx/store";
import { AppState } from "./app.state";
import { userLoginReducer } from "./store/auth/userlogin.reducer";
import { userReducer } from "./store/user-admin/user/user.reducer";
import { userGroupReducer } from "./store/user-admin/user-group/usergroup.reducer";

// ------------------------------------------------------------------------------

export const reducers: ActionReducerMap<AppState> = {
  //
  // pass your reducers here
  userInfo: userLoginReducer,
  user: userReducer,
  userGroup: userGroupReducer
};
