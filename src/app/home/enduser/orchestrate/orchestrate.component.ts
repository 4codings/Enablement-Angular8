import { Component, OnInit, OnDestroy } from '@angular/core';

import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { DataSource } from '@angular/cdk/table';
import { Observable, Subscription } from 'rxjs';
import { CdkTableModule } from '@angular/cdk/table';
import { forEach } from '@angular/router/src/utils/collection';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef, MatCell, MatCellDef
} from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserAdminService } from 'src/app/services/user-admin.service';
import { Globals } from 'src/app/services/globals';
import { HomeComponent } from '../../home.component';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { OptionalValuesService, ProcessObservable, ServiceObservable } from 'src/app/services/optional-values.service';

@Component({
  selector: 'app-orchestrate',
  templateUrl: './orchestrate.component.html',
  // styleUrls: ['./orchestrate.component.css']
})
export class OrchestrateComponent implements OnInit, OnDestroy {

  innerTableDT: any[] = [];
  F1: any[];
  rowData = {};
  displayedColumns = ['#', 'Predecessor_Service', 'Successor_Service', 'Transition_Condition', 'Continue_on_Error'];
  dataSource = new MatTableDataSource<data>();
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;

  V_BASE_ID: string[] = null;
  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrlAdd = "https://" + this.domain_name + "/rest/v1/secured";

  prcs_cd: string[];
  srvc_cd: string[];
  app_cd: string[];

  succprcs_cd: string[];
  succsrvc_cd: string[];
  succapp_cd: string[];

  predapp_sl = '';
  predpro_sl = '';
  predsvc_sl = '';

  succapp_sl = '';
  succpro_sl = '';
  succapp_s2 = '';
  succsvc_s2 = '';
  succpro_s2 = '';
  succsvc_sl = '';
  autoid: string[];
  trnsn_sl: string[];
  contonerr_sl: boolean = false;
  selectedradio: string = "Complete";
  V_DIRECTION: string;
  data1: any;
  TriggerKey: any[] = [];
  disabled: boolean = true;
  disableddelete: boolean = true;
  Label: any[] = [];

  pred: string = "Predecessor";
  succ: string = "Successor";

  app_flag = false;
  proc_flag = false;
  srvc_flag = false;

  applicationValues$: Subscription;
  processValues$: Subscription;
  serviceValues$: Subscription;

  applicationValuesObservable = [];
  processValuesObservable: ProcessObservable[] = [];
  serviceValuesObservable: ServiceObservable[] = [];

