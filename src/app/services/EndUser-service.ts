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
    private baseSecureJsonUrl: string = this.apiService.endPoints.securedJSON;
    // private V_SRC_CD: string = this.storage.getSession("agency");
    // private V_USR_NM: string = this.storage.getSession("email");
    V_SRC_ID: string = JSON.parse(sessionStorage.getItem('u')).SRC_ID;
    V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
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

        const url = `https://${this.globals.domain_name + this.globals.Path}/v${this.globals.Version}/securedJSON?V_SRC_ID=${this.V_SRC_ID}&V_USR_ID=${JSON.parse(sessionStorage.getItem('u')).USR_ID}&V_PRCS_TXN_ID=${V_PRCS_TXN_ID}&V_UNIQUE_ID=${V_UNIQUE_ID}&REST_Service=ProcessEnd&Verb=DELETE`;

        const headers = new Headers({
            Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('u')).TOKEN}`
        });
        const options = new RequestOptions({ headers: headers });
        return this.http.delete(url, options);
    }

    getApplicationAndProcess() {
        return this.http.get(this.baseSecureJsonUrl + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ApplicationProcesses&Verb=GET", this.apiService.setHeaders());
    }

    /*
        To populate General, Enable and Properties tabs
    */
    getAllTabs(application: string, process: string, srcCode: string) {
        return this.http.get(this.baseSecureJsonUrl + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + application + "&V_PRCS_CD=" + process + "&V_SRVC_CD=" + srcCode + "&REST_Service=DefinedService" + "&Verb=GET", this.apiService.setHeaders());
    }

    /*
        To list all executable types
    */
    getAllExecutableTypes(iconType: string) {
        return this.http.get(this.baseSecureUrl + 'V_ICN_TYP='+ iconType + "&V_SRC_CD=" + this.V_SRC_CD + "&V_CD_TYP=EXE" + "&REST_Service=Masters" + "&Verb=GET", this.apiService.setHeaders());
    }

    /*
        To populate executable(s) based on selected executable type
    */
    getExecutablesForSelctedExecutableType(executableType: String) {
        return this.http.get(this.baseSecureUrl  + "V_SRC_CD=" + this.V_SRC_CD + "&V_EXE_TYP=" + executableType + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=UsersExe&Verb=GET", this.apiService.setHeaders());
    }

    /*
        To fetch Input/Output for selected executable 
    */
    getInputOutputForSelctedExecutable(executableType: String, executable: String) {
        // TODO V_UNIQUE_ID should be populated dynamically
        return this.http.get(this.baseSecureUrl + "V_UNIQUE_ID=" + "28190" + "&V_EXE_TYP=" + executableType + "&V_EXE_CD=" + executable + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=Exe&Verb=GET", this.apiService.setHeaders());
    }
}
