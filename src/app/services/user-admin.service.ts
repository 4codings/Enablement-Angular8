import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { userRole } from '../store/user-admin/user-role/userrole.model';
import { userMemberShip } from '../store/user-admin/user-membership/usermembership.model';
import { AuthorizationData } from '../store/user-admin/user-authorization/authorization.model';
import { userInfo } from '../store/auth/userinfo.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
    sessionDataToken;
	constructor(private http: HttpClient) {
		if (sessionStorage.getItem('u') != undefined || sessionStorage.getItem('u') != null) {
		    const data = JSON.parse(sessionStorage.getItem('u'));
			   this.sessionDataToken = data.TOKEN;
		}
	}


    getUsers(): Observable<User[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<User[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=USER&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	getUserGroups(): Observable<userGroup[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userGroup[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=USR_GRP&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	getUserRoles(): Observable<userRole[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userRole[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=ROLE&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	// membership-> user/group
	getUserMemberShip(): Observable<userMemberShip[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userRole[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET', {headers: header});
		// return this.http.get<userMemberShip[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD=uttra.24&V_CD_TYP=USR_GRP&REST_Service=Masters&Verb=GET');
	}

	getAuthorizationData(): Observable<AuthorizationData[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
  return this.http.get<AuthorizationData[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=AUTH&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}
}