  constructor(private http: HttpClient, private data: UserAdminService,
    private StorageSessionService: StorageSessionService, private optionalService: OptionalValuesService,
    private app: HomeComponent, private globals: Globals, private noAuthData: NoAuthDataService
  ) {
    this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
      if (data != null) {
        this.applicationValuesObservable = data;
        if (this.applicationValuesObservable.length) {
          this.app_cd = (data.sort(function (a, b) { return a.localeCompare(b); }));
          this.succapp_cd = (data.sort(function (a, b) { return a.localeCompare(b); }));
          if (this.predapp_sl.length == 0 && this.app.selected_APPLICATION != 'ALL') {
            this.predapp_sl = this.app.selected_APPLICATION;
            this.app_flag = true;
            // this.functionprocesslist();
            this.succapp_sl = this.predapp_sl;
            // this.functionsuccprocesslist();
          }
        }
      }
    });
    this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
      if (data != null) {
        this.processValuesObservable = data;
        if (this.processValuesObservable.length) {
          this.prcs_cd = [];
          this.succprcs_cd = [];
          if (this.predapp_sl !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.predapp_sl) {
                this.prcs_cd = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
                this.functionCommonPreProcess();
              }
            });
          }
          if (this.succapp_sl !== '') {
            this.processValuesObservable.forEach(ele => {
              if (ele.app === this.succapp_sl) {
                this.succprcs_cd = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
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
          this.srvc_cd = [];
          if (this.predapp_sl !== '' && this.predpro_sl !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.predapp_sl && ele.process === this.predpro_sl) {
                this.srvc_cd = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
                this.functionCommonPreService(this.srvc_cd);
              }
            });
          }

          this.succsrvc_cd = [];

          if (this.succapp_sl !== '' && this.succpro_sl !== '') {
            this.serviceValuesObservable.forEach(ele => {
              if (ele.app === this.succapp_sl && ele.process === this.succpro_sl) {
                this.succsrvc_cd = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
                this.functionCommonSuccService(this.succsrvc_cd);
              }
            });
          }
        }
      }
    });

  }

  // ----------- get Applications ------------
  functionapplist() {
    this.optionalService.getApplicationOptionalValue();
    // this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET").subscribe(
    //   res => {
    //     this.app_cd = res.APP_CD.sort(function (a, b) { return a.localeCompare(b); });
    //     if (this.predapp_sl.length == 0 && this.app.selected_APPLICATION != 'ALL') {
    //       this.predapp_sl = this.app.selected_APPLICATION;
    //       this.app_flag = true;
    //       this.functionprocesslist();
    //       this.succapp_sl = this.predapp_sl;
    //       this.functionsuccprocesslist();
    //     }

    //   }
    // );

  }
  foo() {
    this.app_flag = false;
  }
  foo1() {
    this.proc_flag = false;
  }
  foo2() {
    this.srvc_flag = false;
  }
  // ----------  get processes ------------
  functionprocesslist() {

    this.dataSource.data = [];
    this.prcs_cd = null;
    this.srvc_cd = null;
    if (!this.processValuesObservable.length) {
      this.optionalService.getProcessOptionalValue(this.predapp_sl);
    } else {
      let flag = 0;
      this.processValuesObservable.forEach(ele => {
        if (ele.app === this.predapp_sl) {
          if (ele.data.CREATE[0] == "Y" && ele.data.DELETE[0] == "Y" && ele.data.UPDATE[0] == "Y") {
            this.prcs_cd = [];
            this.prcs_cd = ele.process.sort(function (a, b) { return a.localeCompare(b); });
            flag = 1;
            this.functionCommonPreProcess();
          }
        }
      });
      if (!flag) {
        this.optionalService.getProcessOptionalValue(this.predapp_sl);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.predapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
    //   res => {
    //     // (res.PRCS_CD);
    //     if (res.CREATE[0] == "Y" && res.DELETE[0] == "Y" && res.UPDATE[0] == "Y") {
    //       this.prcs_cd = res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); });
    //       if (this.predpro_sl.length == 0 && this.app.selected_PROCESS != 'ALL' && this.app_flag) {
    //         //      ("here");
    //         this.predpro_sl = this.app.selected_PROCESS;
    //         this.proc_flag = true;
    //         this.functionserviceslist();
    //         this.succpro_sl = this.predpro_sl;
    //         this.functionsuccserviceslist();
    //       }
    //       if (this.predapp_sl.length > 0 && !this.app_flag) {
    //         this.app.selected_APPLICATION = this.predapp_sl;
    //         //this.proc_flag=false;
    //         this.predpro_sl = '';
    //         this.succpro_sl = '';
    //         this.predsvc_sl = '';
    //         this.succsvc_sl = '';
    //       }
    //     }
    //   }
    // );
    this.succapp_sl = this.predapp_sl;
  }
  // ----------  get Services ------------
  functionserviceslist() {
    this.srvc_cd = null;
    if (!this.serviceValuesObservable.length) {
      this.optionalService.getServiceOptionalValue(this.predapp_sl, this.predpro_sl);
    } else {
      let flag = 0;
      this.serviceValuesObservable.forEach(ele => {
        if (ele.app === this.predapp_sl && ele.process === this.predpro_sl) {
          this.srvc_cd = [];
          this.srvc_cd = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
          flag = 1;
          this.functionCommonPreService(ele.service);
        }
      });
      if (!flag) {
        this.optionalService.getServiceOptionalValue(this.predapp_sl, this.predpro_sl);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.predapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + this.predpro_sl + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
    //   res => {
    //     // (res.SRVC_CD);

    //     if (res.SRVC_CD.includes('START')) {
    //       var index = res.SRVC_CD.indexOf('START');
    //       // ("index of Start = "+index);
    //       this.predsvc_sl = res.SRVC_CD[index];
    //     }
    //     this.srvc_cd = res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); });
    //     if (this.predsvc_sl == 'START' && this.app.selected_SERVICE != 'ALL' && this.proc_flag) {
    //       this.srvc_flag = true;
    //       this.predsvc_sl = this.app.selected_SERVICE;
    //       this.succsvc_sl = this.predsvc_sl;
    //       this.functionsuccserviceslist();
    //     }
    //     if (this.predsvc_sl.length > 0 && !this.proc_flag) {
    //       this.app.selected_SERVICE = this.predsvc_sl;
    //     }
    //     if (this.predpro_sl.length > 0 && !this.proc_flag) {
    //       this.app.selected_PROCESS = this.predpro_sl;
    //       this.predsvc_sl = 'START';
    //       //this.succsvc_sl='';
    //     }
    //   }
    // );
    this.succpro_sl = this.predpro_sl;
  }

  // ----------- get successor Applications ------------
  functionsuccapplist() {
    // this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET").subscribe(
    //   res => {
    //     // (res.APP_CD);
    //     this.succapp_cd = res.APP_CD.sort(function (a, b) { return a.localeCompare(b); });
    //   }
    // );
  }
  // ----------  get successor processes ------------
  functionsuccprocesslist() {

    this.succprcs_cd = null;
    this.succsrvc_cd = null;
    if (!this.processValuesObservable.length) {
      this.optionalService.getProcessOptionalValue(this.succapp_sl);
    } else {
      let flag = 0;
      this.processValuesObservable.forEach(ele => {
        if (ele.app === this.succapp_sl) {
          if (ele.data.CREATE[0] == "Y" && ele.data.DELETE[0] == "Y" && ele.data.UPDATE[0] == "Y") {
            this.succprcs_cd = [];
            this.succprcs_cd = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
            flag = 1;
          }
        }
      });
      if (!flag) {
        this.optionalService.getProcessOptionalValue(this.succapp_sl);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.succapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
    //   res => {
    //     // (res.PRCS_CD);
    //     if (res.CREATE[0] == "Y" && res.DELETE[0] == "Y" && res.UPDATE[0] == "Y") {

    //       this.succprcs_cd = res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); });

    //     }
    //   }
    // );
  }
  // ----------  get successor Services ------------
  functionsuccserviceslist() {

    this.succsrvc_cd = null;
    if (!this.serviceValuesObservable.length) {
      this.optionalService.getServiceOptionalValue(this.succapp_sl, this.succpro_sl);
    } else {
      let flag = 0;
      this.serviceValuesObservable.forEach(ele => {
        if (ele.app === this.succapp_sl && ele.process === this.succpro_sl) {
          this.functionCommonSuccService(ele.service);
          // this.succsrvc_cd = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
          flag = 1;
        }
      });
      if (!flag) {
        this.optionalService.getServiceOptionalValue(this.succapp_sl, this.succpro_sl);
      }
    }
    // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.succapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + this.succpro_sl + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
    //   res => {
    //     if (this.predapp_sl == this.succapp_sl && this.predpro_sl == this.succpro_sl) {
    //       var value = this.predsvc_sl;
    //       res.SRVC_CD = res.SRVC_CD.filter(function (item) {
    //         return item !== value
    //       })
    //       // (res.SRVC_CD);
    //       this.succsrvc_cd = res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); });
    //     }

    //     this.succsrvc_cd = res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); });
    //     if (this.app.selected_SERVICE != 'ALL' && this.succsvc_s2.length == 0) {
    //       this.succsvc_sl = this.app.selected_SERVICE;
    //       this.succsvc_s2 = this.succsvc_sl;
    //       ("Gotcha");
    //     }
    //   }
    // );
  }
  functionCommonPreService(ele) {
    if (ele.includes('START')) {
      var index = ele.indexOf('START');
      // ("index of Start = "+index);
      this.predsvc_sl = ele[index];
    }
    this.srvc_cd = ele.sort(function (a, b) { return a.localeCompare(b); });
    if (this.predsvc_sl == 'START' && this.app.selected_SERVICE != 'ALL' && this.proc_flag) {
      this.srvc_flag = true;
      this.predsvc_sl = this.app.selected_SERVICE;
      this.succsvc_sl = this.predsvc_sl;
      // this.functionsuccserviceslist();
    }
    if (this.predsvc_sl.length > 0 && !this.proc_flag) {
      this.app.selected_SERVICE = this.predsvc_sl;
    }
    if (this.predpro_sl.length > 0 && !this.proc_flag) {
      this.app.selected_PROCESS = this.predpro_sl;
      this.predsvc_sl = 'START';
      //this.succsvc_sl='';
    }

  }
  functionCommonPreProcess() {
    if (this.predpro_sl.length == 0 && this.app.selected_PROCESS != 'ALL' && this.app_flag) {
      this.predpro_sl = this.app.selected_PROCESS;
      this.proc_flag = true;
      // this.functionserviceslist();
      this.succpro_sl = this.predpro_sl;
      // this.functionsuccserviceslist();
    }
    if (this.predapp_sl.length > 0 && !this.app_flag) {
      this.app.selected_APPLICATION = this.predapp_sl;
      //this.proc_flag=false;
      this.predpro_sl = '';
      this.succpro_sl = '';
      this.predsvc_sl = '';
      this.succsvc_sl = '';
    }

  }
  functionCommonSuccService(ele) {
    var filteredValue = ele;
    if (this.predapp_sl == this.succapp_sl && this.predpro_sl == this.succpro_sl) {
      var value = this.predsvc_sl;
      filteredValue = ele.filter(function (item) {
        return item !== value
      })
      // (res.SRVC_CD);
      this.succsrvc_cd = filteredValue.sort(function (a, b) { return a.localeCompare(b); });
    }

    this.succsrvc_cd = filteredValue.sort(function (a, b) { return a.localeCompare(b); });
    if (this.app.selected_SERVICE != 'ALL' && this.succsvc_s2.length == 0) {
      this.succsvc_sl = this.app.selected_SERVICE;
      this.succsvc_s2 = this.succsvc_sl;
    }
  }
  checkradio(v) {
    if (v == 'Upstream')
      this.selectedradio = "Upstream";
    if (v == 'Downstream')
      this.selectedradio = "Downstream";
    if (v == 'Complete')
      this.selectedradio = "Complete";

  }
  functiongettable() {

    this.dataSource.data = [];

    if (this.predsvc_sl != "") {
      if (this.selectedradio == "Complete") {
        this.V_DIRECTION = "A";

      }
      else if (this.selectedradio == "Downstream") {
        this.V_DIRECTION = "F";

      }
      else if (this.selectedradio == "Upstream") {
        this.V_DIRECTION = "B";

      }
      this.http.get<data>(this.apiUrlGet + "&V_PRDCR_SRC_CD=" + this.V_SRC_CD + "&V_PRDCR_APP_CD=" + this.predapp_sl + "&V_PRDCR_PRCS_CD=" + this.predpro_sl + "&V_PRDCR_SRVC_CD=" + this.predsvc_sl + "&V_DIRECTION=" + this.V_DIRECTION + "&REST_Service=Orchestration&Verb=GET").subscribe(
        (res: any) => {
          // (res.PRDCR_SRVC_CD);
          // (res.SRVC_CD);
          // (res.TRNSN_CND);
          // (res.CONT_ON_ERR_FLG);
          if (this.isEmpty(res)) {
          } else {
            this.F1 = res.PRDCR_SRVC_CD;
            // (this.F1);
            // (this.F1.length);

            for (let i = 0; i < this.F1.length; i++) {
              this.innerTableDT[i] = {
                Predecessor_Service: res.PRDCR_SRVC_CD[i],
                Successor_Service: res.SRVC_CD[i],
                Transition_Condition: res.TRNSN_CND[i],
                Continue_on_Error: res.CONT_ON_ERR_FLG[i],
                autoid: res.AUTO_ID[i]
              }
              this.dataSource.data = this.innerTableDT;
            }
          }
        }
      );

    }
  }
  selection = new SelectionModel<data>(true, []);
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  /** Whether the number of selected elements matches the total number of rows. */

  //    isAllSelected() {
  //      const numSelected = this.selection.selected.length;
  //      this.data1 = this.selection.selected;
  //  if(this.dataSource.data.length>0){
  //      const numRows = this.dataSource.data.length;

  //      return numSelected === numRows;
  //  }    

  //   }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //  masterToggle() {
  //    (this.isAllSelected())?     
  //     this.selection.clear():
  //     this.dataSource.data.forEach(row => this.selection.select(row));

  //  } 

  //_____________________________________CLOSE____________________________________________

  onRowClick(row) {

    var index;
    var checked;
    for (let i = 0; i < this.row_arr.length; i++) {
      if (this.row_arr[i] == row) {
        checked = true;
        index = i;
        break;
      }
    }
    if (checked) {
      this.row_arr.splice(index, 1);
    } else
      this.row_arr = this.row_arr.concat([row]);
    if (this.row_arr.length == 0)
      this.disableddelete = true;
    else
      this.disableddelete = false;
    // (row['status']);
  }
  row_arr = [];
  onRowCheck(row) {
    var index;
    var checked = false;
    for (let i = 0; i < this.row_arr.length; i++) {
      if (this.row_arr[i] == row) {
        checked = true;
        index = i;
        (i);
        break;
      }
    }
    if (checked) {
      this.row_arr.splice(index, 1);
    } else
      this.row_arr = this.row_arr.concat([row]);
    if (this.row_arr.length == 0)
      this.disableddelete = true;
    else
      this.disableddelete = false;
  }

  functiondelete() {
    const numSelected = this.selection.selected.length;
    this.data1 = this.selection.selected;
    if (this.dataSource.data.length > 0) {
      const numRows = this.dataSource.data.length;

      numSelected === numRows;

      ('Deleting');
      for (let j = 0; j < this.data1.length; j++) {
        this.TriggerKey[j] = this.data1[j].autoid;
      }

      for (let k = 0; k < this.TriggerKey.length; k++) {
        this.http.get(this.apiUrlGet + "V_AUTO_ID=" + this.TriggerKey[k] + "&REST_Service=Orchetration&Verb=DELETE").subscribe(
          res => {

            ("***" + res + "***");
          }

        );
        this.data1 = null;
      } this.TriggerKey = null;
      this.functiongettable();
    }
  }

  // -------- add orchestration -------
  functionadd() {
    var a = "";
    if (this.contonerr_sl === false) {
      a = "N";
    } else if (this.contonerr_sl === true) {
      a = "Y";
    }
    let body = {
      "V_PRDCR_SRC_CD": this.V_SRC_CD,
      "V_PRDCR_APP_CD": this.predapp_sl,
      "V_USR_NM": this.V_USR_NM,
      "V_PRDCR_PRCS_CD": this.predpro_sl,
      "V_PRDCR_SRVC_CD": this.predsvc_sl,
      "V_SRC_CD": this.V_SRC_CD,
      "V_APP_CD": this.succapp_sl,
      "V_PRCS_CD": this.succpro_sl,
      "V_SRVC_CD": this.succsvc_sl,
      "V_TRNSN_CND": this.trnsn_sl,
      "V_CONT_ON_ERR_FLG": a,
      "RESULT": "@RESULT",
      "REST_Service": "Orchetration",
      "Verb": "PUT"
    };
    (this.trnsn_sl);
    (a);
    (this.contonerr_sl);
    this.http.put(this.apiUrlAdd, body).subscribe(
      res => {
        ("***" + res + "***");

      }
    );
    this.functiongettable();
  }
  enabledisable() {
    (this.succsvc_sl == '') ? this.disabled = true : this.disabled = false;

  }
  // ------------------ 
  ngOnInit() {
    if (!this.applicationValuesObservable.length) {
      this.functionapplist();
      // this.functionsuccapplist();
    }
    // this.data.getJSON().subscribe(data => {
    //         //  (data.json());       
    //          this.Label=data.json();       
    //         //  (this.Label);  
    //          }) 
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
  }
  ngOnDestroy() {
    this.applicationValues$.unsubscribe();
    this.processValues$.unsubscribe();
    this.serviceValues$.unsubscribe();
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
}

