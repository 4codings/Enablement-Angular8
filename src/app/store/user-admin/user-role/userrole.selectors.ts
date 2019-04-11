import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap,
  } from '@ngrx/store';
  import * as fromUserRole from './userrole.reducer';
   
  export const selectUserRoleState = createFeatureSelector<fromUserRole.UserRoleState>('userRole');
   
  export const selectUserRoleIds = createSelector(
    selectUserRoleState,
    fromUserRole.selectUserRoleIds
  );

  export const selectUserRoleEntities = createSelector(
    selectUserRoleState,
    fromUserRole.selectUserRoleEntities
  );
  export const selectAllUserRoles = createSelector(
    selectUserRoleState,
    fromUserRole.selectAllUserRoles
  );
  export const selectUserRoleTotal = createSelector(
    selectUserRoleState,
    fromUserRole.selectUserRoleTotal
  );
  export const selectUserRoleId = createSelector(
    selectUserRoleState,
    fromUserRole.getSelectedUserRoleId
  );
   
  export const selectCurrentUserRole = createSelector(
    selectUserRoleEntities,
    selectUserRoleId,
    (userRoleEntities, UserRoleId) => userRoleEntities[UserRoleId]
  );

  export const getErrors = createSelector(
    selectUserRoleState,
    state => state.error
  );

  export const getLoading = createSelector(
    selectUserRoleState,
    state => state.loading
  );
  
  export const getLoaded = createSelector(
    selectUserRoleState,
    state => state.loaded
  );