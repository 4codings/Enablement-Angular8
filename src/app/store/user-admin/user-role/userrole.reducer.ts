import * as UserRoleActions from './userrole.action';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { userRole } from './userrole.model';

export interface UserRoleState extends EntityState<userRole> {
    selectedUserRoleId: number | null;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<userRole> = createEntityAdapter<userRole>();


export const initialState: UserRoleState = adapter.getInitialState({
    selectedUserRoleId: null,
    loading: false,
    loaded: false,
    error: ''
  });

export function userRoleReducer(state = initialState, action: UserRoleActions.Actions): UserRoleState {

    switch (action.type) {

        case UserRoleActions.GET_USER_ROLE:
        return {
            ...state,
            loading: true,
            loaded: false
        };

        case UserRoleActions.GET_USER_ROLE_SUCCESS:
        return adapter.addAll(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.GET_USER_ROLE_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        case UserRoleActions.ADD_USER_ROLE:
        return {
            ...state,
            loading: true,
            loaded: false
        };

        case UserRoleActions.ADD_USER_ROLE_SUCCESS:
        return adapter.addOne(action.payload[0], {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.ADD_USER_ROLE_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        case UserRoleActions.UPDATE_USER_ROLE:
        return {
            ...state,
            loading: true,
            loaded: false
        };

        case UserRoleActions.UPDATE_USER_ROLE_SUCCESS:
        return adapter.upsertOne(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.UPDATE_USER_ROLE_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        case UserRoleActions.DELETE_USER_ROLE:
        return {
            ...state,
            loading: true,
            loaded: false
        };

        case UserRoleActions.DELETE_USER_ROLE_SUCCESS:
        if(action.res[0].RESULT == "ROLE DELETED SUCCESSFULLY") {
            return adapter.removeOne(action.payload.id, {
                ...state,
                loading: false,
                loaded: true
            });
        } else {
           return {
            ...state,
            loading: false,
            loaded: true
           }
        }

        case UserRoleActions.DELETE_USER_ROLE_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        case UserRoleActions.SELECT_ROLE_GROUP_RELATION:
        return adapter.upsertMany(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.REMOVE_SELECTED_ROLE_GROUP_RELATION:
        return adapter.upsertMany(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.CHECKED_ROLE_GROUP:
        return adapter.upsertOne(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserRoleActions.SELECT_ROLE_ID:
        return {
            ...state,
            selectedUserRoleId: action.payload
        };

        case UserRoleActions.REMOVE_ROLE_ID:
        return {
            ...state,
            selectedUserRoleId: null
        };

        case UserRoleActions.UPDATE_GROUP_IDS:
        return adapter.upsertOne(action.payload, {
            ...state
        });

        default:
            return state;
    }
}

export const getSelectedUserRoleId = (state: UserRoleState) => state.selectedUserRoleId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of user ids
export const selectUserRoleIds = selectIds;

// select the dictionary of user entities
export const selectUserRoleEntities = selectEntities;

// select the array of users
export const selectAllUserRoles = selectAll;

// select the total user count
export const selectUserRoleTotal = selectTotal;
