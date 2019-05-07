import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
import { StorageSessionService } from './storage-session.service';
import { Observable } from 'rxjs';
import { Globals } from './globals';
import { Headers, RequestMethod, RequestOptions } from '@angular/http';
import { ApiService } from '../service/api/api.service';
import { Globals2 } from '../service/globals';

@Injectable({
    providedIn: 'root'
})

export class EndUserService {
    private baseUrl: string = this.apiService.endPoints.insecure;
    private baseSecureUrl: string = this.apiService.endPoints.secure;
    private V_SRC_CD: string = this.storage.getSession("agency");
    private V_USR_NM: string = this.storage.getSession("email");
    private ResetOptimised: boolean = false;
    private Lazyload: boolean = true;
    constructor(private globals: Globals,
        private http: Http,
        private storage: StorageSessionService,
        private globals2: Globals2,
        private apiService: ApiService
    ) {

    }

    /*
        get all application
    */
    getApplication() {
        // return this. http.get(this.baseUrl + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET");

        // secure
        return this.http.get(this.baseSecureUrl + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());

    }
    /*
        get process
    */
    getProcesses(application: string) {
        // return this.http.get(this.baseUrl + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET");

        // secure
        return this.http.get(this.baseSecureUrl + "V_APP_CD=" + application + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET", this.apiService.setHeaders());
    }
    /*
        gets all parameter and values 
    */
    getprocessParameter(application: string, process: string) {
        // return this.http.get(this.baseUrl + "V_APP_CD=" + application + "&V_PRCS_CD=" + process + "&V_SRC_CD=" + this.V_SRC_CD + "&ResetOptimised=" + this.ResetOptimised + "&Lazyload=" + this.Lazyload + "&REST_Service=ProcessParameters&Verb=GET");

        // secure
        return this.http.get(this.baseSecureUrl + "V_APP_CD=" + application + "&V_PRCS_CD=" + process + "&V_SRC_CD=" + this.V_SRC_CD + "&ResetOptimised=" + this.ResetOptimised + "&Lazyload=" + this.Lazyload + "&REST_Service=ProcessParameters&Verb=GET", this.apiService.setHeaders());
    }
    /*
        get parameter all option
    */
    getParameterAllOption(application: string, process: string, paramName: string, srcCode: string) {
        // return this.http.get(this.baseUrl + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + application + "&V_PRCS_CD=" + process + "&V_PARAM_NM=" + paramName + "&V_SRVC_CD=" + srcCode + "&REST_Service=ProcessParametersOptions&Verb=GET");

        // secure
        return this.http.get(this.baseSecureUrl + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + application + "&V_PRCS_CD=" + process + "&V_PARAM_NM=" + paramName + "&V_SRVC_CD=" + srcCode + "&REST_Service=ProcessParametersOptions&Verb=GET", this.apiService.setHeaders());
    }
    /*
        update parameter values
    */
    updateParameterValues(appication: string, process: string, paramName: string, paramValue: String) {

        // return this.http.get(this.baseUrl + "V_APP_CD=" + appication + "&V_PRCS_CD=" + process + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_PARAM_NM=" + paramName + "&V_PARAM_VAL=" + paramValue + "&REST_Service=ProcessParameters&Verb=PATCH");

        // secure
        return this.http.get(this.baseSecureUrl + "V_APP_CD=" + appication + "&V_PRCS_CD=" + process + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_PARAM_NM=" + paramName + "&V_PARAM_VAL=" + paramValue + "&REST_Service=ProcessParameters&Verb=PATCH", this.apiService.setHeaders());
    }

    /*
        Cancel Process
    */
    processCancel(V_SRVC_ID, V_PRCS_TXN_ID, V_UNIQUE_ID) {
        ('process Cancel call');

        const url = `https://${this.globals.domain_name + this.globals.Path}/v${this.globals.Version}/securedJSON?V_SRC_ID=${V_SRVC_ID}&V_USR_ID=${JSON.parse(sessionStorage.getItem('u')).USR_ID}&V_PRCS_TXN_ID=${V_PRCS_TXN_ID}&V_UNIQUE_ID=${V_UNIQUE_ID}&REST_Service=ProcessCancel&Verb=DELETE`;

        const headers = new Headers({
            Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('u')).TOKEN}`
        });
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(url, options);
    }
}
