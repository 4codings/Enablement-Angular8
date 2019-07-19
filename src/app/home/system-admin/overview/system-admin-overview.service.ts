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
  public exes;
  public getMachineConnection$: Subject<any> = new Subject();
  public machines;

  constructor(private http:HttpClient) { }

  public selectExe(exe) {
    this.selectedExe$.next(exe);
  }

  public selectCxn(cxn) {
    this.selectedCxn$.next(cxn);
  }

  public getExe() {
    //console.log("called");
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res) => {
      //console.log("exe", res);
      this.exes = res;
      this.getAllExes();
    })
  }

  getAllExes() {
    var sortedAllExes = [];
    var allExes = [];
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.exes.forEach(item => {
        let arr = res.filter(data => {
          return item.EXE_TYP == data.V_EXE_TYP
        })
        allExes.push({EXE_TYP: item.EXE_TYP, EXES:arr})
      });
      sortedAllExes = allExes.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
      this.getExe$.next(sortedAllExes);
      //console.log("sortedAllExes", sortedAllExes);
    }, err => {
       console.log(err);
    })
  }
   
  getMachine() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=MACHINES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.machines = res;
      this.getAllMachineConnections();
    }, err => {
       console.log(err);
    })
  }

  getAllMachineConnections() {
    let connections=[];
    let sortedAllConnections = [];
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=CXNS&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.machines.forEach(item => {
        let arr = res.filter(data => {
          return item.V_PLATFORM_ID == data.V_PLATFORM_ID
        })
        connections.push({V_PLATFORM_CD: item.V_PLATFORM_CD, V_CXN:arr});
        sortedAllConnections = connections.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
        this.getMachineConnection$.next(sortedAllConnections);
        //console.log("connections", sortedAllConnections);
      });
    }, err => {
       console.log(err);
    })
  }

}
