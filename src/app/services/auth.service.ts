import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { userInfo } from '../store/auth/userinfo.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  // getUsers(): Observable<User[]> {
	// 	return this.http.get<User[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=USER&V_SRC_CD=uttra.24&REST_Service=Masters&Verb=GET');
	// }

	// getUserGroups(): Observable<userGroup[]> {
	// 	return this.http.get<userGroup[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET');
	// }
  
	userLogin(data) {
		return this.http.post<userInfo>('https://enablement.us/Enablement/rest/authentication', data);
	}
}
