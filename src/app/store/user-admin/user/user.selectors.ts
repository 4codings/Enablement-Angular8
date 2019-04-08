import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap
} from "@ngrx/store";
import * as fromUser from "./user.reducer";

export const selectUserState = createFeatureSelector<fromUser.UserState>(
  "user"
);

export const selectUserIds = createSelector(
  selectUserState,
  fromUser.selectUserIds
);

export const selectUserEntities = createSelector(
  selectUserState,
  fromUser.selectUserEntities
);
export const selectAllUsers = createSelector(
  selectUserState,
  fromUser.selectAllUsers
);
export const selectUserTotal = createSelector(
  selectUserState,
  fromUser.selectUserTotal
);
export const selectUserId = createSelector(
  selectUserState,
  fromUser.getSelectedUserId
);

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectUserId,
  (userEntities, UserId) => userEntities[UserId]
);

export const getErrors = createSelector(
  selectUserState,
  state => state.error
);

export const getLoading = createSelector(
  selectUserState,
  state => state.loading
);

export const getLoaded = createSelector(
  selectUserState,
  state => state.loaded
);
