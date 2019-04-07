import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(private http:HttpClient) { }

  getUsers(): Observable<User[]> {
		return this.http.get<User[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=USER&V_SRC_CD=AB&REST_Service=Masters&Verb=GET');
	}

	getUserGroups(): Observable<userGroup[]> {
		return this.http.get<userGroup[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET');
	}
}
