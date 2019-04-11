import * as UserRoleActions from './userrole.action';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { userRole } from './userrole.model';

export interface UserRoleState extends EntityState<userRole> {
    selectedUserRoleId: number | null;
    loading:boolean,
    loaded:boolean,
    error:string
}

export const adapter: EntityAdapter<userRole> = createEntityAdapter<userRole>();


export const initialState: UserRoleState = adapter.getInitialState({
    selectedUserRoleId: null,
    loading:false,
    loaded:false,
    error:''
  });

export function userRoleReducer(state = initialState, action: UserRoleActions.Actions):UserRoleState {

    switch(action.type) {

        case UserRoleActions.GET_USER_ROLE:
        return {
            ...state,
            loading:true,
            loaded:false
        }

        case UserRoleActions.GET_USER_ROLE_SUCCESS:
        return adapter.addAll(action.payload, {
            ...state,
            loading:false,
            loaded:true
        });

        case UserRoleActions.GET_USER_ROLE_FAIL:
        return {
            ...state,
            loading:false,
            error:action.payload
        }
        
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