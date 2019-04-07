import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { userLoginReducer } from './store/auth/userlogin.reducer';

// ------------------------------------------------------------------------------

export const reducers: ActionReducerMap<AppState> = {//
  // pass your reducers here
  userInfo:userLoginReducer
};