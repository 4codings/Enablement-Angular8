import * as UserMemberShipActions from './usermembership.action';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { userMemberShip } from './usermembership.model';

export interface UserMemberShipState extends EntityState<userMemberShip> {
    selectedUserMemberShipId: number | null;
    loading: boolean;
    loaded: boolean;
    error: string;
}

export const adapter: EntityAdapter<userMemberShip> = createEntityAdapter<userMemberShip>();


export const initialState: UserMemberShipState = adapter.getInitialState({
    selectedUserMemberShipId: null,
    loading: false,
    loaded: false,
    error: ''
  });

export function userMemberShipReducer(state = initialState, action: UserMemberShipActions.Actions): UserMemberShipState {

    switch (action.type) {

        case UserMemberShipActions.GET_USER_MEMBERSHIP:
        return {
            ...state,
            loading: true,
            loaded: false
        };

        case UserMemberShipActions.GET_USER_MEMBERSHIP_SUCCESS:
        return adapter.addAll(action.payload, {
            ...state,
            loading: false,
            loaded: true
        });

        case UserMemberShipActions.GET_USER_MEMBERSHIP_FAIL:
        return {
            ...state,
            loading: false,
            error: action.payload
        };

        default:
            return state;
    }
}

export const getSelectedUserMemberShipId = (state: UserMemberShipState) => state.selectedUserMemberShipId;

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of user ids
export const selectUserMemberShipIds = selectIds;

// select the dictionary of user entities
export const selectUserMemberShipEntities = selectEntities;

// select the array of users
export const selectAllUserMember = selectAll;

// select the total user count
export const selectUserMemberTotal = selectTotal;
