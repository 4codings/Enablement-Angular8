import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
// import { FieldConfig } from '../../dynamic-form/models/field-config.interface';
// import { DynamicFormComponent } from '../../dynamic-form/containers/dynamic-form/dynamic-form.component';
import { FormBuilder } from '@angular/forms';
import { HostListener } from '@angular/core';
import { Injectable, ViewChild, ViewChildren } from '@angular/core';
import { EnduserComponent } from '../enduser.component';

import { Form_data } from './Form_data';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { CommonUtils } from '../../../common/utils';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ApiService } from 'src/app/service/api/api.service';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { GetMessageService } from 'src/app/services/get-message.service';
import { Globals } from 'src/app/services/globals';
import { Globals2 } from 'src/app/service/globals';
import { HomeComponent } from '../../home.component';
import { ConfigServiceService, IFormFieldConfig } from 'src/app/services/config-service.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { OptionalValuesService, ProcessObservable, ServiceObservable } from 'src/app/services/optional-values.service';

export class ReportData {
  public RESULT: string;
  public V_EXE_CD: string[];
  constructor() {
  }
}
@Injectable()
@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  // styleUrls: ['./execute.component.css'],

})
@Injectable()
export class ExecuteComponent implements OnInit, OnDestroy {

  // domain_name = this.globals.domain_name;
  // 10th April
  // domain = this.globals.domain;
  // suffix = this.globals.suffix;
  // path = this.globals.Path;
  // version = this.globals.version;
  private apiUrlGetInsecure = this.apiservice.endPoints.insecure;
  private apiUrlGetSecure = this.apiservice.endPoints.secure;

  private aptUrlPost_report_new = this.apiservice.endPoints.secureProcessReport;
  private aptUrlPost_report = this.apiservice.endPoints.insecureProcessReport;

  private aptUrlPost_start_secure = this.apiservice.endPoints.secureProcessStart;
  private aptUrlPost_start = this.apiservice.endPoints.insecureProcessStart;

  SL_APP_CD = '';
  SL_PRC_CD = '';
  screenHeight = 0;
  screenWidth = 0;
  mobileView = false;
  desktopView = true;
  //----------------GET APP CODE
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  get_cxn = true;
  APP_CD = [];
  PRC_CD = [];
  PRCS_DATA = [];
  PRCS_CD = [];
  k = 0;
  ts = {};
  SL_PRCS_CD = '';
  SRVC_DATA = [];
  SRVC_CD = [];
  SL_SRVC_CD = '';
  deployTableDT: any[] = [];
  deployData: any[];
  ID_DATA = [];
  APP_ID = [];
  PRCS_ID = [];
  SRVC_ID = [];
  SRC_ID = [];
  SL_APP_ID = '';
  SL_PRCS_ID = '';
  SL_SRVC_ID = '';
  SL_SRC_ID = '';
  deployService = [];
  countonerror = [];
  options: any = {};
  Data_Keys: string[];
  Data_Values: any[] = [];
  Data_labels: any[] = [];
  applicationViewFlag = false;
  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;

  applicationValuesObservable = [];
  applicationValues = [];
  processValues = [];
  serviceValues = [];
  processValuesObservable: ProcessObservable[] = [];
  serviceValuesObservable: ServiceObservable[] = [];
  //-------Balraj Code--------
  // =========== CHARTS FLAGS ( Toggle these to display or hide charts at loading page )=========
  /*show_PIE = false;
  show_BAR = false;
  show_Gantt = false;
  show_ALL = false;
  show_SM_PIE = false;*/
  //Charts flags implemented in control-variable.json file
  // ==================================

  //-------Balraj Code--------

  ResetOptimised = false;
  Lazyload = false;

  check_data = {};
  executedata = {};
  _backgroundColor = 'rgba(34,181,306,0.2)';
  // Application_box:boolean=true;
  // Application_label:boolean=false;
  // Process_box:boolean=false;
  // Process_label:boolean=false;
  Service_box: boolean;
  Schedule_btn = false;
  Execute_Now_btn = false;
  //// 1) call application CD
  selectedapp: string = null;
  selectedprcs: string = null;
  selectedEmoji: string;
  data_form: Form_data;
  form_dl_data: any[] = [];
  displayedNames = ['Service', 'Platform', 'Machine', 'Limited Job', 'Instances', 'Limited', 'Capacity', 'Rating', 'Used Capacity', 'Limited Machine Use', 'Dummy', 'Status', 'State', 'Cxn Type'];

