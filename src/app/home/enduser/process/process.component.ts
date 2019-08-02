import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource, MatSelectChange } from '@angular/material';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

import { EVENT_MANAGER_PLUGINS } from '../../../../../node_modules/@angular/platform-browser';
import { Globals } from 'src/app/services/globals';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { GetMessageService } from 'src/app/services/get-message.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { OptionalValuesService, ProcessObservable, ServiceObservable } from 'src/app/services/optional-values.service';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  // styleUrls: ['../../../../assets/css/threepage.css']
})
export class ProcessComponent implements OnInit, OnDestroy {
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;
  domain_name = this.globals.domain_name;
  private apiUrlGet = this.apiService.endPoints.securedJSON;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  APP_CD = [];
  PRCS_CD = [];
  SRVC_CD = [];
  APP_SEL_PRCS;
  APP_SEL_PRCS_ARR;
  APP_SEL_PRCS_ARR_final;
  selectedapp: string = null;
  selectedprcs: string = null;
  selectedsrvc: string = null;
  applicationDescription = '';
  processDescription = '';
  serviceDescription = '';
  modifing;
  applicationValuesObservable = [];
  processValuesObservable: ProcessObservable[] = [];
  serviceValuesObservable: ServiceObservable[] = [];
  flag = true;
  timer: any;
  processBtnName = 'Add';
  serviceBtnName = 'Add';
  rolesList = [];
  selectedPrcsRole = '';
  selectedSrvcRole = '';
  processPermission: RolePermission;
  servicePermission: RolePermission;

