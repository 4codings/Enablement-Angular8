import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap,
  } from '@ngrx/store';
import * as fromUserAuthorization from './authorization.reducers';

export const selectAuthorizationState = createFeatureSelector<fromUserAuthorization.AuthState>('userAuthorization');

export const selectAuthrizationIds = createSelector(
    selectAuthorizationState,
    fromUserAuthorization.selectAuthIds
  );

export const selectAuthorizationEntities = createSelector(
    selectAuthorizationState,
    fromUserAuthorization.selectAuthEntities
  );
export const selectAllAutorizationvalues = createSelector(
    selectAuthorizationState,
    fromUserAuthorization.selectAllAuthvalues
  );
export const selectAuthorizationTotal = createSelector(
    selectAuthorizationState,
    fromUserAuthorization.selectAuthCount
  );
export const selectAuthId = createSelector(
    selectAuthorizationState,
    fromUserAuthorization.getSelectedAuthId
  );

export const selectCurrentUserMemberShip = createSelector(
    selectAuthorizationEntities,
    selectAuthId,
    (AuthorizationEntities, AuthorizationId) => AuthorizationEntities[AuthorizationId]
  );

export const getErrors = createSelector(
    selectAuthorizationState,
    state => state.error
  );

export const getLoading = createSelector(
    selectAuthorizationState,
    state => state.loading
  );

export const getLoaded = createSelector(
    selectAuthorizationState,
    state => state.loaded
  );
