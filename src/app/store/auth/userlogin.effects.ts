// import { Injectable } from '@angular/core';
// import { Effect, ofType, Actions } from '@ngrx/effects';
// import { Observable, of } from 'rxjs';
// import { Action } from '@ngrx/store';
// import * as userLoginActions from '../actions/userlogin.action' 
// import { mergeMap, map, catchError } from 'rxjs/operators';
// import { ApiService } from "../services/api/api.service";
// import { userInfo } from './userinfo.model';

// @Injectable()
// export class UserLoginEffects {
      
//     constructor(private actions$:Actions, private apiservice:ApiService) {}

//     @Effect({dispatch:true})
//     UserLogin$: Observable<Action> = this.actions$.pipe(
//     ofType<userLoginActions.userLogin>(
//         userLoginActions.USER_LOGIN
//     ),
//     mergeMap((action: userLoginActions.userLogin) =>
//       this.apiservice.userLogin(action.payload).pipe(
//         map(
//           (user: userInfo) =>
//             new userLoginActions.userLoginSuccess(user)
//         ),
//         catchError(err => of(new userLoginActions.userLoginFail(err.error)))
//       )
//     )
//   );

// }