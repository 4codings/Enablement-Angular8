import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { data } from './schd_data';
import { MatTableDataSource, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { HostListener } from '@angular/core';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { HomeComponent } from '../../home.component';
import { Globals } from 'src/app/services/globals';
import { UserAdminService } from 'src/app/services/user-admin.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { EndUserService } from 'src/app/services/EndUser-service';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

@Component({
  selector: 'app-schd-actn',
  templateUrl: './schd-actn.component.html',
  // styleUrls: ['./schd-actn.component.css'],

})
  
export class SchdActnComponent implements OnInit, AfterViewInit {
  onpselect: Function;
  screenHeight = 0;
  screenWidth = 0;
  mobileView = false;
  desktopView = true;
  domain_name = this.globals.domain_name; private apiUrlGet = 'https://' + this.domain_name + '/rest/E_DB/SP?';
  App_CD_data = [];
  proc_CD_data = [];
  ser_cd_data = [];
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  ApplicationCD = '';
  ProcessCD = '';
  StatusCD = '';
  innerTable: data;
  data1: any;
  form_dl_data: any[] = [];
  innerTableDT: any[] = [];
  F1: any[];

  process_box = false;
  action_box = false;

  Label: any[] = [];

  // save_shedule_btn: boolean = true;
  FormData: any = [];
  ParametrValue: any[] = [];
  ParameterName: any[] = [];
  Data: any;
  tp = {};
  kl = 0;
  displayedColumns = ['#', 'name', 'status', 'lastrun', 'nextrun', 'details'];
  dataSource = new MatTableDataSource();
  Action: any;
  selectedplat: any;
  selectedplat1: any;
  selectedplat2: any;
  display_dynamic_paramter = false;
  ref: any = {};
  display_process_table = false;
  display_matcard = false;
  Resume_btn = false;
  Kill_btn = false;
  Pause_btn = false;
  Save_btn = false;
  show_filter_input = false;
  checkbox_color_value = '';
  FilterAutoValue: any;
  selection = new SelectionModel<data>(true, []);
  Process_key: any = [];
  table = '';
  searchResult: any[] = [];
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
  constructor(private router: Router,
              private http: HttpClient,
              private globals: Globals,
              public app: HomeComponent,
              private https: Http,
              private _http: HttpClient,
              private data2: UserAdminService,
              private storageSessionService: StorageSessionService,
              private data: ConfigServiceService,
              private endUsrData: EndUserService,
              private detector: ChangeDetectorRef,
              private noAuthData: NoAuthDataService) {
    this.onpselect = function (index) {
      this.selectedrole = index;
    };
    this.onResize();
  }
  getAppCode() {
    this.endUsrData.getApplication().subscribe(
      res => {
        this.App_CD_data = res.json();
        (res);
        if (this.app.START === false && this.ApplicationCD.length > 0 && this.app.selected_APPLICATION !== 'ALL') {
          if (this.mobileView) {
            this.getProcessCD({ value: this.ApplicationCD });
          } else {
            this.getProcessCD(this.ApplicationCD);
          }
        }
      });
  }
  getProcessCD(u) {
    if (this.mobileView) {
      u = u.value;
    }
    this.ApplicationCD = u;
    this.app.selected_APPLICATION = u;
    this.selectedplat = u;
    this.selectedplat1 = null;
    this.selectedplat2 = null;
    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.endUsrData.getProcesses(u)
      .subscribe(res => { this.proc_CD_data = res.json(); });
    // enable the scheduler btn
    // this.find_process(u, this.ProcessCD, "All");
    this.process_box = true;
    if (this.app.START === false && this.ProcessCD.length > 0 && this.app.selected_PROCESS !== 'ALL') {
      if (this.mobileView) {
        this.fooo1({ value: this.ProcessCD });
      } else {
        this.fooo1(this.ProcessCD);
      }
    }

  }
  // _________________________________FIND PROCESS__________________________________________
  // Table_scheduled_data: any[] = [];
  // Table_paused_data: any[] = [];
  // Table_kill_data: any[] = [];

  find_process(ApplicationCD, ProcessCD, StatusCD) {

    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.http.get<data>(this.apiUrlGet + 'V_SRC_CD=' + this.V_SRC_CD +
      '&V_APP_CD=' + ApplicationCD + '&V_PRCS_CD=' + ProcessCD + '&V_USR_NM=' +
      this.V_USR_NM + '&V_TRIGGER_STATE=' + StatusCD +
      '&REST_Service=ScheduledJobs&Verb=GET').subscribe(dataResult => {
      let rm_f: boolean;
      let ps_r: boolean;

      (dataResult);

      this.F1 = dataResult.SRVC_CD;
      (this.F1);
      (this.F1.length);
      for (let i = 0; i < this.F1.length; i++) {
        this.innerTableDT[i] = {
          name: dataResult.SRVC_CD[i],
          status: dataResult.TRIGGER_STATE[i],
          lastrun: dataResult.PREV_FIRE_TIME[i],
          nextrun: dataResult.NEXT_FIRE_TIME[i],
          details: dataResult.DESCRIPTION[i],
          job_name: dataResult.JOB_NAME[i]

        };

        // _______check trigger status
        if (dataResult.TRIGGER_STATE[i] === 'SCHEDULED') {
          ps_r = true;
        } if (dataResult.TRIGGER_STATE[i] === 'PAUSED') {
          rm_f = true;
        }
      }
      // push dependent flag
      this.Action.push('Setup a New Schedule');
      if (rm_f) {
        this.Action.push('Resume Existing Schedule');
      } if (ps_r) {
        this.Action.push('Pause Existing Schedules');

      }
      //    push kill flag if process are not empty
      if (dataResult.TRIGGER_STATE.length > 0) {
        this.Action.push('Kill Existing Schedule');
      }
      this.dataSource.data = this.innerTableDT;
    });

  }
  /** Whether the number of selected elements matches the total number of rows. */

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   this.data1 = this.selection.selected;
  //   (this.data1);
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;

  // }
  // _____________________________________CLOSE____________________________________________

  // -------------get process id / JOB_NAME
  Check_process_id(key: any) {
    this.Process_key.push(key);
    (this.Process_key);
    this.Process_key.forEach(function (v, i) {
      ('v' + v);
      ('i' + i);
      (key);
      if (v === key) {
        //     var index = this.Process_key.indexOf(v);

        // if (index > -1) {
        this.Process_key.splice(i, 1);
        // }
        // this.Process_key = this.Process_key.filter(function(e) { return e !== v })
        // this.Process_key.slice(i);
      }
    });
    (this.Process_key);

    // ("Array lenght"+this.Process_key.length+" elm"+this.Process_key);
  }
  onRowClick(row) {
    
  }


  Process_operation(P_ID: any, P_OP: any) {

    const body = {
      'TriggerKey': [P_ID],
      'JobKey': [P_ID],
      'Operation': [P_OP]
    };
    (body);
    this.https.post('https://' + this.domain_name + '/rest/Hold/ScheduleAction', body).subscribe(
      res => {
        (res.json());

      }
    );

    // this.find_process(this.ApplicationCD,this.ProcessCD,"All");
  }


  onPause() {

    this.innerTableDT = [];
    ('PAUSE!!!');
    // Pause
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], 'Pause');
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);

  }


  onResume() {
    this.innerTableDT = [];
    ('RESUME!!!');
    // Resume
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], 'Resume');
    }
    // await delay(2000);
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);
    // this.find_process(this.ApplicationCD,this.ProcessCD,"All");
  }

  onKill() {
    this.innerTableDT = [];
    // Kill
    ('KILL!!!');
    for (let i = 0; i < this.Process_key.length; i++) {
      this.Process_operation(this.Process_key[i], 'Kill');
      ('Process id' + this.Process_key[i]);
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);
  }

  // Roll_cd: any[] = [];

  ngOnInit() {
    if (this.app.selected_APPLICATION !== 'ALL' && !this.app.START) {
      this.ApplicationCD = this.app.selected_APPLICATION;
    }
    if (this.app.selected_PROCESS !== 'ALL' && !this.app.START) {
      this.ProcessCD = this.app.selected_PROCESS;
    }
    // 
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });

    this.getAppCode();
    this.data.getJSON().subscribe(data1 => { (data1.json()); this.Label = data1.json(); (this.Label); });

  }
  fooo1(u) {
    if (this.mobileView) {
      u = u.value;
    }
    this.selectedplat2 = null;
    this.ProcessCD = u;
    this.selectedplat1 = u;
    this.Action = [];
    this.innerTableDT = [];
    this.Data = [];
    this.action_box = true;

    this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
  }
  fooo2(u) {
    if (this.mobileView) {
      u = u.value;
    }
    this.display_matcard = true;
    this.form_dl_data[0] = {
      APP_CD: this.ApplicationCD,
      PRC_CD: this.ProcessCD
    };


    (this.form_dl_data);
    this.storageSessionService.setSession('Exe_data', this.form_dl_data[0]);

    this.selectedplat2 = u;
    if (u === 'Setup a New Schedule') {
      this.display_process_table = false;

      this.innerTableDT = [];
      this.Resume_btn = false;
      this.Kill_btn = false;
      this.Pause_btn = false;
      this.Save_btn = true;
      this.Process_key = [];
      this.show_btn_save_schedule();
    } else if (u === 'Pause Existing Schedules') {
      // this.onPause(); //Paused
      // this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = false;
      this.Kill_btn = false;
      this.Pause_btn = true;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = false;
      this.checkbox_color_value = 'checkbox_blue';
      this.applyFilter('SCHEDULED');
      this.find_process(this.ApplicationCD, this.ProcessCD, 'Scheduled');
    } else if (u === 'Resume Existing Schedule') {
      // this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = true;
      this.Kill_btn = false;
      this.Pause_btn = false;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = false;
      this.checkbox_color_value = 'checkbox_green';
      this.applyFilter('PAUSED');
      // When Click on "Resume Existing Schedule" Call all "Paused" Schedule and list if only Paused Schedules
      this.find_process(this.ApplicationCD, this.ProcessCD, 'Paused');
    } else if (u === 'Kill Existing Schedule') {
      // this.innerTableDT=[];
      this.display_dynamic_paramter = false;
      this.display_process_table = true;
      this.Resume_btn = false;
      this.Kill_btn = true;
      this.Pause_btn = false;
      this.Save_btn = false;
      this.Process_key = [];
      this.show_filter_input = true;
      this.checkbox_color_value = 'checkbox_red';
      this.applyFilter('');
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }
  }
  // enable_btn() {
  //   this.repeat_btn = false;
  // }
  // ---------------navigate to scheduler repeat after page

  // repeat_btn: boolean = true;
  repeatURL() {

    this.form_dl_data[0] = {
      APP_CD: this.ApplicationCD,
      PRC_CD: this.ProcessCD
    };


    (this.form_dl_data);
    this.storageSessionService.setSession('Exe_data', this.form_dl_data[0]);
    this.router.navigateByUrl('repeat');


  }

  // ---------------------------------
  show_btn_save_schedule() {
    // --------------Reuse from ConfigService: ABHISHEK ABHINAV----------------//
    this.endUsrData.getprocessParameter(this.ApplicationCD, this.ProcessCD)
    .subscribe(
      res => {
        const FormData = res.json();
        this.ref = {disp_dyn_param: false};
        const got_res = this.data.exec_schd_restCall(FormData, this.ref);
        this.Data = got_res.Data;
        this.kl = got_res.K;
    // /*this.https.get(this.apiUrlGet + "V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" +
        // this.ProcessCD + "&V_SRC_CD=" +
        // this.V_SRC_CD + "&REST_Service=ProcessParameters&Verb=GET").subscribe(
    //   res => {
    //     (this.apiUrlGet + "V_APP_CD=" + this.ApplicationCD + "&V_PRCS_CD=" +
        // this.ProcessCD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ProcessParameters&Verb=GET");
    //     (res.json());
    //     this.FormData = res.json();
    //     this.ParametrValue = this.FormData['PARAM_VAL'];
    //     this.ParameterName = this.FormData['PARAM_NM'];
    //     let arr: string;
    //
    //     for (let i = 0; i < this.ParametrValue.length; i++) {
    //       if (this.ParameterName[i].includes('Date') && !(this.ParameterName[i].includes('DateTime'))) {
    //         this.Data[i] = {
    //           type: 'date',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //
    //         };
    //
    //       }
    //       else if (this.ParameterName[i].charAt(0) == '?') {
    //         this.Data[i] = {
    //           type: 'radio',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].charAt(this.ParameterName[i].length - 1) == '?') {
    //         this.Data[i] = {
    //           type: 'checkbox',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].includes('Time') && !(this.ParameterName[i].includes('DateTime'))) {
    //         this.Data[i] = {
    //           type: 'time',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].includes('DateTime')) {
    //         this.Data[i] = {
    //           type: 'datetime',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].includes('Password')) {
    //         this.Data[i] = {
    //           type: 'password',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].includes('Range')) {
    //         this.Data[i] = {
    //           type: 'range',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else if (this.ParameterName[i].includes('Color')) {
    //         this.Data[i] = {
    //           type: 'color',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //         };
    //       }
    //       else {
    //         this.Data[i] = {
    //           type: 'input',
    //           name: this.ParameterName[i],
    //           value: this.ParametrValue[i],
    //           placeholder: this.ParameterName[i].split('_').join(' '),
    //
    //         };
    //       }
    //
    //       if (this.ParametrValue.length > 0)
    //         this.display_dynamic_paramter = true;
    //       this.kl = i;
    //     }*/


        for (let i = 0; i <= this.kl; i++) {

          if (this.Data[i].value !== '' && this.Data[i].value !== null) {
            this.tp[this.Data[i].name] = this.Data[i].value;
          }
        }
        (this.tp);


      }
    );
    // this.save_shedule_btn = false;
  }

  Update_value(v: any, n) { // v=value and n=paramter name
    this.FilterAutoValue = v;
    const ag = this.storageSessionService.getSession('agency');
    const ur = this.storageSessionService.getSession('email');
    this.http.get('https://' + this.domain_name + '/rest/E_DB/SP?V_APP_CD=' +
      this.ApplicationCD + '&V_PRCS_CD=' + this.ProcessCD +
      '&V_SRC_CD=' + ag + '&V_USR_NM=' + ur + '&V_PARAM_NM=' + n +
      '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH')
    .subscribe(
      res => {

      }
    );
  }
