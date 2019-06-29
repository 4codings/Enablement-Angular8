import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './globals';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RollserviceService {

  domain_name = this.globals.domain_name;
  agency = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Roll_cd: any;
  roleValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private globals: Globals
  ) {
  }

  getRollCd(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.Roll_cd) {
        this.http.get(
          'https://' + this.domain_name + '/rest/v1/secured?V_SRC_CD=' + this.agency + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=UserRoles&Verb=GET'
        ).subscribe(
          (result: any) => {
            this.Roll_cd = result.ROLE_CD || [];
            this.roleValue.next(this.Roll_cd);
            resolve(this.Roll_cd);
          }
        );
      } else {
        resolve(this.Roll_cd);
      }
    });
  }

  getAvailableGroupDetails(V_USR_GRP_CD: any) {
    return this.http.get('https://' + this.domain_name + '/rest/v1/secured?V_USR_GRP_CD=' + V_USR_GRP_CD + '&V_SRC_CD=' + this.agency + '&REST_Service=Group&Verb=GET');
  }

  assignAuthToRole(data: any): Observable<any> {
    return this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', data);
  }

}
