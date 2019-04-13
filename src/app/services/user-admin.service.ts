import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { userRole } from '../store/user-admin/user-role/userrole.model';
import { userMemberShip } from '../store/user-admin/user-membership/usermembership.model';
import { AuthorizationData } from '../store/user-admin/user-authorization/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(private http:HttpClient) { }

    getUsers(): Observable<User[]> {
		return this.http.get<User[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=USER&V_SRC_CD=uttra.24&REST_Service=Masters&Verb=GET');
	}

	getUserGroups(): Observable<userGroup[]> {
		return this.http.get<userGroup[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD=uttra.24&V_CD_TYP=USR_GRP&REST_Service=Masters&Verb=GET');
	}

	getUserRoles(): Observable<userRole[]> {
		return this.http.get<userRole[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET');
	}

	//membership-> user/group
	getUserMemberShip(): Observable<userMemberShip[]> {
		return this.http.get<userRole[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET');
		// return this.http.get<userMemberShip[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD=uttra.24&V_CD_TYP=USR_GRP&REST_Service=Masters&Verb=GET');
	}

	getAuthorizationData(): Observable<AuthorizationData[]>{
    return this.http.get<AuthorizationData[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=USER&V_SRC_CD=uttra.24&REST_Service=Masters&Verb=GET');
	}
}