// filteredOptions: Observable<string[]>;
  getDropDownListValue(e) {
    // this.app.loading=true;
    this.searchResult = [];
    // this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" +
    // this.ApplicationCD + "&V_PRCS_CD=" + this.ProcessCD + "&V_PARAM_NM=" + e +
    // "&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET")
    this.endUsrData.getParameterAllOption(this.ApplicationCD, this.ProcessCD, e, 'Pull%20FPDS%20Contract')
    .subscribe(
        res => {
          ('Parameter option response is :');
          (res.json());
          (res.json()[e]);
          this.searchResult = res.json()[e];
          this.app.loading = false;
        }
      );


  }


  // ---------------------------
  ngAfterViewInit() {
    // TODO: Remove this as it is a workaround to make the table visible when the page got reloaded
    this.detector.detectChanges();
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  add(aa) {
    (aa.name + aa.value);
    if (aa.name in this.tp) { this.tp[aa.name] = aa.value; } else {
      this.tp[aa.name] = aa.value;
    }
    (this.tp);
    this.storageSessionService.setCookies('tp', this.tp);
  }
}
export interface PeriodicElement {
  name: any;
  status: any;
  lastrun: any;
  nextrun: any;
  details: any;
  job_name: any;
}

export interface data {
  APP_CD: string;
  PRCS_CD: string;
  ser_cd_data: string[];

  // ======================find process
  CREATE: string[];
  CRON_EXPRESSION: string[];
  DELETE: string[];
  DESCRIPTION: string[];
  EXECUTE: string[];
  JOB_NAME: string[];
  NEXT_FIRE_TIME: string[];
  PREV_FIRE_TIME: string[];
  READ: string[];
  SRVC_CD: string[];
  TRIGGER_STATE: string[];
  UPDATE: string[];

  // ==================================
}





