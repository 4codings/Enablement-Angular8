import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { userInfo } from '../store/auth/userinfo.model';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserService } from '../core/user.service';
import { UserLoginState } from '../store/auth/userlogin.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDetail: Observable<UserLoginState>;
  constructor(private http: HttpClient, private store: Store<AppState>, public userService: UserService) {
		this.userDetail = this.store.pipe(select('userInfo'));
  this.userDetail.subscribe(data => {
            // this.userServicve.clear();
            if (data.userInfo.TOKEN != '') {
              if (this.userService.getDetailFromStorage() == null) {
                console.log(data.userInfo.TOKEN);
                this.userService.setUser(data.userInfo);
              }
            }


        });
	}

	userLogin(data) {
		return this.http.post<userInfo>('https://enablement.us/Enablement/rest/authentication', data);
	}
}
