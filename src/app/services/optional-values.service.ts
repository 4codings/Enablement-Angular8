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

  private apiUrlGet = this.apiService.endPoints.insecure;
  constructor(private http: HttpClient, private apiService: ApiService) { }

  getApplicationOptionalValue() {
    this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET").subscribe(
      res => {
        if (res) {
          console.log('data', res);
          this.applicationOptionalValue.next(res['APP_CD']);
        }
      });
  }
  getProcessOptionalValue(application) {
    this.http.get(this.apiUrlGet + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
      res => {
        if (res) {
          console.log('data', res);
          this.processOptionalValue.next(res['PRCS_CD']);
        }
      });
  }
  getServiceOptionalValue(application, process) {
    this.http.get(this.apiUrlGet + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + process + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
      res => {
        if (res) {
          console.log('data', res);
          this.serviceOptionalValue.next(res['SRVC_CD']);
        }
      });
  }
}
