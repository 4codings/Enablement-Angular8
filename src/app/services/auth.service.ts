import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { userInfo } from '../store/auth/userinfo.model';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

	userLogin(data) {
		return this.http.post<userInfo>('https://enablement.us/Enablement/rest/authentication', data);
	}
}
