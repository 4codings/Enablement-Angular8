import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { userRole } from '../store/user-admin/user-role/userrole.model';
import { userMemberShip } from '../store/user-admin/user-membership/usermembership.model';
import { AuthorizationData } from '../store/user-admin/user-authorization/authorization.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
  sessionData: any[] = []
	constructor(private http:HttpClient,
		private authHeader: HttpHeaders
		) {
			this.authHeader = new HttpHeaders({ 'Authorization': `Bearer`+ this.sessionData['TOKEN'] })

  if(sessionStorage.getItem('u') != undefined || sessionStorage.getItem('u') != null){
	const data = JSON.parse(sessionStorage.getItem('u'))
  this.sessionData = data
  console.log(this.sessionData['SRC_CD'])
	}
}

	
    getUsers(): Observable<User[]> {
		return this.http.get<User[]>('https://enablement.us/Enablement/rest/v1/SPJSON?V_CD_TYP=USER&V_SRC_CD='+this.sessionData['SRC_CD']+'&REST_Service=Masters&Verb=GET',{ headers: this.authHeader });
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
    return this.http.get<AuthorizationData[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=AUTH&V_SRC_CD=uttra.24&REST_Service=Masters&Verb=GET');
	}
	

	getHeader(){
		if(sessionStorage.getItem('u') != undefined || sessionStorage.getItem('u') != null){
			var data = JSON.parse(sessionStorage.getItem('u'))
			console.log(data)
		}
		let getHeaders: HttpHeaders = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'Bearer' +data.token
		});
		return getHeaders;
	}
}