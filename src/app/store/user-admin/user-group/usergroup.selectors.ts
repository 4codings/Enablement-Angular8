import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap,
  } from '@ngrx/store';
  import * as fromUserGroup from './usergroup.reducer';
   
  export const selectUserGroupState = createFeatureSelector<fromUserGroup.UserGroupState>('userGroup');
   
  export const selectUserGroupIds = createSelector(
    selectUserGroupState,
    fromUserGroup.selectUserGroupIds
  );

  export const selectUserGroupEntities = createSelector(
    selectUserGroupState,
    fromUserGroup.selectUserGroupEntities
  );
  export const selectAllUserGroups = createSelector(
    selectUserGroupState,
    fromUserGroup.selectAllUserGroups
  );
  export const selectUserGroupTotal = createSelector(
    selectUserGroupState,
    fromUserGroup.selectUserGroupTotal
  );
  export const selectUserGroupId = createSelector(
    selectUserGroupState,
    fromUserGroup.getSelectedUserGroupId
  );
   
  export const selectCurrentUserGroup = createSelector(
    selectUserGroupEntities,
    selectUserGroupId,
    (userGroupEntities, UserGroupId) => userGroupEntities[UserGroupId]
  );

  export const getErrors = createSelector(
    selectUserGroupState,
    state => state.error
  );

  export const getLoading = createSelector(
    selectUserGroupState,
    state => state.loading
  );
  
  export const getLoaded = createSelector(
    selectUserGroupState,
    state => state.loaded
  );