import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { CommonUtils } from '../../../../common/utils';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Globals } from '../../../../services/globals';
import { ConfigServiceService } from '../../../../services/config-service.service';
import { ApiService } from '../../../../service/api/api.service';
import { HomeComponent } from '../../../../home/home.component';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Globals2 } from '../../../../service/globals';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../bpmn-viewer';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { InputOutputElementComponent } from 'src/app/shared/components/input-output-element/input-output-element.component';
import { InstanceElementList } from '../../process-design/monitor/monitor.component';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
export class ReportData {
  public RESULT: string;
  public V_EXE_CD: string[];
  constructor() {
  }
}
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  V_ID: any;
  formWidth: any = {};
  fieldType: any = {};
  plainInput: string;
  entry_plain: string;
  set_PhoneDash: any;
  phoneDash_Input: any;
  margin: number = 0;
  totalWidth_rep: number = 0;
  ctrl_variables: any;
  RVP_DataObj: any;
  V_READ: any;
  V_CREATE: any;
  V_UPDATE: any;
  V_DELETE: any;
  V_EXECUTE: any;
  HAS_OPTIONS: any;
  HAS_DSPLY: any;
  DISPLAY_TXT: any;
  DSPLY_FLD: any;
  VLDTN: any;
  VLDTN_ALERT_TXT: any;
  CNSLD_VLDTN_ALERT: any;
  FLD_HLP_TXT: any;
  PARAM_DSC: any;
  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  constructor(
    public StorageSessionService: StorageSessionService,
    public http: HttpClient,
    public https: Http,
    public router: Router,
    public globals: Globals,
    public app: HomeComponent,
    public cdr: ChangeDetectorRef,
    public apiService: ApiService,
    public globarUser: Globals2,
    public configService: ConfigServiceService,
    public toasterService: ToastrService,
    public dialog: MatDialog,
    public optionalService: OptionalValuesService
  ) { }

  domain_name = this.globals.domain_name;
  // 10th April added globals
  domain = this.globals.domain;
  suffix = this.globals.suffix;
  path = this.globals.Path;
  version = this.globals.version;
  public apiUrlGet = this.apiService.endPoints.insecure;
  public apiUrlGetSecured = this.apiService.endPoints.secure;
  private aptUrlPost_report_new = this.apiService.endPoints.secureProcessReport;
  public dataChangeHandler: any;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Form_Data: any;
  options: any = {};
  PVP: any;
  FLD_TYPE: any;
  V_TABLE_NAME: any;
  V_SCHEMA_NAME: any;
  V_KEY_NAME: string;
  V_KEY_VALUE: string;
  V_SRVC_CD: any = {};
  V_PRCS_TXN_ID: any;
  V_APP_ID: any;
  V_SRC_ID: any;
  V_PRCS_ID: any;
  Check_RPT_NRPT: any;
  RVP_Data: any;
  Field_Names: string;
  Field_Values: string;
  V_SRVC_ID: any;
  V_UNIQUE_ID: any;
  SL_APP_CD: any;
  SL_PRC_CD: any;
  s_data: any;
  action: boolean;
  srvc_cd: any;
  srvc_cd_sl: any;
  RVP_labels: any[] = [];
  RVP_placeholder: any[] = [];
  RVP_Keys: string[];
  RVP_Values: any[] = [];
  V_APP_CD: string = '';
  V_PRCS_CD: string = '';
  Initial_record: any = {};
  check_data = {};
  repeat = 0;
  Execute_res_data: any;
  public report: ReportData = new ReportData;
  APP_CD = '';
  PRCS_CD = '';
  private viewer: any;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  public bpmnFilePath = '';
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  successString: any;
  intermediateString: any;
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.http.get('../../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
      this.bpmnFilePath = this.ctrl_variables.bpmn_file_path;
      this.successString = this.ctrl_variables.success_string;
      this.intermediateString = this.ctrl_variables.intermediate_string;
      // this.downloadBpmn();
    });
    this.downloadUrl = this.apiService.endPoints.downloadFile;
  }
  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  getFormData(): any {
    this.Form_Data = [];
    this.Form_Data = this.StorageSessionService.getCookies('report_table');
    this.configService.prepareAndGetFieldConfigurations(this.Form_Data, true);
    this.RVP_Keys = [];
    this.RVP_Values = []
    this.RVP_labels = [];
    this.RVP_placeholder = [];
    this.PVP = JSON.parse(this.Form_Data['PVP'][0]);
    this.srvc_cd_sl = this.Form_Data['SRVC_CD'][0];
    (this.PVP);
    this.checkOLD_Table();
    this.getOther_records();
    this.setField_RVP();

    this.RVP_Keys = Object.keys(this.RVP_DataObj);
    for (let i = 0; i < this.RVP_Keys.length; i++) {
      this.FLD_TYPE[i] = this.FLD_TYPE[i].trim();
      this.HAS_OPTIONS[i] = this.HAS_OPTIONS[i].trim();
      this.HAS_DSPLY[i] = this.HAS_DSPLY[i].trim();
      this.DSPLY_FLD[i] = this.DSPLY_FLD[i].trim();
      this.DISPLAY_TXT[i] = this.DISPLAY_TXT[i].trim();
      this.PARAM_DSC[i] = this.PARAM_DSC[i].trim();
      this.FLD_HLP_TXT[i] = this.FLD_HLP_TXT[i].trim();
      this.VLDTN[i] = this.VLDTN[i].trim();
      this.VLDTN_ALERT_TXT[i] = this.VLDTN_ALERT_TXT[i].trim();
      this.CNSLD_VLDTN_ALERT[i] = this.CNSLD_VLDTN_ALERT[i].trim();
    }

    this.labels_toShow();


    for (let i = 0; i < this.RVP_Keys.length; i++) {
      if (this.FLD_TYPE && this.FLD_TYPE[i] === "'dropdown'") {
        this.HAS_OPTIONS[i] = "'N'";
        this.setDropDownValues(this.RVP_Keys[i], this.RVP_labels[i], i);
      } else {
        if (this.HAS_OPTIONS && this.HAS_OPTIONS[i] === "'Y'") {
          this.getOptional_values(this.RVP_Keys[i], this.RVP_labels[i]);
        }
      }
    }
    this.set_fieldType();
    this.set_fieldWidth();
    let obj = {
      'V_APP_ID': this.V_APP_ID,
      'V_PRCS_ID': this.V_PRCS_ID,
      'V_PRCS_TXN_ID': this.V_PRCS_TXN_ID,
      'V_SRC_ID': this.V_SRC_ID,
      'USR_NM': this.V_USR_NM
    }
    this.optionalService.selecetedProcessTxnValue.next(obj);
    // this.getInputOutput();
  }

  getInputOutput() {
    this.http.get(this.apiService.endPoints.securedJSON + 'V_SRC_ID=' + this.V_SRC_ID +
      '&V_APP_ID=' + this.V_APP_ID + '&V_PRCS_ID=' + this.V_PRCS_ID + '&V_USR_NM=' +
      this.V_USR_NM + '&V_PRCS_TXN_ID=' + this.V_PRCS_TXN_ID +
      '&REST_Service=Service_Instances&Verb=GET').subscribe((res: any) => {
        if (res.length) {
          this.selectedInstanceElementsList = res;
        }
      });
  }
  labels_toShow(): any {
    //----------------Lables to Show---------------//
    for (let i = 0; i < this.RVP_Keys.length; i++) {
      this.RVP_Values.push(this.RVP_DataObj[this.RVP_Keys[i]]);
      this.RVP_labels.push(this.RVP_Keys[i].replace(new RegExp('_', 'g'), ' '));
      if (this.HAS_DSPLY[i] === "'Y'") {
        this.RVP_placeholder.push(this.DISPLAY_TXT[i].toString().replace(/'/g, ""));
      } else {
        this.RVP_placeholder.push(this.RVP_Keys[i].replace(new RegExp('_', 'g'), ' '));
      }
      if (this.DSPLY_FLD[i] === "'Y'") {
        this.DSPLY_FLD[i] = true;
      } else {
        this.DSPLY_FLD[i] = false;
      }
      if (this.FLD_HLP_TXT[i] === "''") {
        this.FLD_HLP_TXT[i] = null;
      }
    }
    (this.RVP_labels);
  }

  setField_RVP(): any {
    //------------Getting RVP Data--------------//
    this.RVP_Data = [];
    this.RVP_Data = this.Form_Data['RVP'];
    this.RVP_DataObj = [];
    this.RVP_DataObj = JSON.parse(this.RVP_Data);
    this.updateInitialFieldNameAndValues();
  }

  updateInitialFieldNameAndValues() {
    var key_array = Object.keys(this.RVP_DataObj);
  }

  registerDataChangeHandler(handler: any) {
    this.dataChangeHandler = handler;
  }

  getOther_records(): any {
    this.V_SRVC_CD = this.PVP['V_SRVC_CD'] ? this.PVP['V_SRVC_CD'][0] : this.Form_Data['SRVC_CD'][0];
    this.V_PRCS_TXN_ID = this.PVP['V_PRCS_TXN_ID'][0];
    this.V_APP_ID = this.PVP['V_APP_ID'][0];
    this.APP_CD = this.PVP['V_APP_CD'][0];
    this.PRCS_CD = this.PVP['V_PRCS_CD'][0];
    this.V_SRC_ID = this.PVP['V_SRC_ID'][0];

    this.V_PRCS_ID = this.PVP['V_PRCS_ID'][0];

    this.Check_RPT_NRPT = this.Form_Data['V_EXE_CD'][0];

    this.V_SRVC_ID = this.Form_Data['SRVC_ID'][0];

    this.V_UNIQUE_ID = this.Form_Data['UNIQUE_ID'];

    this.V_READ = this.Form_Data['V_READ'][0];

    this.V_CREATE = this.Form_Data['V_CREATE'][0];

    this.V_UPDATE = this.Form_Data['V_UPDATE'][0];

    this.V_DELETE = this.Form_Data['V_DELETE'][0];

    this.V_EXECUTE = this.Form_Data['V_EXECUTE'][0];

    this.HAS_OPTIONS = this.Form_Data['HAS_OPTNS'][0].split(",");
    this.HAS_DSPLY = this.Form_Data['HAS_DSPLY'][0].split(",");
    this.DSPLY_FLD = this.Form_Data['DSPLY_FLD'][0].split(",");
    this.DISPLAY_TXT = this.Form_Data['DSPLY'][0].split(",");
    this.VLDTN = this.Form_Data['VLDTN'][0].split(",");
    this.VLDTN_ALERT_TXT = this.Form_Data['VLDTN_ALERT_TXT'][0].split(",");
    this.CNSLD_VLDTN_ALERT = this.Form_Data['CNSLD_VLDTN_ALERT'][0].split(",");
    this.PARAM_DSC = this.Form_Data['PARAM_DSC'][0].split(",");
    this.FLD_HLP_TXT = this.Form_Data['FLD_HLP_TXT'][0].split(",");

    this.FLD_TYPE = this.Form_Data['FLD_TYPE'][0].split(",");

    this.SL_APP_CD = this.StorageSessionService.getCookies('executedata')['SL_APP_CD'];

    this.SL_PRC_CD = this.StorageSessionService.getCookies('executedata')['SL_PRC_CD'];
  }

  checkOLD_Table(): any {
    if ('V_Table_Name' in this.PVP) {
      this.V_TABLE_NAME = this.PVP['V_Table_Name'][0];
      if (this.V_TABLE_NAME == null) {
        this.V_TABLE_NAME = '';
      }
    } else {
      this.V_TABLE_NAME = '';
    }
    if ('V_ID' in this.PVP) {
      this.V_ID = this.PVP['V_ID'];
    }
    if ('V_Schema_Name' in this.PVP) {
      this.V_SCHEMA_NAME = this.PVP['V_Schema_Name'][0];
      if (this.V_SCHEMA_NAME == null) {
        this.V_SCHEMA_NAME = '';
      }
      (this.V_SCHEMA_NAME);
    } else {
      this.V_SCHEMA_NAME = '';
    }
    const key_name_ar = [];
    const key_val_ar = []
    if ('V_Key_Names' in this.PVP) {
      const V_KEY_NAME_arr = this.PVP['V_Key_Names'];
      const V_KEY_VALUE_arr = this.PVP['V_Key_Values'] ? this.PVP['V_Key_Values'] : [];
      for (let i = 0; i < V_KEY_NAME_arr.length; i++) {
        if (key_name_ar.indexOf(V_KEY_NAME_arr[i]) === -1) {
          key_name_ar.push(V_KEY_NAME_arr[i]);
          if (CommonUtils.isValidValue(V_KEY_VALUE_arr[i])) {
            key_val_ar.push(V_KEY_VALUE_arr[i]);
          } else {
            key_val_ar.push("");
          }
        }
      }
    }
    this.V_KEY_NAME = key_name_ar.join("|");
    this.V_KEY_VALUE = key_val_ar.join("|");
  }

  invoke_router(res) {
    let serviceCode = null;
    if (CommonUtils.isValidValue(res['SRVC_CD']) && res['SRVC_CD'][0] === "END") {
      this.router.navigate(["/End_User/Design"], { skipLocationChange: true });
    } else {
      var timeout = res['RESULT'][0].toString().substring(0, 7) == "TIMEOUT";
      if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
        this.app.fromNonRepForm = true;
        this.repeatCallTable(true);
      } else if (res['RESULT'][0] === 'SUCCESS' || res['RESULT'][0] === 'COMPLETED') {
        this.router.navigate(["/End_User/Design"], { skipLocationChange: true });
      } else {
        this.StorageSessionService.setCookies('report_table', res);
        if (res['RESULT'] == 'INPUT_ARTFCT_TASK') {
          this.router.navigate(['/End_User/InputArtForm'], {
            skipLocationChange: true, queryParams: { page: 1 }
          });
        } else if (res['RESULT'][0] == 'NONREPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/NonRepeatForm'], {
            skipLocationChange: true,
            queryParams: { page: 1 }
          });
        } else if (res['RESULT'][0] == 'REPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/RepeatForm'], {
            skipLocationChange: true, queryParams: { page: 1 }
          });
        } else if (res['RESULT'] == 'TABLE') {
          this.router.navigate(['/End_User/ReportTable'], {
            skipLocationChange: true, queryParams: { page: 1 }
          });
        } else {
          this.repeatCallTable(true);
        }
      }
    }
  }

  repeatCallTable(data: any): void {
    if (data && this.repeat < this.ctrl_variables.repeat_count) {
      this.repeat++;
      this.GenerateReportTable();
    } else {
      this.repeat = 0;
      this.router.navigate(["/End_User/Design"], { skipLocationChange: true });
    }
  }
  GenerateReportTable() {
    if (!this.app.loadingCharts)
      this.app.loadingCharts = true;
    if (this.app.fromNonRepForm) {
      this.app.fromNonRepForm = false;
      this.Execute_res_data = this.StorageSessionService.getCookies('executeresdata');
    }
    const body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      V_USR_ID: JSON.parse(sessionStorage.getItem('u')).USR_ID,
      REST_Service: 'Report',
      Verb: 'POST'
    };

    // secure

    this.https.post(this.aptUrlPost_report_new, body, this.apiService.setHeaders())
      .subscribe(
        (res: any) => {
          if (res._body !== '{}') {
            this.globals.Report = JSON.parse(res._body)
            this.StorageSessionService.setCookies('report_table', res.json());
            this.check_data = res.json();
            this.app.loadingCharts = false;
            this.report = res.json();
            var timeout = res.json().RESULT.toString().substring(0, 7) == "TIMEOUT";
            if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
              this.repeatCallTable(true);
            } else if (this.report.RESULT == 'TABLE') {

              this.router.navigateByUrl('/End_User/ReportTable', {
                skipLocationChange: true, queryParams: { page: 1 }
              });
            } else if (this.report.RESULT[0] == 'INPUT_ARTFCT_TASK') {

              this.router.navigateByUrl('/End_User/InputArtForm', {
                skipLocationChange: true, queryParams: { page: 1 }
              });

            } else if (CommonUtils.isValidValue(this.report.V_EXE_CD)) {

              if (this.report.RESULT[0] == 'NONREPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/NonRepeatForm', {
                  queryParams: { page: 1 }, skipLocationChange: true
                });
              } else if (this.report.RESULT[0] == 'REPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/RepeatForm', {
                  skipLocationChange: true, queryParams: { page: 1 }
                });
              }
            } else {
              this.repeatCallTable(true);
            }
            this.StorageSessionService.setCookies('App_Prcs', { 'V_APP_CD': this.SL_APP_CD, 'V_PRCS_CD': this.SL_PRC_CD });
          } else {
            this.router.navigate(['End_User/Design'], { queryParams: { page: 1 }, skipLocationChange: true });
          }
        }
      );
  }
  set_fieldWidth(): any {
    //--------Setting MAX_COL_PER_PAGE as width---------//
    var allWidths = this.Form_Data["MAX_COL_PER_PAGE"][0].split(",");
    var total = 0;

    for (let i = 0; i < allWidths.length; i++) {
      (allWidths[i]);
      allWidths[i] = allWidths[i].split('\'').join('');
      total += (100 / (parseInt(allWidths[i])));
      this.formWidth[this.RVP_labels[i]] = (100 / (parseInt(allWidths[i]))) - 2.5;
      this.totalWidth_rep += (100 / (parseInt(allWidths[i]))) - 2.5;
      if (total >= 100 && this.margin === 0) {
        this.margin = 2.5 / (i + 1);
      }
    }
    this.totalWidth_rep += this.margin * allWidths.length;

  }
  onChange_PhoneDash(event): any {
    var setVal = event.toString();
    if (setVal.length < 11) {
      let noDash = setVal.split('-').join('');
      if (noDash.length > 0) {
        noDash = noDash.match(new RegExp('.{1,3}', 'g')).join('-');
      }
      this.phoneDash_Input = noDash;
    }

  }

  allow_PhoneDash_format(event): any {
    return (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 45;

  }
  set_fieldType(): any {
    const allTypes = this.Form_Data["FLD_TYPE"][0].split(",");
    for (let i = 0; i < this.RVP_labels.length; i++) {
      const temp = allTypes[i].trim();
      let fieldType = temp.substring(1, temp.length - 1);
      if (fieldType === "Normal String") {
        fieldType = "input";
      }
      this.fieldType[this.RVP_labels[i]] = fieldType;
    }
  }

  getOptional_values(V_PARAM_NM, display_label) {
    const secureUrl = this.apiUrlGetSecured + 'V_SRC_CD=' + this.V_SRC_CD + '&V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.V_SRVC_CD + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);

    // secure
    this.apiService.requestSecureApi(secure_encoded_url, 'get').subscribe(
      res => {
        (res);
        const resData = res.json();
        this.options[display_label] = resData[V_PARAM_NM];
      });
  }

  // 10th April
  setDropDownValues(V_PARAM_NM, display_label, index) {
    this.options[display_label] = this.RVP_Values[index];
  }

  set_fieldType_OLD(parameter: string) {
    var initParam = parameter;
    parameter = parameter.replace(new RegExp(' ', 'g'), '_');
    parameter = parameter.toLowerCase();
    if (parameter.startsWith("date_") || parameter.endsWith("_date")) {
      this.fieldType[initParam] = 'date';
    }
    else if (parameter.includes("password")) {
      this.fieldType[initParam] = 'password';
    }
    else {
      this.fieldType[initParam] = 'input';
    }
  }
}
