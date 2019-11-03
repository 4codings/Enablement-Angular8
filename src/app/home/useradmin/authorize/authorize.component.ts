import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationData } from '../../../store/user-admin/user-authorization/authorization.model';
import { NoAuthDataService } from '../../../services/no-auth-data.service';
import { AppState } from '../../../app.state';
import { Store, select } from '@ngrx/store';
import * as authActions from '../../../store/user-admin/user-authorization/authorization.actions';
import * as authSelectors from '../../../store/user-admin//user-authorization/authorization.selectors';
import { MatRadioChange } from '@angular/material/radio';
import { OptionalValuesService, ProcessObservable, ServiceObservable } from '../../../services/optional-values.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../service/api/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit, OnDestroy {

  Label: any[] = [];
  user: any[] = [];
  public authValues$: Observable<AuthorizationData[]>;
  addBtn = true;
  updateBtn = false;
  public authData$: Observable<AuthorizationData[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: string;
  authD = new data;
  V_SRC_CD_DATA;
  radioList = ['ARTIFACT', 'EXE', 'PLATFORM', 'PROCESS', 'SERVER', 'SERVICE', 'SLA'];
  authValues: AuthorizationData[] = [];
  filteredAuthValues: AuthorizationData[] = [];
  authValueObj: data;
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;
  applicationValues = [];
  applicationValuesObservable = [];
  processValues = [];
  processValuesObservable: ProcessObservable[] = [];
  serviceValues = [];
  serviceValuesObservable: ServiceObservable[] = [];
  selectedApplication = '';
  selectedProcess = '';
  selectedService = '';
  addFlag = false;
  radioSelected;
  oldRadioSelected;
  domain_name = environment.domainName;
  enableAddButtonFlag = false;
  constructor(
    public noAuthData: NoAuthDataService,
    protected store: Store<AppState>,
    protected optionalService: OptionalValuesService,
    protected http: HttpClient, protected apiServcie: ApiService
  ) {
    this.authValueObj = new data();
    this.authValueObj.V_CREATE = 'N';
    this.authValueObj.V_READ = 'N';
    this.authValueObj.V_DELETE = 'N';
    this.authValueObj.V_UPDATE = 'N';
    this.authValueObj.V_EXECUTE = 'N';
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      this.Label = data;
    });
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValuesObservable = data;
        this.applicationValues = [...this.applicationValuesObservable];
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValuesObservable = data;
        if (this.processValuesObservable.length) {
          this.processValues = [];
          if (this.selectedApplication !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.selectedApplication) {
                this.processValues = ele.process;
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
          this.serviceValues = [];
          if (this.selectedApplication !== '' && this.selectedProcess !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.selectedApplication && ele.process === this.selectedProcess) {
                this.serviceValues = ele.service;
              }
            });
          }
        }
      }
    });
  }

  ngOnInit() {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.radioSelected = this.radioList[0];
    this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    this.authValues$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.error$ = this.store.pipe(select(authSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(authSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(authSelectors.getLoaded));
    this.authValues$.subscribe(data => {
      this.authValues = data;
      this.getFilterData(this.radioSelected);
    });
    if (!this.applicationValues.length) {
      this.getApplicationList();
    }
  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
  }

  selected(index) {
    this.selecteduser = index;
  }

  onAppSelect(event) {
    this.selectedApplication = event;
    if (this.radioSelected === 'SERVICE' || this.radioSelected === 'PROCESS') {
      this.authValueObj.V_APP_CD = event;
      if (!this.processValuesObservable.length) {
        this.optionalService.getProcessOptionalValue(event);
      } else {
        let flag = 0;
        this.processValuesObservable.forEach(ele => {
          if (ele.app === this.selectedApplication) {
            this.processValues = [];
            this.processValues = ele.process;
            flag = 1;
          }
        });
        if (!flag) {
          this.optionalService.getProcessOptionalValue(event);
        }
      }
    } else if (this.radioSelected === 'ARTIFACT' || this.radioSelected === 'PLATFORM' || this.radioSelected === 'SERVER' || this.radioSelected === 'SLA') {
      this.authValueObj.V_AUTH_DSC = event;
      this.authValueObj.V_AUTH_CD = event;
    } else {
      this.authValueObj.V_EXE_TYP = event;
    }
    this.enableAddButtonFlag = this.checkEnableButtonFlag();
  }

  onProcessSelect(event) {
    // this.selectedProcess.push({ 'index': index, 'process': event.value });
    this.selectedProcess = event;
    if (this.radioSelected === 'SERVICE') {
      this.authValueObj.V_PRCS_CD = event;
      if (!this.serviceValuesObservable.length) {
        this.optionalService.getServiceOptionalValue(this.selectedApplication, event);
      } else {
        let flag = 0;
        this.serviceValuesObservable.forEach(ele => {
          if (ele.app === this.selectedApplication && ele.process === this.selectedProcess) {
            this.serviceValues = [];
            this.serviceValues = ele.service;
            flag = 1;
          }
        });
        if (!flag) {
          this.optionalService.getServiceOptionalValue(this.selectedApplication, event);
        }
      }
    } else {
      this.authValueObj.V_ARTFCT_TYP = event;
      this.authValueObj.V_AUTH_DSC = event;
      this.authValueObj.V_AUTH_CD = event;
    }
    this.enableAddButtonFlag = this.checkEnableButtonFlag();
  }
  onServiceSelect(event) {
    this.selectedService = event;
    this.authValueObj.V_AUTH_DSC = event;
    this.authValueObj.V_AUTH_CD = event;
    this.enableAddButtonFlag = this.checkEnableButtonFlag();
  }

  checkEnableButtonFlag() {
    if (this.radioSelected === 'ARTIFACT' || this.radioSelected === 'PLATFORM' || this.radioSelected === 'SERVER' || this.radioSelected === 'SLA') {
      if (this.selectedApplication !== '') {
        return true;
      } else {
        return false;
      }
    } else if (this.radioSelected === 'EXE' || this.radioSelected === 'PROCESS') {
      if (this.selectedApplication !== '' && this.selectedProcess !== '') {
        return true;
      } else {
        return false;
      }
    } else if (this.radioSelected === 'SERVICE') {
      if (this.selectedApplication !== '' && this.selectedProcess !== '' && this.selectedService !== '') {
        return true;
      } else {
        return false;
      }
    }
  }
  getFilterData(data: string) {
    this.filteredAuthValues = [];
    this.applicationValues = [];
    this.processValues = [];
    this.filteredAuthValues = this.authValues.filter(v => v['V_AUTH_TYP'] === data);
    if (this.radioSelected === 'ARTIFACT' || this.radioSelected === 'PLATFORM' || this.radioSelected === 'SERVER' || this.radioSelected === 'SLA') {
      if (this.filteredAuthValues.length) {
        this.applicationValues = [];
        this.filteredAuthValues.forEach((ele: any) => {
          if (this.applicationValues.length && (this.applicationValues.indexOf(ele.V_AUTH_CD) > -1)) {

          } else {
            this.applicationValues.push(ele.V_AUTH_CD);
          }
        });
      } else {
        this.applicationValues = [];
      }
    } else if (this.radioSelected === 'EXE') {
      if (this.filteredAuthValues.length) {
        this.applicationValues = [];
        this.processValues = [];
        this.filteredAuthValues.forEach((ele: any) => {
          if (this.applicationValues.length && (this.applicationValues.indexOf(ele.V_EXE_TYP) > -1)) {

          } else {
            this.applicationValues.push(ele.V_EXE_TYP);
          }
          if (this.processValues.length && this.processValues.indexOf(ele.V_AUTH_CD) > -1) {

          } else {
            this.processValues.push(ele.V_AUTH_CD);
          }
        });
      } else {
        this.applicationValues = [];
        this.processValues = [];
      }
    } else {
      this.applicationValues = [...this.applicationValuesObservable];
      // this.processValues = [...this.processValuesObservable];
      // this.serviceValues = [...this.serviceValuesObservable];
    }
  }
  getApplicationList() {
    this.optionalService.getApplicationOptionalValue();
  }
  addRow() {
    this.selectedApplication = '';
    this.selectedProcess = '';
    this.selectedService = '';
    this.addFlag = true;
    this.enableAddButtonFlag = false;
  }
  onPermissionChange(item, paramter_name) {
    item[paramter_name] = item[paramter_name] === 'Y' ? 'N' : 'Y';
  }
  editTick_click(index) {
    const data = this.filteredAuthValues[index];
    let body = {
      "V_AUTH_DSC": data.V_AUTH_DSC,
      "V_AUTH_CD": data.V_AUTH_CD,
      "V_AUTH_TYP": data.V_AUTH_TYP,
      "V_SRC_CD": this.V_SRC_CD_DATA.V_SRC_CD,
      "V_APP_CD": data.V_APP_CD,
      "V_PRCS_CD": data.V_PRCS_CD,
      "V_EXE_TYP": data.V_EXE_TYP,
      "V_ARTFCT_TYP": data.V_ARTFCT_TYP,
      "V_READ": data.V_READ,
      "V_UPDATE": data.V_UPDATE,
      "V_DELETE": data.V_DELETE,
      "V_CREATE": data.V_CREATE,
      "V_EXECUTE": data.V_EXECUTE,
      "V_USR_NM": this.optionalService.V_USR_NM,
      "V_COMMNT": '',
      "REST_Service": "Auth",
      "Verb": "POST"
    };
    this.http.post('https://'+this.domain_name+'/rest/v1/securedJSON', body)
      .subscribe(res => {
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      }, err => {
      });
  }
  delete_click(index) {
    const data = this.filteredAuthValues[index];
    this.http.delete(this.apiServcie.endPoints.securedJSON + `V_AUTH_CD=${data.V_AUTH_CD}&V_AUTH_TYP=${data.V_AUTH_TYP}&V_SRC_CD=${this.V_SRC_CD_DATA.V_SRC_CD}&REST_Service=Auth&Verb=DELETE`)
      .subscribe(res => {
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
      }, err => {
      });
  }
  onAddSubmit() {
    const data = this.authValueObj;
    let body = {
      "V_AUTH_DSC": data.V_AUTH_DSC,
      "V_AUTH_CD": data.V_AUTH_CD,
      "V_AUTH_TYP": this.radioSelected,
      "V_SRC_CD": this.V_SRC_CD_DATA.V_SRC_CD,
      "V_APP_CD": data.V_APP_CD,
      "V_PRCS_CD": data.V_PRCS_CD,
      "V_EXE_TYP": data.V_EXE_TYP,
      "V_ARTFCT_TYP": data.V_ARTFCT_TYP,
      "V_READ": data.V_READ,
      "V_UPDATE": data.V_UPDATE,
      "V_DELETE": data.V_DELETE,
      "V_CREATE": data.V_CREATE,
      "V_EXECUTE": data.V_EXECUTE,
      "V_USR_NM": this.optionalService.V_USR_NM,
      "V_COMMNT": '',
      "REST_Service": "Auth",
      "Verb": "POST"
    };
    let obs = this.http.post('https://'+this.domain_name+'/rest/v1/securedJSON', body)
    obs.subscribe(res => {
      this.addFlag = false;
      this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
    },
      err => {
      });
  }
  // showAuthData(authData) {
  //   this.authD.AUTH_DSC = authData.AUTH_DSC;
  //   this.authD.create_select = authData.CREATE == 'Y' ? true : false;
  //   this.authD.read_select = authData.READ == 'Y' ? true : false;
  //   this.authD.update_select = authData.UPDATE == 'Y' ? true : false;
  //   this.authD.delete_select = authData.DELETE == 'Y' ? true : false;
  //   this.authD.execute_select = authData.EXECUTE == 'Y' ? true : false;

  // }
  authData(auth) {
    this.authValues$.subscribe(data => {
      this.updateBtn = data.filter(s => s.V_AUTH_CD == auth).length > 0 ? true : false;
      // }
    });
  }
  // checkUncheck(str) {
  //   switch (str) {
  //     case 'Read': {
  //       this.authD.read_select = !this.authD.read_select;
  //       this.authD.READ = this.authD.read_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Delete': {
  //       this.authD.delete_select = !this.authD.delete_select;
  //       this.authD.DELETE = this.authD.delete_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Create': {
  //       this.authD.create_select = !this.authD.create_select;
  //       this.authD.CREATE = this.authD.create_select ? 'Y' : 'N';
  //       break;
  //     }
  //     case 'Update': {
  //       this.authD.update_select = !this.authD.update_select;
  //       this.authD.UPDATE = this.authD.update_select ? 'Y' : 'N';
  //       break;
  //     }
  //     default: {
  //       // statements;
  //       break;
  //     }
  //   }
  // }
  onItemSelect(event: any) {
    this.getFilterData(event);
    this.radioSelected = event;
    this.addFlag = false;
    this.authValueObj = new data();
  }
}

export class data {
  V_AUTH_CD: string;
  V_AUTH_TYP: string;
  V_SRC_CD: string;
  V_APP_CD: string;
  V_PRCS_CD: string;
  V_EXE_TYP: string;
  V_USR_GRP_CD: string;
  V_READ: string;
  V_UPDATE: string;
  V_DELETE: string;
  V_CREATE: string;
  V_EXECUTE: string;
  V_USR_NM: string;
  V_COMMNT: string;

  AUTH_ID: number;
  APP_ID: number;
  ROLE_ID: string;
  V_AUTH_DSC: string;
  V_ARTFCT_TYP: string;
  id: number;
  V_AUTH_FLD: number;
  is_selected: boolean;
  is_selected_role: boolean;
}
