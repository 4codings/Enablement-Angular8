import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../service/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class OptionalValuesService {

  applicationOptionalValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  processOptionalValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  serviceOptionalValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  application_id: any;
  process_id: any;
  applicationArray = [];
  processArray = [];
  serviceArray = [];

  private apiUrlGet = this.apiService.endPoints.insecure;
  constructor(private http: HttpClient, private apiService: ApiService) { }

  getApplicationOptionalValue() {
    this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET").subscribe(
      res => {
        if (res) {
          this.applicationArray = res['APP_CD'];
          this.applicationOptionalValue.next(res['APP_CD']);
        }
      });
  }
  getProcessOptionalValue(application) {
    let flag = 0;
    if (this.processArray.length) {
      this.processArray.forEach(ele => {
        if (ele.app === application) {
          flag = 1;
        }
      })
    }
    if (!flag || !this.processArray.length) {
      this.http.get(this.apiUrlGet + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
        res => {
          if (res) {
            this.processArray.push({ 'app': application, 'process': res['PRCS_CD'] });
            this.processOptionalValue.next(this.processArray);
          }
        });
    }
  }
  getServiceOptionalValue(application, process) {
    let flag = 0;
    if (this.serviceArray.length) {
      this.serviceArray.forEach(ele => {
        if (ele.process === process && ele.app === application) {
          flag = 1;
        }
      })
    }
    if (!flag || !this.serviceArray.length) {
      this.http.get(this.apiUrlGet + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + process + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
        res => {
          if (res) {
            this.serviceArray.push({ 'app': application, 'process': process, 'service': res['SRVC_CD'] });
            this.serviceOptionalValue.next(this.serviceArray);
          }
        });
    }
  }
}
export class ProcessObservable {
  app: any;
  process: any;
}
export class ServiceObservable {
  app: any;
  process: any;
  service: any;
}