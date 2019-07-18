import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminOverviewService {
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public selectedExe$: Subject<any> = new Subject();
  public selectedCxn$: Subject<any> = new Subject();
  public getExe$: Subject<any> = new Subject();

  constructor(private http:HttpClient) { }

  public selectExe(exe) {
    this.selectedExe$.next(exe);
  }

  public selectCxn(cxn) {
    this.selectedCxn$.next(cxn);
  }

  public getExe() {
    console.log("called");
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res) => {
      console.log("exe", res);
      this.getExe$.next(res);
    })
  }
}