  displayedColumns = ['Service', 'Platform', 'Machine', 'Lim_Job', 'Instances', 'Limited', 'Capacity', 'Rating', 'Used_Cap', 'Lim_Mach_Use', 'Dummy', 'Status', 'State', 'Cxn_Type'];
  dataSource = new MatTableDataSource();
  fieldConfig: { [key: string]: IFormFieldConfig } = {};
  @ViewChild('processForm') processForm: any;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }
  offset(el) {
    const rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }
  navigationSubscription;
  constructor(private router: Router, private http: HttpClient, private https: Http, private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService, public dialog: MatDialog, private app: HomeComponent,
    private PFrame: EnduserComponent, private roll: RollserviceService, public snackBar: MatSnackBar,
    private wSocket: WebSocketService, private msg: GetMessageService, private globals: Globals, private globarUser: Globals2,
    private apiservice: ApiService, private activatedRoute: ActivatedRoute, private optionalService: OptionalValuesService
  ) {
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValuesObservable = data;
        this.applicationValues = (data.sort(function (a, b) { return a.localeCompare(b); }));
        if (this.applicationValues.length == 1) {
          this.SL_APP_CD = this.applicationValues[0];
          this.applicationViewFlag = false;
          if (!this.processValues.length) {
            this.optionalService.getProcessOptionalValue(this.SL_APP_CD);
          } else {
            this.functionCommonApp();
          }
        } else {
          this.applicationViewFlag = true;
        }
        if (this.selectedapp != null && this.app.START == false && this.app.selected_APPLICATION != 'ALL') {
          this.SL_APP_CD = this.selectedapp;
          if (this.desktopView) {
            if (!this.processValues.length) {
              this.optionalService.getProcessOptionalValue(this.SL_APP_CD);
            } else {
              this.functionCommonApp();
            }
          } else if (this.mobileView) {
            if (!this.processValues.length) {
              this.optionalService.getProcessOptionalValue(this.SL_APP_CD);
            } else {
              this.functionCommonApp();
            }
          }
        }
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValuesObservable = data;
        if (this.processValuesObservable.length) {
          this.processValues = [];
          if (this.SL_APP_CD !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.SL_APP_CD) {
                this.processValues = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
                this.functionCommonProcess();
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
          if (this.SL_APP_CD !== '' && this.SL_PRCS_CD !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.SL_APP_CD && ele.process === this.SL_PRCS_CD) {
                this.serviceValues = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
                this.functionCommonService();
              }
            });
          }
        }
      }
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
        this.initialiseInvites();
      }
    });
    this.onResize();
  }

  functionCommonApp() {
    var flag = 0;
    this.processValues.forEach(ele => {
      if (ele.app === this.SL_APP_CD) {
        this.processValues = ele.process;
        flag = 1;
      }
    });
    if (!flag) {
      this.optionalService.getProcessOptionalValue(this.SL_APP_CD);
    }
  }
  functionCommonProcess() {
    if (!this.applicationViewFlag) {
      let defaultSelectedProcess = [];
      defaultSelectedProcess = this.processValues[0];
      this.getServiceCode(defaultSelectedProcess);
      this.fooo1(this.processValues[0]);
      this.Execute_AP_PR();
    }
    //this.app.PRC_CD_GLOBAL=this.PRC_CD;
    //(this.PRC_CD);
    //(V_APP_CD);
    if (this.processValues.length == 1) {
      this.SL_PRC_CD = this.processValues[0];
      // this.Process_box=false;
      // this.Process_label=true;

      this.data_form = new Form_data(this.SL_APP_CD, this.SL_PRC_CD);

      // this.Execute_AP_PR();getDropDownListValue

    }
  }
  functionCommonService() {
    this.SRVC_CD = this.serviceValues;
    //(this.SRVC_CD);
    this.getIdCode();
  }
  initialiseInvites() {
    this.ngOnInit();
  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  repeatProcess() {
    this.router.navigateByUrl('repeat', { skipLocationChange: true });
    this.dialog.closeAll();
  }
  openEmojiDialog() {
    const dialog = this.dialog.open(DialogScheduleComponent, {
      height: '150px',
      width: '300px'
    });

    dialog.afterClosed()
      .subscribe(selection => {
        if (selection) {
          this.selectedEmoji = selection;
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  fooo(u) {
    if (this.mobileView) {
      u = u;
    }
    if (u == null) { } else {
      this.SL_APP_CD = u;
      this.selectedapp = u;
      this.app.selected_APPLICATION = u;
      this.app.selected_PROCESS = 'ALL';
      this.app.selected_SERVICE = 'ALL';
      this.selectedprcs = null;
      this.getAppCode();
    }
  }
  position_datepicker(event) {
    /*    var div = document.querySelector('div');
        var divOffset = this.offset(div);
        (divOffset.left, divOffset.top);*/
    ('Hello');
  }
  //_____________________________1_____________________
  getAppCode() {
    if (!this.applicationValuesObservable.length) {
      this.optionalService.getApplicationOptionalValue();
    }
    // this.data.getAppCode(this.V_SRC_CD).subscribe(res => {
    //   this.APP_CD = res.json();
    //   //this.app.APP_CD_GLOBAL=this.APP_CD;
    //   //------------get lenght
    //   (this.APP_CD);

    //   if (this.APP_CD['APP_CD'].length == 1) {
    //     //hide the application select box
    //     this.SL_APP_CD = this.APP_CD['APP_CD'][0];
    //     this.applicationViewFlag = false;
    //     this.getProcessCD(this.SL_APP_CD);
    //     // this.Application_label=true;

    //   } else {
    //     this.applicationViewFlag = true;
    //   }
    //   //("START= "+this.app.START+"; selectedapp="+this.selectedapp);
    //   if (this.selectedapp != null && this.app.START == false && this.app.selected_APPLICATION != 'ALL') {
    //     //("calling getProcess");
    //     this.SL_APP_CD = this.selectedapp;
    //     if (this.desktopView) {
    //       this.getProcessCD(this.selectedapp);
    //     } else if (this.mobileView) {
    //       this.getProcessCD({ value: this.selectedapp });
    //     }
    //   }

    // });
  }

  getProcessCD(V_APP_CD) {
    if (this.mobileView) {
      V_APP_CD = V_APP_CD;
      (V_APP_CD);
    }
    if (V_APP_CD == null) {

    } else {
      this.b = false;
      this.Execute_Now_btn = false;
      this.Schedule_btn = false;
      this.Data = [];
      if (!this.processValuesObservable.length) {
        this.optionalService.getProcessOptionalValue(V_APP_CD);
      } else {
        let flag = 0;
        this.processValuesObservable.forEach(ele => {
          if (ele.app === V_APP_CD) {
            this.processValues = [];
            this.processValues = ele.process.sort(function (a, b) { return a.localeCompare(b); });
            flag = 1;
            this.functionCommonProcess();
          }
        });
        if (!flag) {
          this.optionalService.getProcessOptionalValue(V_APP_CD);
        }
      }
      // this.Process_box=true;
      // this.Process_label=false;

      // insecure
      // this.apiservice.requestInSecureApi(this.apiUrlGetInsecure + 'V_APP_CD=' + V_APP_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=UserProcesses&Verb=GET', 'get').subscribe(res => {
      //   this.PRC_CD = res.json();
      //   //this.app.PRC_CD_GLOBAL=this.PRC_CD;
      //   //(this.PRC_CD);
      //   //(V_APP_CD);
      //   if (!this.applicationViewFlag) {
      //     let defaultSelectedProcess = [];
      //     defaultSelectedProcess = this.PRC_CD['PRCS_CD'][0];
      //     this.getServiceCode(defaultSelectedProcess);
      //     this.fooo1(this.PRC_CD['PRCS_CD'][0]);
      //     this.Execute_AP_PR();
      //   }
      //   if (this.PRC_CD['PRCS_CD'].length == 1) {
      //     this.SL_PRC_CD = this.PRC_CD['PRCS_CD'][0];
      //     // this.Process_box=false;
      //     // this.Process_label=true;

      //     this.data_form = new Form_data(this.SL_APP_CD, this.SL_PRC_CD);

      //     // this.Execute_AP_PR();getDropDownListValue

      //   }
      // });

      // secure
      // this.apiservice.requestSecureApi(this.apiUrlGetSecure + 'V_APP_CD=' + V_APP_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&REST_Service=UserProcesses&Verb=GET', 'get').subscribe(res => {
      //   this.PRC_CD = res.json();
      //   if (!this.applicationViewFlag) {
      //     let defaultSelectedProcess = [];
      //     defaultSelectedProcess = this.PRC_CD['PRCS_CD'][0];
      //     this.getServiceCode(defaultSelectedProcess);
      //     this.fooo1(this.PRC_CD['PRCS_CD'][0]);
      //     this.Execute_AP_PR();
      //   }
      //   //this.app.PRC_CD_GLOBAL=this.PRC_CD;
      //   //(this.PRC_CD);
      //   //(V_APP_CD);
      //   if (this.PRC_CD['PRCS_CD'].length == 1) {
      //     this.SL_PRC_CD = this.PRC_CD['PRCS_CD'][0];
      //     // this.Process_box=false;
      //     // this.Process_label=true;

      //     this.data_form = new Form_data(this.SL_APP_CD, this.SL_PRC_CD);

      //     // this.Execute_AP_PR();getDropDownListValue

      //   }
      // });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////


  UNIQUE_ID = [];
  SL_UNIQUE_ID = '';
  p: number;
  q: number;
  c: number;
  getServiceCode(...args: any[]) {
    this.options = {};
    let V_PRCS_CD = null;
    if (args.length > 0) {
      V_PRCS_CD = args[0];
    }
    if (args.length > 1) {
      this.SL_APP_CD = args[1];
    }
    // if(this.get_cxn==false){
    if (this.mobileView) {
      V_PRCS_CD = V_PRCS_CD;
    }
    if (V_PRCS_CD == null) {

    } else {
      this.b = false;
      this.Execute_Now_btn = true;
      this.Schedule_btn = true;
      this.SRVC_CD = [];
      this.SL_PRCS_CD = V_PRCS_CD;
      this.selectedprcs = V_PRCS_CD;
      if (!this.serviceValuesObservable.length) {
        this.optionalService.getServiceOptionalValue(this.SL_APP_CD, this.SL_PRCS_CD);
      } else {
        let flag = 0;
        this.serviceValuesObservable.forEach(ele => {
          if (ele.app === this.SL_APP_CD && ele.process === this.SL_PRCS_CD) {
            this.serviceValues = [];
            this.serviceValues = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
            flag = 1;
            this.functionCommonService();
          }
        });
        if (!flag) {
          this.optionalService.getServiceOptionalValue(this.SL_APP_CD, this.SL_PRCS_CD);
        }
      }
      // this.data.serviceCode(this.SL_APP_CD, this.SL_PRCS_CD).subscribe(res => {
      //   //(res.json());
      //   this.SRVC_DATA = res.json();
      //   this.SRVC_CD = this.SRVC_DATA['SRVC_CD'];

      //   //(this.SRVC_CD);
      //   this.getIdCode();
      // });
    }
    // }

    // this.Execute_Now_btn = true;
    // this.Schedule_btn = true;
  }
  getIdCode() {
    this.ID_DATA = [];
    this.SRVC_DATA = [];
    // ("getidcode function");
    this.deployService = [];
    this.p = 0;
    this.c = 0;
    this.q = 0;
    if (this.ctrl_variables && this.ctrl_variables.checkDeployement) {
      for (let j = 0; j < this.SRVC_CD.length; j++) {
        this.SL_SRVC_CD = this.SRVC_CD[j];
        // (this.SL_SRVC_CD);
        this.data.getID(this.SL_APP_CD, this.SL_PRCS_CD, this.SL_SRVC_CD).subscribe(res => {
          // //(res.json());
          this.SRVC_DATA = res.json();
          this.SRVC_CD.push(this.SRVC_DATA['SRVC_CD']);
          // //(this.SRVC_CD);

          this.executedata = { SL_APP_CD: this.SL_APP_CD, SL_PRC_CD: this.SL_PRC_CD };

          this.StorageSessionService.setCookies('executedata', this.executedata);
          this.ID_DATA = res.json();
          this.StorageSessionService.setCookies('iddata', this.ID_DATA);
          (this.ID_DATA);
          this.APP_ID = this.ID_DATA['V_APP_ID'];

          this.PRCS_ID = this.ID_DATA['V_PRCS_ID'];


          this.SRC_ID = this.ID_DATA['V_SRC_ID'];

          this.SRVC_ID = this.ID_DATA['V_SRVC_ID'];
          this.UNIQUE_ID = this.ID_DATA['V_UNIQUE_ID'];

          this.getDeployment();
        });
      }

    }

  }


  getDeployment() {
    this.deployService = [];
    this.deployData = [];
    //("getDeployment function");
    //(this.SL_SRVC_ID);
    this.data.getDeployStatus(this.UNIQUE_ID, this.SRC_ID, this.APP_ID, this.PRCS_ID, this.SRVC_ID).subscribe(res => {
      ("Services");
      (res.json());
      this.deployData = res.json();

      if (this.deployData['CXN_ID'].length === 0) {
        //("inside if");
        this.deployService[this.p] = this.SRVC_CD[this.q];
        //(this.deployService[this.p]);

        //         for(let h=0;h<this.deployService.length;h++){
        //         this.http.get<data>(this.apiUrlGet+"V_PRDCR_SRC_CD="+this.V_SRC_CD+"&V_PRDCR_APP_CD="+this.SL_APP_CD+"&V_PRDCR_PRCS_CD="+this.SL_PRC_CD+"&V_PRDCR_SRVC_CD="+this.deployService[h]+"&V_DIRECTION=A&REST_Service=Orchestration&Verb=GET").subscribe(
        //           res=>{
        // //(res);
        // this.countonerror=res.CONT_ON_ERR_FLG;
        // });
        // }
        // if(this.countonerror.length===0){

        //         this.deployService.splice(this.deployService.indexOf(this.deployService[h]), 1);
        // }

        this.p++;
        //this.b = false;
        // this.Service_box = true;
        // this.Execute_Now_btn = true;
        // this.Schedule_btn = true;
        // this.snackBar.open("Cannot Execute because of Undeployed Services","", {
        //   duration: 3000,
        // });


        this.q++;
      }
      // else {
      //   this.b = false;
      //   this.Service_box = true;
      //   this.Execute_Now_btn = false;
      //   this.Schedule_btn = false;

      // }


    });









  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  //--------------this is for report table
  Execute_both() {
    this.getAppCode();
    this.getProcessCD(this.APP_CD);
  }
  //________________________________CLOSE 2___________________________
  fooo1(u) {
    if (this.mobileView) {
      u = u;
    }
    if (u == null) {

    } else {
      this.SL_PRC_CD = u;
      this.app.selected_PROCESS = u;
    }

  }
  b = false;
  result: any = {};
  Data: any;
  Data1: any[] = [];
  myFormData;
  searchResult: any[];
  Execute_AP_PR(...schd_args: any[]) {
    this.options = {};
    //-----------------schd_args implemented for reuse from schedule component: ABHISHEK ABHINAV--------------------------------//
    if (schd_args.length > 0) {
      this.SL_APP_CD = schd_args[0];
    }
    if (schd_args.length > 1) {
      this.SL_PRC_CD = schd_args[1];
    }

    this.b = false;
    this.Data = [];

    let currentKey;
    let currentVal;
    let ParametrValue: any[];
    let ParameterName: any[];
    let FormData: any[];
    const result: any = {};

    //this.https.get(this.apiUrlGet + "V_APP_CD=" + this.SL_APP_CD + "&V_PRCS_CD=" + this.SL_PRC_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ProcessParameters&Verb=GET").subscribe(

    //------- Changed the Rest call for Parameters (By : Balraj Saini) Added Two flags --------

    // insecure
    // this.apiservice.requestInSecureApi(this.apiUrlGetInsecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET', 'get').subscribe(
    //   res => {
    //     (res.json());
    //     (this.apiUrlGetInsecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET');
    //     FormData = res.json();
    //     const ref = { disp_dyn_param: false };
    //     const got_res = this.data.exec_schd_restCall(FormData, ref);
    //     this.result = got_res.Result;
    //     this.Data = got_res.Data;
    //     this.b = got_res.B;
    //     this.k = got_res.K;
    //     this.fieldConfig = this.data.prepareAndGetFieldConfigurations(FormData);
    //     this.Data_Keys = [];
    //     this.Data_Values = [];
    //     this.Data_labels = [];
    //     this.labels_toShow();
    //     this.options = {};
    //     for (let i = 0; i < this.Data_Keys.length; i++) {
    //       if (this.Data[i].name === this.Data_labels[i] && this.Data[i].hasOptions && this.Data[i].hasOptions === 'Y') {
    //         this.getOptional_values(this.Data_Keys[i], this.Data_labels[i]);
    //       }
    //     }
    //   });


    // secure
    this.apiservice.requestSecureApi(this.apiUrlGetSecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET', 'get').subscribe(
      res => {
        (res.json());
        (this.apiUrlGetInsecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET');
        FormData = res.json();
        const ref = { disp_dyn_param: false };
        const got_res = this.data.exec_schd_restCall(FormData, ref);
        this.result = got_res.Result;
        this.Data = got_res.Data;
        this.b = got_res.B;
        this.k = got_res.K;
        this.fieldConfig = this.data.prepareAndGetFieldConfigurations(FormData);
        this.Data_Keys = [];
        this.Data_Values = [];
        this.Data_labels = [];
        this.labels_toShow();
        this.options = {};
        for (let i = 0; i < this.Data_Keys.length; i++) {
          if (this.Data[i].name === this.Data_labels[i] && this.Data[i].hasOptions && this.Data[i].hasOptions === 'Y') {
            this.getOptional_values(this.Data_Keys[i], this.Data_labels[i]);
          }
        }
      });

    /*
    ParametrValue = FormData['PARAM_VAL'];
    ParameterName = FormData['PARAM_NM'];


    for (let i = 0; i < ParametrValue.length; i++) {
      //-----------Balraj Code---------
      currentVal = ParametrValue[i].split(',');
      currentKey = ParameterName[i];
      (currentKey);
      result[currentKey] = currentVal;
      if (ParameterName[i].includes('Date') && !(ParameterName[i].includes('DateTime'))) {
        this.Data[i] = {
          type: 'date',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]

        };

      }
      else if (ParameterName[i].charAt(0) == '?') {
        this.Data[i] = {
          type: 'radio',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].charAt(ParameterName[i].length - 1) == '?') {
        this.Data[i] = {
          type: 'checkbox',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].includes('Time') && !(ParameterName[i].includes('DateTime'))) {
        this.Data[i] = {
          type: 'time',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].includes('DateTime')) {
        this.Data[i] = {
          type: 'datetime',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].includes('Password')) {
        this.Data[i] = {
          type: 'password',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].includes('Range')) {
        this.Data[i] = {
          type: 'range',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else if (ParameterName[i].includes('Color')) {
        this.Data[i] = {
          type: 'color',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }
      else {
        this.Data[i] = {
          type: 'input',
          name: Object.keys(result)[i],
          value: Object.values(result)[i][0],
          placeholder: Object.keys(result)[i]
        };
      }*/
    //---------Balraj Code--------

    // if(ParameterName[i].includes('Date')&& !(ParameterName[i].includes('DateTime'))){
    //   this.Data[i] = {
    //     type: 'date',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),

    //   };

    // }
    // else if(ParameterName[i].charAt(0)=='?'){
    //   this.Data[i] = {
    //     type: 'radio',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].charAt(ParameterName[i].length-1)=='?'){
    //   this.Data[i] = {
    //     type: 'checkbox',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].includes('Time') && !(ParameterName[i].includes('DateTime'))){
    //   this.Data[i] = {
    //     type: 'time',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].includes('DateTime')){
    //   this.Data[i] = {
    //     type: 'datetime',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].includes('Password')){
    //   this.Data[i] = {
    //     type: 'password',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].includes('Range')){
    //   this.Data[i] = {
    //     type: 'range',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else if(ParameterName[i].includes('Color')){
    //   this.Data[i] = {
    //     type: 'color',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),
    //   };
    // }
    // else{
    //   this.Data[i] = {
    //     type: 'input',
    //     name: ParameterName[i],
    //     value: ParametrValue[i],
    //     placeholder: ParameterName[i].split('_').join(' '),

    //   };
    // }




    //("Parameter names :"+this.Data);
    //("Parameter names :"+this.Data['value']);

  }

  // 10th April
  labels_toShow(): any {
    //----------------Lables to Show---------------//
    this.Data_Keys = Object.keys(this.result);
    for (let i = 0; i < this.Data_Keys.length; i++) {
      this.Data_Values.push(this.result[this.Data_Keys[i]]);
      // if (this.RVP_Keys[i].substring(0, 2) == "V_") {

      // } else {
      this.Data_labels.push(this.Data_Keys[i]);
      // }
    }
  }
  FilterAutoValue: any;
  Update_value(v: any, n: any) { //v=value and n=paramter name
    this.FilterAutoValue = v;
    const option = this.setHeaders();
    // secure
    this.apiservice.requestSecureApi(this.apiUrlGetSecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&V_PARAM_NM=' + n + '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH', 'get').subscribe(
      res => {

      }
    );

    // insecure
    // this.apiservice.requestInSecureApi(this.apiUrlGetInsecure + 'V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&V_PARAM_NM=' + n + '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH', 'get').subscribe(
    //   res => {

    //   }
    // );
  }
  Update_value1(v: any) { //v=value and n=paramter name
    // console.log('keyup', v);
  }
  filteredOptions: Observable<string[]>;

  getListOptions(parameterName: string) {
    if (CommonUtils.isValidValue(this.result[parameterName])) {
      return Object.values(this.result[parameterName]);
    } else {
      return [];
    }
  }

  getDropDownListValue(e: any) {

    //---------Balraj Code--------
    this.searchResult = [];
    (this.result[e]);

    this.searchResult = Object.values(this.result[e]);
    //---------Balraj Code--------


    this.http.get(this.apiUrlGetInsecure + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + this.SL_APP_CD + "&V_PRCS_CD=" + this.SL_PRC_CD + "&V_PARAM_NM=" + e + "&V_SRVC_CD=" + this.SL_SRVC_CD + "&REST_Service=ProcessParametersOptions&Verb=GET")
      .subscribe(
        res => {
          this.searchResult = res[e];
          this.app.loading = false;
        }
      );


  }

  //____________CLOSE APP CODE FUN
  add() {
    for (let i = 0; i <= this.k; i++) {
      if (this.Data[i].value != '' && this.Data[i].value != null) {
        this.ts[this.Data[i].name] = this.Data[i].value;
      }
    }
    //(this.ts);
    this.StorageSessionService.setCookies('ts', this.ts);
  }
  Execute_res_data: any;
  Execute_Now() {
    if (this.processForm.valid) {
      const body = {
        'V_APP_CD': this.SL_APP_CD,
        'V_PRCS_CD': this.SL_PRC_CD,
        'V_SRVC_CD': 'START',
        'V_SRC_CD': this.V_SRC_CD,
        'V_USR_NM': this.V_USR_NM

      };

      Object.assign(body, this.ts);
      (body);
      // 'https://' + this.domain_name + '/rest/Process/Start'
      const url = this.apiservice.securedApiUrl + '/secured/Process/Start';

      const options = this.setHeaders();

      // secure
      this.https.post(this.aptUrlPost_start_secure, body, this.apiservice.setHeaders())
        .subscribe(res => {
          // console.log('start');
          this.executedata = { SL_APP_CD: this.SL_APP_CD, SL_PRC_CD: this.SL_PRC_CD };

          this.StorageSessionService.setCookies('executedata', this.executedata);
          this.Execute_res_data = res.json();
          this.StorageSessionService.setCookies('executeresdata', this.Execute_res_data);
          // (this.Execute_res_data);
          // 6th may made false to true
          this.PFrame.display_page = true;
          // (this.Execute_res_data);
          this.GenerateReportTable();
        });

      // 10th April

      // insecure
      // this.https.post(this.aptUrlPost_start, body).subscribe(
      //   res => {

      //     ("response of start call");
      //     (res);
      //     //
      //     this.executedata = { SL_APP_CD: this.SL_APP_CD, SL_PRC_CD: this.SL_PRC_CD };

      //     this.StorageSessionService.setCookies('executedata', this.executedata);
      //     this.Execute_res_data = res.json();
      //     this.StorageSessionService.setCookies('executeresdata', this.Execute_res_data);
      //     // (this.Execute_res_data);
      //     this.PFrame.display_page = false;
      //     // (this.Execute_res_data);
      //     this.GenerateReportTable();
      //   }
      // );
    }

  }
  /*
 Call API until report data is not come
 */
  repeat: any = 0;
  repeatCallTable(data: any): void {
    if (data && this.repeat < this.ctrl_variables.repeat_count) {
      this.repeat++;
      this.GenerateReportTable();
    } else {
      this.repeat = 0;
      this.router.navigate(["/End_User/Execute"], { skipLocationChange: true });
    }
  }

  /*
  10th April
  retruns options with token headers
  */
  setHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    const options = new RequestOptions({ headers: headers });
    return options;
  }
  //@override ReportGenerate interface
  public report: ReportData = new ReportData;
  GenerateReportTable() {
    //("in GenerateReportTable");
    if (!this.app.loadingCharts)
      this.app.loadingCharts = true;
    if (this.app.fromNonRepForm) {
      //this.PFrame.display_page = false;
      this.app.fromNonRepForm = false;
      this.Execute_res_data = this.StorageSessionService.getCookies('executeresdata');
    }
    // this.app.text_mgs = 'Loading Table..';
    // "&V_DSPLY_WAIT_SEC=100&V_MNL_WAIT_SEC=180&REST_Service=Report&Verb=GET
    const body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      // V_UNIQUE_ID: this.Execute_res_data['V_UNIQUE_ID'],
      // V_APP_ID: this.Execute_res_data['V_APP_ID'],
      // V_PRCS_ID: this.Execute_res_data['V_PRCS_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      // V_NAV_DIRECTION: this.Execute_res_data['V_NAV_DIRECTION'],
      // V_TIMEOUT_SEC: this.globals.TIMEOUT_IN_SECONDS,
      V_USR_ID: JSON.parse(sessionStorage.getItem('u')).USR_ID,
      // V_DSPLY_WAIT_SEC: 100,
      // V_MNL_WAIT_SEC: 180,
      REST_Service: 'Report',
      Verb: 'POST'
    };
    (body);
    // 10th April aaded options
    const options = this.setHeaders();

    // secure

    this.https.post(this.aptUrlPost_report_new, body, this.apiservice.setHeaders())
      .subscribe(
        (res: any) => {
          if (res._body !== '{}') {
            this.globals.Report = JSON.parse(res._body)
            // console.log("abdalla here", res.json());

            this.StorageSessionService.setCookies('report_table', res.json());
            this.check_data = res.json();
            this.app.loadingCharts = false;
            this.report = res.json();

            (this.report);

            (this.report.RESULT);
            (res.json());
            var timeout = res.json().RESULT.toString().substring(0, 7) == "TIMEOUT";
            (timeout);
            /*const dt = JSON.stringify(res);
            (dt);*/
            if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
              this.repeatCallTable(true);
            } else if (this.report.RESULT == 'TABLE') {

              this.router.navigateByUrl('/End_User/ReportTable', { skipLocationChange: true });
            } else if (this.report.RESULT[0] == 'INPUT_ARTFCT_TASK') {

              this.router.navigateByUrl('/End_User/InputArtForm', { skipLocationChange: true });

            } else if (CommonUtils.isValidValue(this.report.V_EXE_CD)) {

              if (this.report.RESULT[0] == 'NONREPEATABLE_MANUAL_TASK') {
                // non-Repeatable NonRepeatForm
                this.router.navigateByUrl('/End_User/NonRepeatForm', { skipLocationChange: true });
                //this.router.navigateByUrl('Forms', { skipLocationChange: true });

              } else if (this.report.RESULT[0] == 'REPEATABLE_MANUAL_TASK') {
                //Repeatable
                this.router.navigateByUrl('/End_User/RepeatForm', { skipLocationChange: true });
                //this.router.navigateByUrl('RepeatForm');
              }

            } else {
              this.repeatCallTable(true);
            }
            this.StorageSessionService.setCookies('App_Prcs', { 'V_APP_CD': this.APP_CD, 'V_PRCS_CD': this.PRCS_CD });

            // if ('V_EXE_CD' in this.check_data) {
            //   this.router.navigateByUrl('forms');
            //   //             var exe_cd:any[] = this.check_data["V_EXE_CD"];
            //   //             //(exe_cd);
            //   //             if(exe_cd.includes("NONREPEATABLE_MANUAL_TASK")){
            //   //                 alert("FORM DATA");
            //   //           }
            //   //           else if(exe_cd.includes("NONREPEATABLE_MANUAL_TASK")){
            //   //             alert("FORM DATA");
            //   //                       }
            // }
            // else {
            //   this.router.navigateByUrl('reportTable');
            // }
          } else {
            this.router.navigate(['End_User/Execute'], { queryParams: { page: 1 }, skipLocationChange: true });
          }
        }
      );
    if (!this.app.fromNonRepForm) {
      if (this.app.loadingCharts && CommonUtils.isValidValue(this.ctrl_variables) && this.ctrl_variables.show_ALL) {
        this.chart_JSON_call();
      }
    }

    // insecure

    // this.https.post(this.aptUrlPost_report, body)
    //   .subscribe(
    //     (res: any) => {
    //       if (res._body) {
    //         this.globals.Report = JSON.parse(res._body)

    //         // console.log("abdalla here", res.json());

    //         this.StorageSessionService.setCookies('report_table', res.json());
    //         this.check_data = res.json();
    //         this.app.loadingCharts = false;
    //         this.report = res.json();

    //         (this.report);

    //         (this.report.RESULT);
    //         (res.json());
    //         if (this.report.RESULT) {

    //           var timeout = res.json().RESULT.toString().substring(0, 7) == "TIMEOUT";
    //           (timeout);
    //           /*const dt = JSON.stringify(res);
    //           (dt);*/
    //           if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
    //             this.repeatCallTable(true);
    //           } else if (this.report.RESULT == 'TABLE') {

    //             this.router.navigateByUrl('ReportTable', { skipLocationChange: true });
    //           } else if (this.report.RESULT[0] == 'INPUT_ARTFCT_TASK') {

    //             this.router.navigateByUrl('InputArtForm', { skipLocationChange: true });

    //           } else if (CommonUtils.isValidValue(this.report.V_EXE_CD)) {
    //             if (this.report.RESULT[0] == 'NONREPEATABLE_MANUAL_TASK') {
    //               // non-Repeatable NonRepeatForm
    //               this.router.navigateByUrl('NonRepeatForm', { skipLocationChange: true });
    //               //this.router.navigateByUrl('Forms', { skipLocationChange: true });
    //             } else if (this.report.RESULT[0] == 'REPEATABLE_MANUAL_TASK') {
    //               //Repeatable
    //               this.router.navigateByUrl('RepeatForm', { skipLocationChange: true });
    //               //this.router.navigateByUrl('RepeatForm');    //         }
    //             } else {
    //               this.repeatCallTable(true);
    //             }
    //             this.StorageSessionService.setCookies('App_Prcs', { 'V_APP_CD': this.APP_CD, 'V_PRCS_CD': this.PRCS_CD });

    //             // if ('V_EXE_CD' in this.check_data) {
    //             //   this.router.navigateByUrl('forms');
    //             //   //             var exe_cd:any[] = this.check_data["V_EXE_CD"];
    //             //   //             //(exe_cd);
    //             //   //             if(exe_cd.includes("NONREPEATABLE_MANUAL_TASK")){
    //             //   //                 alert("FORM DATA");
    //             //   //           }
    //             //   //           else if(exe_cd.includes("NONREPEATABLE_MANUAL_TASK")){
    //             //   //             alert("FORM DATA");
    //             //   //                       }
    //             // }
    //             // else {
    //             //   this.router.navigateByUrl('reportTable');
    //             // }
    //           }
    //         }
    //       }
    //     });
    // if (!this.app.fromNonRepForm) {
    //   if (this.app.loadingCharts && CommonUtils.isValidValue(this.ctrl_variables) && this.ctrl_variables.show_ALL) {
    //     this.chart_JSON_call();
    //   }
    // }

    // while(true)

    //var timer= setInterval(function myfunc(){("_______________________||||||||||||||||||||____________________");},1000);


  }
  ColorGantt = [];
  Colorpie = [];
  Colorpie_boder = [];
  ColorBar = [];
  ColorBar_border = [];

  time_to_sec(time): any {
    return parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(3, 5)) * 60 + (parseInt(time.substring(6)));
  }

  show_gantt_chart(Process, start_time, end_time) {
    let count = 0, flag = false, val1;
    const mydataset = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorGantt.length < i + 1) {
        this.ColorGantt[i] = 'rgba(' + R + ',' + G + ',' + B + ')';
      }
      //((this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])));
      //((this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])));
      mydataset[Process.length - i - 1] = {
        backgroundColor: this.ColorGantt[i],
        borderColor: this.ColorGantt[i],
        fill: false,
        borderWidth: 20,
        pointRadius: 0,
        data: [
          {
            x: (this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }, {
            x: (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }
        ]
      };
    }
    const element = (<HTMLCanvasElement>document.getElementById('myGanttchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: mydataset
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  return Process[Process.length - value - 1];
                }
              }
            }],
            xAxes: [{
              type: 'linear',
              position: 'top',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time',
                fontStyle: 'bold'
              },
              ticks: {
                //beginAtZero :true,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let beg_str = start_time[0].substring(0, 2);
                    let begstr = parseInt(beg_str);
                    let mid_str = (start_time[0][3] + start_time[0][4]);
                    let midstr = parseInt(mid_str);
                    let end_str = start_time[0].substring(6);
                    let endstr = parseInt(end_str);
                    endstr += value;
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);

                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(count);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value/val1;
                  //return index;
                },
              }

            }],
          }
        }
      });
    }
  }

  show_pie(Process, start_time, end_time) {
    const mydata = [];
    const color = [], bcolor = [];
    const borderwidth_ = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.Colorpie.length < i + 1) {
        this.Colorpie[i] = 'rgb(' + R + ',' + G + ',' + B + ',0.8)';
        this.Colorpie_boder[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      const temp = (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]));
      mydata[i] = temp;
      color[i] = this.Colorpie[i];
      bcolor[i] = this.Colorpie_boder[i];
      borderwidth_[i] = 1;
    }
    const data2 = {
      labels: Process,
      datasets: [
        {
          data: mydata,
          backgroundColor: color,
          borderColor: bcolor,
          borderWidth: borderwidth_
        }
      ]
    };
    const element = (<HTMLCanvasElement>document.getElementById('myPie'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const chart1 = new Chart(ctx, {
        type: 'pie',
        data: data2,
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = mydata[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          title: {
            display: true,
            position: 'top',
            text: 'Current Processes',
            fontSize: 12,
            fontColor: '#111'
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              fontColor: '#333',
              fontSize: 10
            }
          }
        },
      });
    }
  }

  show_bar_chart(Process, start_time, end_time) {
    let val1, flag = false;
    const duration = [];
    const color = [];
    const bcolor = [];
    let temp_HH, temp_MM, temp_SS;
    for (let i = 0; i < Process.length; i++) {
      const len_temp = Process[i].length;
      Process[i] = Process[i].substring(0, 11);
      if (len_temp > Process[i].length) {
        Process[i] = Process[i] + '...';
      }
      const temp = this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]);
      duration[i] = temp;
      //(duration);
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorBar.length < i + 1) {
        this.ColorBar[i] = 'rgba(' + R + ',' + G + ',' + B + ',0.6)';
        this.ColorBar_border[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      color[i] = this.ColorBar[i];
      bcolor[i] = this.ColorBar_border[i];
    }
    const element = (<HTMLCanvasElement>document.getElementById('myBarchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Process,
          datasets: [
            {
              data: duration,
              backgroundColor: color,
              borderColor: bcolor,
              borderWidth: 1
            }]
        },
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              fontColor: '#333',
              fontSize: 16
            }
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = duration[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          scales: {
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Duration',
                fontStyle: 'bold'
              },
              ticks: {
                min: 0,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let begstr = 0;
                    let midstr = 0;

                    let endstr = value;
                    //(index*value);
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);
                    let beg_str = begstr.toString(), mid_str = midstr.toString(), end_str = endstr.toString();
                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(min);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value;
                  //return index;
                },
              }
            }],
            xAxes: [{
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
            }]
          }
        }
      });
    }
  }
  chart_JSON_call() {
    // insecure
    // this.apiservice.requestInSecureApi(this.apiUrlGetInsecure + 'V_SRC_ID=' + this.Execute_res_data['V_SRC_ID'] + '&V_APP_ID=' + this.Execute_res_data['V_APP_ID'] + '&V_PRCS_ID=' + this.Execute_res_data['V_PRCS_ID'] + '&V_PRCS_TXN_ID=' + this.Execute_res_data['V_PRCS_TXN_ID'] + '&REST_Service=ProcessStatus&Verb=GET', 'get').subscribe(res => {
    //   (res);
    //   const start_time = [], end_time = [], Process = [];

    //   for (let i = 0; i < res['INS_DT_TM'].length; i++) {
    //     start_time[i] = res['INS_DT_TM'][i].substring(11);
    //     end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
    //     Process[i] = res['PRDCR_SRVC_CD'][i];
    //   }
    //   if (this.ctrl_variables.show_Gantt) {
    //     this.show_gantt_chart(Process, start_time, end_time);
    //   }
    //   if (this.ctrl_variables.show_PIE) {
    //     this.show_pie(Process, start_time, end_time);
    //   }
    //   if (this.ctrl_variables.show_BAR) {
    //     this.show_bar_chart(Process, start_time, end_time);
    //   }
    //   // if(this.show_SM_PIE){
    //   //   this.show_sm_pie_chart(Process, start_time, end_time);
    //   //   }
    //   //delay
    //   const exec = this;
    //   if (this.app.loadingCharts) {
    //     setTimeout(function () { exec.chart_JSON_call(); }, 500);
    //   }
    // });

    // secure
    this.apiservice.requestSecureApi(this.apiUrlGetSecure + 'V_SRC_ID=' + this.Execute_res_data['V_SRC_ID'] + '&V_APP_ID=' + this.Execute_res_data['V_APP_ID'] + '&V_PRCS_ID=' + this.Execute_res_data['V_PRCS_ID'] + '&V_PRCS_TXN_ID=' + this.Execute_res_data['V_PRCS_TXN_ID'] + '&REST_Service=ProcessStatus&Verb=GET', 'get').subscribe(res => {
      (res);
      const start_time = [], end_time = [], Process = [];

      for (let i = 0; i < res['INS_DT_TM'].length; i++) {
        start_time[i] = res['INS_DT_TM'][i].substring(11);
        end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
        Process[i] = res['PRDCR_SRVC_CD'][i];
      }
      if (this.ctrl_variables.show_Gantt) {
        this.show_gantt_chart(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_PIE) {
        this.show_pie(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_BAR) {
        this.show_bar_chart(Process, start_time, end_time);
      }
      // if(this.show_SM_PIE){
      //   this.show_sm_pie_chart(Process, start_time, end_time);
      //   }
      //delay
      const exec = this;
      if (this.app.loadingCharts) {
        setTimeout(function () { exec.chart_JSON_call(); }, 500);
      }
    });
  }
  repeatURL() {

    this.form_dl_data[0] = {
      APP_CD: this.SL_APP_CD,
      PRC_CD: this.SL_PRC_CD
    };

    this.StorageSessionService.setSession('Exe_data', this.form_dl_data[0]);
    //(this.form_dl_data[0]);
    // this.router.navigateByUrl("repeat");
  }
  ///data11='{PIID=[W56JSR14C0050, W9124916F0057, HSHQDC17F0002…280001, 200370001], Country=[USA, USA, USA, USA],balaji=[IND, IND, IND, IND]}';
  Roll_cd: any[] = [];
  Label: any[] = [];

  ctrl_variables: any;
  ngAfterViewInit() {
    if (this.app.fromNonRepForm) {
      this.GenerateReportTable();
    }
  }
  ngOnInit() {
    const exec = this;
    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
      (this.ctrl_variables);
    });

    /*setTimeout(function () {
      exec.wSocket.listenOn = '102';
      exec.msg.getMessage.subscribe(res => {
        (res);

      });
    }, 5000);*/
    //this.APP_CD=this.app.APP_CD_GLOBAL;
    //this.PRC_CD=this.app.PRC_CD_GLOBAL;
    this.Service_box = false;
    if (this.app.selected_APPLICATION != 'ALL' && !this.app.START) {
      this.selectedapp = this.app.selected_APPLICATION;
    }
    if (this.app.selected_PROCESS != 'ALL' && !this.app.START) {
      this.selectedprcs = this.app.selected_PROCESS;
    }
    this.data.getJSON().subscribe(data => {
      //(data.json());
      this.Label = data.json();
      //(this.Label);
    });
    if (!this.applicationValuesObservable.length) {
      this.getAppCode();
    }
    //-----------------------------for checking the role cd
    this.roll.getRollCd().then(
      res => {
        this.Roll_cd = res;

        const l = this.Roll_cd.length;
        const ex_btn1: any[] = [];
        const ex_btn2: any[] = [];
        const ex_tab: any[] = [];
        const ex_pro: any[] = [];
        for (let i = 0; i < l; i++) {
          if (this.Roll_cd[i] === 'Process Execute' || this.Roll_cd[i] === 'Service Execute' || this.Roll_cd[i] === 'Enablement Workflow Schedule Role' || this.Roll_cd[i] === 'End User Role') {
            if (this.Roll_cd[i] == 'Process Execute') {
              ex_btn1.push('Process Execute');
            } else if (this.Roll_cd[i] === 'Service Execute') {
              ex_btn2.push('Service Execute');
            } else if (this.Roll_cd[i] === 'Enablement Workflow Schedule Role') {
              ex_tab.push('Enablement Workflow Schedule Role');
            } else if (this.Roll_cd[i] === 'End User Role') {
              ex_pro.push('End User Role');
            }
          }
        }
        // if both roll cd not empty then show the execute now button
        if (ex_btn1.length !== 0 && ex_btn2.length !== 0 && ex_pro.length === 0) {
          // this.Execute_Now_btn = false;
        }
        // for schedule 3 Roll must here
        if (ex_btn1.length !== 0 && ex_btn2.length !== 0 && ex_tab.length !== 0 && ex_pro.length !== 0) {
          // this.Schedule_btn = false;
        }

        // //("asdasdasdsad"+ex_btn1[0]+ex_btn2[0]+ex_tab[0]+ex_pro[0]);

      }
    );


  }

  // 10th April
  getOptional_values(V_PARAM_NM, display_label) {
    const url = this.apiUrlGetInsecure + 'V_SRC_CD=' + this.V_SRC_CD + '&V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_PARAM_NM=' + V_PARAM_NM + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const encoded_url = encodeURI(url);
    (encoded_url);
    ("Option Values: " + V_PARAM_NM);

    // insecure 

    // this.apiservice.requestInSecureApi(encoded_url, 'get').subscribe(
    //   res => {
    //     (res);
    //     const resData = res.json();
    //     this.options[display_label] = resData[V_PARAM_NM];
    //   });


    // secure

    const secureUrl = this.apiUrlGetSecure + 'V_SRC_CD=' + this.V_SRC_CD + '&V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.SL_SRVC_CD + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);
    (encoded_url);
    ("Option Values: " + V_PARAM_NM);
    const options = this.setHeaders();
    this.apiservice.requestSecureApi(secure_encoded_url, 'get').subscribe(
      res => {
        const resData = res.json();
        this.options[display_label] = resData[V_PARAM_NM];
      });
  }
}
export interface data {
  PARAM_NM: string[];
  PARAM_VAL: string[];
  RESULT: string[];
  CONT_ON_ERR_FLG: string[];
}