import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../../services/globals';
import { ApiService } from '../../../../service/api/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../../execute/bpmn-viewer';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { InputOutputElementComponent } from 'src/app/shared/components/input-output-element/input-output-element.component';
import { DeviceDetectorService } from 'ngx-device-detector';
export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
  // inputs: ['parentapp', 'parentpro', 'file_path'],
  providers: [DatePipe]
})
export class MonitorComponent implements OnInit, OnDestroy {

  parentapp: string;
  parentpro: string;
  bpmnTemplate: any;
  file_path: any;
  ctrl_variables: any;
  private viewer: any;
  private downloadUrl: string;
  // dateTimeList: Food[] = [
  //   { value: 'steak-0', viewValue: 'Steak' },
  //   { value: 'pizza-1', viewValue: 'Pizza' },
  //   { value: 'tacos-2', viewValue: 'Tacos' }
  // ];
  is_more = false;
  currentDate: any = new Date();
  fromDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
  toDate = new Date();
  apiUrl: any;
  apiJSONUrl: any;
  numbersOfTransactions = 3;
  V_SRC_CD: string = '';
  V_USR_NM: string = '';
  PRCS_TXN_ID: any = [];
  StartDateTime: any = [];
  USR_NM: any = [];
  V_APP_ID: any = [];
  V_PRCS_ID: any = [];
  V_SRC_ID: any = [];
  selected_V_APP_ID: any = '';
  selected_V_PRCS_ID: any = '';
  selected_V_SRC_ID: any = '';
  selected_USR_NM: any = '';
  selectedInstance: any = '';
  selectedUserName: any = '';
  selectedAppProcess$: Subscription;
  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  public expandPanel: boolean = true;
  public isMobile: boolean = false;
  public isTablet: boolean = false;
  public opened: boolean = false;
  constructor(public http: Http, public toastrService: ToastrService, public optionalService: OptionalValuesService,
    public httpClient: HttpClient, public datePipe: DatePipe,
    public deviceService: DeviceDetectorService,
    public apiService: ApiService, public dialog: MatDialog) {
    this.selectedAppProcess$ = this.optionalService.selectedAppPrcoessValue.subscribe(res => {
      if (res) {
        this.parentapp = res.app;
        this.parentpro = res.process;
        this.file_path = res.file_path;
      }
    })
  }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.expandPanel = this.deviceService.isDesktop();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.optionalService.selecetedProcessTxnValue.next(null);
    this.apiUrl = this.apiService.endPoints.secure;
    this.apiJSONUrl = this.apiService.endPoints.securedJSON;
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getProcessStatus();
    // this.downloadBpmn();
  }
  ngOnDestroy() {
    this.selectedAppProcess$.unsubscribe();
  }

  onDateChange() {
    this.getProcessStatus();
  }
  getProcessStatus() {
    this.httpClient.get(this.apiUrl + 'V_SRC_CD=' + this.V_SRC_CD +
      '&V_APP_CD=' + this.parentapp + '&V_PRCS_CD=' + this.parentpro + '&V_USR_NM=' +
      this.V_USR_NM + '&StartDatetime=' + this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss') + '&EndDatetime=' + this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss') + '&NumbersOfTransactions=' + this.numbersOfTransactions +
      '&REST_Service=Process_Instances&Verb=GET').subscribe(res => {
        if (Object.keys(res).length) {
          console.log('res', res);
          this.PRCS_TXN_ID = res['PRCS_TXN_ID'];
          this.StartDateTime = res['LST_UPD_DT_TM'];
          this.USR_NM = res['USR_NM'];
          this.V_APP_ID = res['V_APP_ID'];
          this.V_PRCS_ID = res['V_PRCS_ID'];
          this.V_SRC_ID = res['V_SRC_ID'];
          if (this.PRCS_TXN_ID.length) {
            this.selected_V_APP_ID = this.V_APP_ID[0];
            this.selected_V_PRCS_ID = this.V_PRCS_ID[0];
            this.selected_USR_NM = this.USR_NM[0];
            this.selected_V_SRC_ID = this.V_SRC_ID[0];
            this.selectedInstance = this.PRCS_TXN_ID[0];
            this.selectedUserName = this.USR_NM[0];
            this.getServicesInstances(0);
            let obj = {
              'V_APP_ID': this.selected_V_APP_ID,
              'V_PRCS_ID': this.selected_V_PRCS_ID,
              'V_PRCS_TXN_ID': this.selectedInstance,
              'V_SRC_ID': this.selected_V_SRC_ID,
              'USR_NM': this.selected_USR_NM
            }
            this.optionalService.selecetedProcessTxnValue.next(obj);
          }
        }
      });
  }

  onInstanceChange(instance) {
    if (this.PRCS_TXN_ID.length) {
      this.PRCS_TXN_ID.forEach((element, index) => {
        if (element === instance.value) {
          this.selectedUserName = this.USR_NM[index];
          this.getServicesInstances(index);
        }
      });
    }
  }

  getServicesInstances(index) {
    this.selectedInstance = this.PRCS_TXN_ID[index];
    let obj = {
      'V_APP_ID': this.selected_V_APP_ID,
      'V_PRCS_ID': this.selected_V_PRCS_ID,
      'V_PRCS_TXN_ID': this.selectedInstance,
      'V_SRC_ID': this.selected_V_SRC_ID,
      'USR_NM': this.selected_USR_NM
    }
    this.optionalService.selecetedProcessTxnValue.next(obj);
  }
  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }
}
export class InstanceElementList {
  EXCPN_MSG: any;
  INS_DT_TM: any;
  LEVEL: any;
  LST_UPD_DT_TM: any;
  PRCS_CD: any;
  PRDCR_SRVC_CD: any;
  SRVC_INPUT: any;
  SRVC_OUTPUT: any;
  TXN_ID: any;
  TXN_STS: any;
}