  constructor(private Router: Router,
    private http: HttpClient,
    private https: Http,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService,
    private roll: RollserviceService,
    public resp: GetMessageService,
    public deviceService: DeviceDetectorService,
    private webSocket: WebSocketService,
    private globals: Globals,
    private optionalService: OptionalValuesService,
    private apiService: ApiService
  ) {
    this.processPermission = new RolePermission();
    this.servicePermission = new RolePermission();
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValuesObservable = data;
        this.APP_CD = (data.sort(function (a, b) { return a.localeCompare(b); }));
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValuesObservable = data;
        if (this.processValuesObservable.length) {
          if (this.selectedapp !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.selectedapp) {
                this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
              }
            });
          }
        }
      }
    });
    this.serviceValues$ = this.optionalService.serviceOptionalValue.subscribe(data => {
      if (data != null) {
        this.serviceValuesObservable = [];
        this.serviceValuesObservable = data;
        if (this.serviceValuesObservable.length) {
          if (this.selectedapp !== '' && this.selectedprcs !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
                this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
              }
            });
          }
        }
      }
    });
  }


  ngOnInit() {
    if (!this.applicationValuesObservable.length) {
      this.functionapplist();
    }
    this.getRoles();
  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
  }

  sendMessage() {
  }
  recr_() {
    this.http.get<any>("https://enablement.us/rest/v1/secured?V_SRC_ID=205&V_APP_ID=143&V_PRCS_ID=311&V_PRCS_TXN_ID=8752&REST_Service=ProcessStatus&Verb=GET").subscribe(
      res => {

        if (this.flag)
          this.recr_();
      }
    );
  }

  clickme(app, i, evt) {
    this.selectedapp = app;
    this.functionGetAppDescription(this.selectedapp);
    this.functionprocesslist();
  }
  clickme1(u, evt) {
    this.selectedprcs = u;
    this.functionGetProcessDescription(this.selectedprcs);
    this.processBtnName = 'Authorize';
    this.functionserviceslist();
  }
  clickme2(u, evt) {
    this.functionGetServiceDescription(u);
    this.serviceBtnName = 'Authorize';
    this.selectedsrvc = u;
  }
  // ----------- get Applications ------------
  functionapplist() {

    if (!this.applicationValuesObservable.length) {
      this.optionalService.getApplicationOptionalValue();
    }
  }

  //-------------Get Processes---------------
  functionprocesslist() {
    if (!this.processValuesObservable.length) {
      this.optionalService.getProcessOptionalValue(this.selectedapp);
    } else {
      let flag = 0;
      this.processValuesObservable.forEach(ele => {
        if (ele.app === this.selectedapp) {
          this.PRCS_CD = [];
          if (ele.data.CREATE[0] == "Y" && ele.data.DELETE[0] == "Y" && ele.data.UPDATE[0] == "Y") {
            this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
            flag = 1;
          }
        }
      });
      if (!flag) {
        this.optionalService.getProcessOptionalValue(this.selectedapp);
      }
    }
  }
  // ----------  get Services ------------
  functionserviceslist() {
    if (!this.serviceValuesObservable.length) {
      this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
    } else {
      let flag = 0;
      this.serviceValuesObservable.forEach(ele => {
        if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
          this.SRVC_CD = [];
          this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
          flag = 1;
        }
      });
      if (!flag) {
        this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
      }
    }
  }
  functionGetAppDescription(value) {
    this.http.get(this.apiUrlGet + 'V_CD_TYP=APP' + '&V_CD=' + value + '&V_SRC_CD=' + this.V_SRC_CD + '&&REST_Service=Description&Verb=GET')
      .subscribe((data: any) => {
        if (data.length) {
          this.applicationDescription = data[0].APP_DSC;
        }
      })
  }
  functionGetProcessDescription(value) {
    this.http.get(this.apiUrlGet + 'V_CD_TYP=PRCS' + '&V_CD=' + value + '&V_SRC_CD=' + this.V_SRC_CD + '&&REST_Service=Description&Verb=GET')
      .subscribe((data: any) => {
        if (data.length) {
          this.processDescription = data[0].PRCS_DSC;
        }
      })
  }
  functionGetServiceDescription(value) {
    this.http.get(this.apiUrlGet + 'V_CD_TYP=SRVC' + '&V_CD=' + value + '&V_SRC_CD=' + this.V_SRC_CD + '&&REST_Service=Description&Verb=GET')
      .subscribe((data: any) => {
        if (data.length) {
          this.serviceDescription = data[0].SRVC_DSC;
        }
      })
  }
  onPermissionChange(item, paramter_name) {
    item[paramter_name] = item[paramter_name] === 'Y' ? 'N' : 'Y';
  }
  onServiceDelete() {
    if (this.selectedsrvc !== '' || this.selectedsrvc !== null) {
      this.http.delete(this.apiUrlGet + 'V_APP_CD=' + this.selectedapp + '&V_PRCS_CD=' + this.selectedprcs + 'V_SRVC_CD=' + this.selectedsrvc + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=Service&Verb=DELETE')
        .subscribe(res => {
          this.selectedsrvc = '';
          this.serviceDescription = '';
          this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedsrvc, true);
        })
    }
  }
  onAppDelete() {
    if (this.selectedapp !== '' || this.selectedapp !== null) {
      this.http.delete(this.apiUrlGet + 'V_APP_CD=' + this.selectedapp + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=Application&Verb=DELETE')
        .subscribe(res => {
          let index = this.optionalService.applicationArray.indexOf(this.selectedapp);
          this.optionalService.applicationArray.splice(index, 1);
          this.optionalService.applicationOptionalValue.next(this.optionalService.applicationArray);
          this.selectedapp = '';
          this.selectedprcs = '';
          this.selectedsrvc = '';
          this.processDescription = '';
          this.serviceDescription = '';
          this.applicationDescription = '';
          this.PRCS_CD = [];
          this.SRVC_CD = [];
        })
    }
  }
  onProcessDelete() {
    if (this.selectedprcs !== '' || this.selectedprcs !== null) {
      this.http.delete(this.apiUrlGet + 'V_APP_CD=' + this.selectedapp + '&V_PRCS_CD=' + this.selectedprcs + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=Process&Verb=DELETE')
        .subscribe(res => {
          this.selectedprcs = '';
          this.selectedsrvc = '';
          this.processDescription = '';
          this.serviceDescription = '';
          this.optionalService.getProcessOptionalValue(this.selectedapp, true);
        })
    }
  }
  onAppAdd() {
    const body = {
      V_APP_CD: this.selectedapp,
      V_SRC_CD: this.V_SRC_CD,
      V_APP_DSC: this.applicationDescription,
      V_USR_NM: this.V_USR_NM,
      REST_Service: 'Application',
      Verb: 'PUT'
    };
    this.http.post(this.apiUrlGet, body)
      .subscribe(res => {
        if (res) {
          this.optionalService.applicationArray.push(this.selectedapp);
          this.optionalService.applicationOptionalValue.next(this.optionalService.applicationArray);
          this.selectedapp = '';
          this.applicationDescription = '';
        }
      })
  }
  getRoles() {
    this.http.get(this.apiUrlGet + 'V_USR_NM=' + this.V_USR_NM + '&V_SRC_CD=' + this.V_SRC_CD + '&REST_Service=WorkflowRoles&Verb=GET')
      .subscribe((data: any) => {
        if (data) {
          this.rolesList = data;
        }
      })
  }
  onProcessAdd() {
    const body = {
      V_APP_CD: this.selectedapp,
      V_PRCS_CD: this.selectedprcs,
      V_SRC_CD: this.V_SRC_CD,
      V_PRCS_DSC: this.processDescription,
      V_ROLE_CD: this.selectedPrcsRole,
      V_READ: this.processPermission.READ,
      V_EXECUTE: this.processPermission.EXECUTE,
      V_DELETE: this.processPermission.DELETE,
      V_CREATE: this.processPermission.CREATE,
      V_UPDATE: this.processPermission.UPDATE,
      V_USR_NM: this.V_USR_NM,
      REST_Service: 'Process',
      Verb: 'PUT'
    };
    this.http.post(this.apiUrlGet, body)
      .subscribe(res => {
        if (res) {
          this.optionalService.getProcessOptionalValue(this.selectedapp, true);
          this.selectedprcs = '';
          this.processDescription = '';
          this.selectedPrcsRole = '';
          this.processPermission = new RolePermission();
        }
      })
  }
  onServiceAdd() {
    const body = {
      V_APP_CD: this.selectedapp,
      V_PRCS_CD: this.selectedprcs,
      V_SRC_CD: this.V_SRC_CD,
      V_SRVC_CD: this.selectedsrvc,
      V_SRVC_DSC: this.serviceDescription,
      V_ROLE_CD: this.selectedSrvcRole,
      V_READ: this.servicePermission.READ,
      V_EXECUTE: this.servicePermission.EXECUTE,
      V_DELETE: this.servicePermission.DELETE,
      V_CREATE: this.servicePermission.CREATE,
      V_UPDATE: this.servicePermission.UPDATE,
      V_USR_NM: this.V_USR_NM,
      REST_Service: 'Service',
      Verb: 'PUT'
    };
    this.http.post(this.apiUrlGet, body)
      .subscribe(res => {
        if (res) {
          this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs, true);
          this.selectedsrvc = '';
          this.serviceDescription = '';
          this.selectedSrvcRole = '';
          this.servicePermission = new RolePermission();
        }
      })
  }
}
export interface data {
  APP_CD: string[];
  PRCS_CD: string[];
  SRVC_CD: string[];
  CREATE: string[];
  UPDATE: string[];
  DELETE: string[];
  PRDCR_SRVC_CD: string[];
  TRNSN_CND: string[];
  CONT_ON_ERR_FLG: string[];
  AUTO_ID: string[];
  USR_GRP_CD: string[];
}

export class RolePermission {
  READ: any;
  UPDATE: any;
  CREATE: any;
  DELETE: any;
  EXECUTE: any;
  constructor() {
    this.CREATE = 'Y';
    this.DELETE = 'Y';
    this.UPDATE = 'Y';
    this.READ = 'Y';
    this.EXECUTE = 'Y';
  }
}