import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { UserAdminService } from 'src/app/services/user-admin.service';
import { Globals } from 'src/app/services/globals';
import { HomeComponent } from '../../home.component';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';


@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.scss']
})
export class MytaskComponent implements OnInit {

  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  V_BASE_ID: string[] = null;

  constructor(private http: HttpClient, private router: Router,
    private data: UserAdminService,
    private app: HomeComponent, private globals: Globals,
    private StorageSessionService: StorageSessionService, private noAuthData: NoAuthDataService) {
    this.onpselect = function (index) {
      this.selectedplat = index;
      this.selectedot = null;
      this.selectedat = null;
    }
    this.onqselect = function (index) {
      this.selectedot = index;
      this.selectedat = null;
    }
    this.onrselect = function (index) {
      this.selectedat = index;
      this.selectedot = null;
    }
  }

  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrlPost = "https://" + this.domain_name + "/rest/Hold/MyTask";
  atxnid: string[];
  srvcd: string[];
  otxnid: string[];
  servicedetails: string[];
  groups: string[];
  holdreason: string[];
  notes: string[];
  selectedradiobtn: string = "Approve";
  //txnid_sl = "";
  agency_sl = "";
  servs: string;
  array: string[];
  array1: string[];
  array2: string[][] = [];
  hldrsnedit: string;
  notesedit: string;
  searchResult: any[];
  disabled: boolean;
  onpselect: Function;
  onqselect: Function;
  onrselect: Function;
  selectedservc: Number;
  selectedat: Number;
  selectedot: Number;
  Label: any[] = [];


  // ----------- get services ------------

  functionsrvcGetData() {


    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&SCREEN=USR_ACTN&REST_Service=HeldService&Verb=GET").subscribe(
      res => {
        (res.SRVC_CD);
        this.srvcd = res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); });
      }
    );
  }


  // ----------  get Acquired Transactions ------------

  functionATIDGetData(exc_sl) {
    if (exc_sl == "") {
      this.groups = null;
      this.otxnid = null;
      this.atxnid = null;

      this.agency_sl = "";
    }
    this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=AcquiredTasks&Verb=GET").subscribe(
      res => {
        this.atxnid = res.TXN_ID;
      }
    );
  }
  // ----------  get Open Transactions ------------
  functionOTIDGetData(exc_sl) {
    if (exc_sl == "") {
      this.groups = null;
      this.otxnid = null;
      this.atxnid = null;

      this.agency_sl = "";
    }
    this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=OpenTasks&Verb=GET").subscribe(
      res => {
        this.otxnid = res.TXN_ID;
      }
    );
  }
  // ----------  get open ids Details ------------

  functionopendetails(txnid_sl) {
    this.array1 = null;
    this.disabled = true;
    this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txnid_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=OpenTaskDetail&Verb=GET").subscribe(
      res => {
        this.servicedetails = res.PVP;
        this.holdreason = res.HOLD_RSN;
        this.notes = res.RELEASE_RSN;
        this.V_BASE_ID = res.BASE_ID;
        this.servs = this.servicedetails[0];
        this.array = this.servs.split(",");
        this.array[0] = this.array[0].substr(1);
        let l = this.array.length;
        l = l - 1;
        this.array[l] = this.array[l].slice(0, -1);
        for (let i in this.array) {
          this.array1 = this.array[i].split("=");
          this.array2.push(this.array1);
          this.array1 = [];
        }
      }
    );
  }

  functionacquireddetails(txnid_sl) {
    this.array1 = null;
    this.disabled = false;
    this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txnid_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=TaskDetail&Verb=GET").subscribe(
      res => {
        (res.PVP);
        this.servicedetails = res.PVP;
        this.holdreason = res.HOLD_RSN;
        this.notes = res.RELEASE_RSN;
        (this.holdreason);
        (this.notes);
        this.V_BASE_ID = res.BASE_ID;
        this.servs = this.servicedetails[0];
        this.array = this.servs.split(",");
        this.array[0] = this.array[0].substr(1);
        let l = this.array.length;
        l = l - 1;
        this.array[l] = this.array[l].slice(0, -1);
        for (let i in this.array) {
          this.array1 = this.array[i].split("=");
          this.array2.push(this.array1);

          this.array1 = [];
        }
      }
    );

  }

  // -------------for getting dropdown values of parameter -----------

  getDropDownListValue(e) {
    this.app.loading = true;
    this.searchResult = [];
    this.http.get("https://" + this.domain_name + "/rest/v1/secured?V_SRC_CD=AWS1&V_APP_CD=Federal%20Contracts&V_PRCS_CD=Federal%20Opportunities&V_PARAM_NM=Type%20of%20Set%20Aside&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET")
      .subscribe(
        res => {
          (res[e]);
          this.searchResult = res[e];
          this.app.loading = false;
        }
      );

  }

  // -------------for getting groups ---------------
  functiongetgroups() {
    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Groups&Verb=GET").subscribe(
      res => {
        (res.USR_GRP_CD);
        this.groups = res.USR_GRP_CD.sort(function (a, b) { return a.localeCompare(b); });
      }
    );

  }
  // ----------  Acquire button functionality ------------

  toAcquire() {
    let body = {
      "V_USR_NM": this.V_USR_NM,
      "V_BASE_ID": this.V_BASE_ID,
      "V_SRC_CD": this.V_SRC_CD,
      "V_RELEASE_RSN": this.notes,
      "RESULT": "@RESULT",
      "V_OPERATION": "ACQUIRED"
    };
    this.http.post(this.apiUrlPost, body).subscribe(
      res => {
      }
    );
    this.detailshow = false;
    this.atxnid = null;
    this.operationshow = false;

  }

  // ---------- To Release --------------

  toRelease() {
    var V_PVP_PARAM_NM = [];
    var V_PVP_PARAM_VAL = [];
    var V_PVP = [];

    var PVP = null;
    if (this.array2.length > 0) {
      for (var i = 0; i < this.array2.length; i++) {
        if (i % 2 == 0) {
          V_PVP_PARAM_NM.push(this.array2[i]);
        }
        {
          V_PVP_PARAM_VAL.push(this.array2[i]);
        }
      }
      for (var j = 0; j < V_PVP_PARAM_NM.length; j++) {
        V_PVP[j] = V_PVP_PARAM_NM[j] + "=" + V_PVP_PARAM_VAL[j];
      }
      PVP = "{" + V_PVP + "}";
    }
    if (this.selectedradiobtn.toString() == "Release") {
    }
  }
  // ---------- show or hide buttons and form ------------

  agcygrpbox: boolean = false;
  detailshow: boolean = false;
  acquirebtnshow: boolean = false;
  operationshow: boolean = false;
  functiondetailshow() {
    this.detailshow = true;
  }
  functionoperations() {
    this.operationshow = true;
    this.acquirebtnshow = false;
  }
  hideagcygrpbox() {
    this.agcygrpbox = false;
  }
  showagcygrpbox() {
    this.agcygrpbox = true;
  }
  functionacqire() {
    this.acquirebtnshow = true;
    this.agcygrpbox = false;
    this.operationshow = false;

  }

  // ------------------ 

  ngOnInit() {
    this.functionsrvcGetData();
    this.noAuthData.getJSON().subscribe(data => {
      this.Label = data;
    });
  }
}
export interface data {
  SRVC_CD: string[];
  TXN_ID: string[];
  PVP: string[];
  USR_GRP_CD: string[];
  HOLD_RSN: string[];
  RELEASE_RSN: string[];
  BASE_ID: string[];

}