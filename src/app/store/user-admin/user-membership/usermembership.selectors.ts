import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap,
  } from '@ngrx/store';
  import * as fromUserMemberShip from './usermembership.reducer';
   
  export const selectUserMemberShipState = createFeatureSelector<fromUserMemberShip.UserMemberShipState>('userMemberShip');
   
  export const selectUserMemberShipIds = createSelector(
    selectUserMemberShipState,
    fromUserMemberShip.selectUserMemberShipIds
  );

  export const selectUserMemberShipEntities = createSelector(
    selectUserMemberShipState,
    fromUserMemberShip.selectUserMemberShipEntities
  );
  export const selectAllUserMemberShips = createSelector(
    selectUserMemberShipState,
    fromUserMemberShip.selectAllUserMember
  );
  export const selectUserMemberShipTotal = createSelector(
    selectUserMemberShipState,
    fromUserMemberShip.selectUserMemberTotal
  );
  export const selectUserMemberShipId = createSelector(
    selectUserMemberShipState,
    fromUserMemberShip.getSelectedUserMemberShipId
  );
   
  export const selectCurrentUserMemberShip = createSelector(
    selectUserMemberShipEntities,
    selectUserMemberShipId,
    (userMemberShipEntities, UserMemberShipId) => userMemberShipEntities[UserMemberShipId]
  );

  export const getErrors = createSelector(
    selectUserMemberShipState,
    state => state.error
  );

  export const getLoading = createSelector(
    selectUserMemberShipState,
    state => state.loading
  );
  
  export const getLoaded = createSelector(
    selectUserMemberShipState,
    state => state.loaded
  );