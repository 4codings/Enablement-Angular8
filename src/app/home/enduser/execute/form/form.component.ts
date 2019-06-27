import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import * as dateFormat from 'dateformat';
import { MatTableDataSource } from '@angular/material';
import { getISODayOfWeek } from 'ngx-bootstrap/chronos/units/day-of-week';
import { encode } from 'punycode';
//import { GetFormData } from '../getDataForm';
import { FormatWidth } from '@angular/common';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { AppComponent } from '../../../../app.component';
import { CommonUtils } from '../../../../common/utils';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Globals } from 'src/app/services/globals';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { ApiService } from 'src/app/service/api/api.service';
import { HomeComponent } from 'src/app/home/home.component';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { Globals2 } from 'src/app/service/globals';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  // styleUrls: ['./form.component.css']
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

  ) { }

  domain_name = this.globals.domain_name;
  // 10th April added globals
  domain = this.globals.domain;
  suffix = this.globals.suffix;
  path = this.globals.Path;
  version = this.globals.version;
  public apiUrlGet = this.apiService.endPoints.insecure;
  public apiUrlGetSecured = this.apiService.endPoints.secure;
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

  ngOnInit() {
  }
  getFormData(): any {
    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
      // console.log(res);
    });
    this.Form_Data = [];
    this.Form_Data = this.StorageSessionService.getCookies('report_table');
    // console.log('this.Form_date', this.Form_Data);
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

    // for (let i = 0; i < this.RVP_labels.length; i++) {
    //   this.getOptional_values(this.RVP_labels[i]);
    // }


    // added get call 10th April 


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
    (this.options);
    (this.formWidth);
    (this.fieldType);

  }

  labels_toShow(): any {
    //----------------Lables to Show---------------//
    for (let i = 0; i < this.RVP_Keys.length; i++) {
      this.RVP_Values.push(this.RVP_DataObj[this.RVP_Keys[i]]);
      // if (this.RVP_Keys[i].substring(0, 2) == "V_") {

      // } else {
      this.RVP_labels.push(this.RVP_Keys[i].replace(new RegExp('_', 'g'), ' '));
      // }
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

  // updateLabelForDisplay(label: string){

  // }

  setField_RVP(): any {
    //------------Getting RVP Data--------------//
    this.RVP_Data = [];
    this.RVP_Data = this.Form_Data['RVP'];
    // 10th April removed call
    // if (this.V_TABLE_NAME.length > 0) {
    //   this.rewriteOld_data();
    // }
    ("Field Data 1:");
    (JSON.parse(this.RVP_Data));
    this.RVP_DataObj = [];
    this.RVP_DataObj = JSON.parse(this.RVP_Data);
    this.updateInitialFieldNameAndValues();
  }

  updateInitialFieldNameAndValues() {
    (this.RVP_DataObj);
    var key_array = Object.keys(this.RVP_DataObj);
    // //----------Field Names & Field Values as {"str1"|"str2"}-----------//
    // this.Field_Names = '';
    // this.Field_Values = "";
    // for (let i = 0; i < key_array.length; i++) {
    //   if (i != 0) {
    //     this.Field_Names += '|';
    //     this.Field_Values += '|';
    //   }
    //   this.Field_Names += "`" + key_array[i] + "`";
    //   this.Field_Values += "'" + this.RVP_DataObj[key_array[i]] + "'";
    // }
    // // this.RVP_Data.push('V_abcd');
    // // this.Field_Names += '|\"V_abcd\"';
    // // this.Field_Values += '|\"\"';

    // // console.log("Field_Names");
    // // console.log(this.Field_Names);
    // // console.log("Field_Values");
    // // console.log(this.Field_Values);
  }

  registerDataChangeHandler(handler: any) {
    this.dataChangeHandler = handler;
  }

  getOther_records(): any {
    this.V_SRVC_CD = this.PVP['V_SRVC_CD'] ? this.PVP['V_SRVC_CD'][0] : this.Form_Data['SRVC_CD'][0];

    this.V_PRCS_TXN_ID = this.PVP['V_PRCS_TXN_ID'][0];

    this.V_APP_ID = this.PVP['V_APP_ID'][0];

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
      console.log('V_ID', this.V_ID);
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
        // this.V_KEY_NAME += V_KEY_NAME_arr[i] + '|'
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


    ('V_SRVC_CD=>' + this.V_SRVC_CD + 'V_TABLE_NAME=>' + this.V_TABLE_NAME + 'V_KEY_NAME=>' + this.V_KEY_NAME + 'V_KEY_VALUE=>' + this.V_KEY_VALUE + 'V_SCHEMA_NAME=>' + this.V_SCHEMA_NAME);
  }

  invoke_router(res) {
    // console.log('setCookies');
    let serviceCode = null;
    if (CommonUtils.isValidValue(res['SRVC_CD']) && res['SRVC_CD'][0] === "END") {
      this.router.navigate(["/End_User/Execute"], { skipLocationChange: true });
    } else {
      var timeout = res['RESULT'][0].toString().substring(0, 7) == "TIMEOUT";
      // (timeout);
      if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
        this.app.fromNonRepForm = true;
        this.router.navigate(["/End_User/Execute"], { skipLocationChange: true });
      } else if (res['RESULT'][0] === 'SUCCESS' || res['RESULT'][0] === 'COMPLETED') {
        this.router.navigate(["/End_User/Execute"], { skipLocationChange: true });
      } else {
        // 10th April added for future call after token works
        const url = this.apiService.securedApiUrl + '/secured/FormSubmit';

        // // console.log('https://' + this.domain_name + '/rest/Submit/FormSubmit');
        this.StorageSessionService.setCookies('report_table', res);
        // // console.log('setCookies');
        if (res['RESULT'] == 'INPUT_ARTFCT_TASK') {
          this.router.navigate(['/End_User/InputArtForm'], { skipLocationChange: true });
        } else if (res['RESULT'][0] == 'NONREPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/NonRepeatForm'], {
            skipLocationChange: true,
            queryParams: { refresh: new Date().getTime() }
          });
        } else if (res['RESULT'][0] == 'REPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/RepeatForm'], { skipLocationChange: true });
        } if (res['RESULT'] == 'TABLE') {
          this.router.navigate(['/End_User/ReportTable'], { skipLocationChange: true });
        }
      }
    }
  }

  set_fieldWidth(): any {
    //--------Setting MAX_COL_PER_PAGE as width---------//
    var allWidths = this.Form_Data["MAX_COL_PER_PAGE"][0].split(",");
    var total = 0;

    (allWidths);
    for (let i = 0; i < allWidths.length; i++) {
      (allWidths[i]);
      allWidths[i] = allWidths[i].split('\'').join('');
      (allWidths[i]);
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
    ("Value changed");
    var setVal = event.toString();
    if (setVal.length < 11) {
      let noDash = setVal.split('-').join('');
      if (noDash.length > 0) {
        noDash = noDash.match(new RegExp('.{1,3}', 'g')).join('-');
      }
      (noDash);
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

  // 10th April commented get api call after reports

  // rewriteOld_data() {
  //   const url = this.apiUrlGet + 'V_Table_Name=' + this.V_TABLE_NAME + '&V_Schema_Name=' + this.V_SCHEMA_NAME + '&V_Key_Names=' + this.V_KEY_NAME + '&V_Key_Values=' + this.V_KEY_VALUE + '&V_SRVC_CD=' + this.V_SRVC_CD + '&V_USR_NM=' + this.V_USR_NM + '&V_SRC_CD=' + this.V_SRC_CD + '&V_PRCS_ID=' + this.V_PRCS_ID + '&REST_Service=Forms_Record&Verb=GET';
  //   const encoded_url = encodeURI(url);
  //   (encoded_url);
  //   this.http.get(encoded_url).subscribe(
  //     res => {
  //       (res);
  //       if (CommonUtils.isValidValue(res['V_ID']) && res['V_ID'].length > 0) {
  //         this.V_ID = res['V_ID'];
  //       }
  //       var res_keys = Object.keys(res);
  //       var foundKey: boolean;
  //       for (let i = 0; i < this.RVP_Keys.length; i++) {
  //         // foundKey = false;
  //         // for (let j = 0; j < res_keys.length; j++) {
  //         //   if (this.RVP_Keys[i] == res_keys[j]) {
  //         //     foundKey = true;
  //         //     break;
  //         //   }
  //         let newValue = res[this.RVP_Keys[i]];
  //         if (CommonUtils.isValidValue(newValue)) {
  //           // newValue = "";
  //           this.RVP_DataObj[this.RVP_Keys[i]] = newValue;
  //         }

  //         // if (foundKey) {
  //         //   this.RVP_DataObj[this.RVP_Keys[i]] = res[res_keys[i]];
  //         //   //RVP property updated if found in result
  //         // }

  //       }

  //       this.updateInitialFieldNameAndValues();
  //       if (CommonUtils.isValidValue(this.dataChangeHandler)) {
  //         this.dataChangeHandler();
  //       }
  //     });
  // }

  getOptional_values(V_PARAM_NM, display_label) {
    const url = this.apiUrlGet + 'V_SRC_CD=' + this.V_SRC_CD + '&V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.V_SRVC_CD + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const encoded_url = encodeURI(url);
    (encoded_url);
    ("Option Values: " + V_PARAM_NM);
    // insecure
    // this.apiService.requestInSecureApi(encoded_url, 'get').subscribe(
    //   res => {
    //     (res);
    //     const resData = res.json();
    //     this.options[display_label] = resData[V_PARAM_NM];
    //   });
    const secureUrl = this.apiUrlGetSecured + 'V_SRC_CD=' + this.V_SRC_CD + '&V_APP_CD=' + this.SL_APP_CD + '&V_PRCS_CD=' + this.SL_PRC_CD + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.V_SRVC_CD + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);
    (encoded_url);
    ("Option Values: " + V_PARAM_NM);
    const options = this.setHeaders();

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
  set_fieldType_OLD(parameter: string) {
    var initParam = parameter;
    parameter = parameter.replace(new RegExp(' ', 'g'), '_');
    parameter = parameter.toLowerCase();
    if (parameter.startsWith("date_") || parameter.endsWith("_date")) {
      ("Field type : Date");
      this.fieldType[initParam] = 'date';
    }
    else if (parameter.includes("password")) {
      ("Field Type: Password");
      this.fieldType[initParam] = 'password';
    }
    else {
      this.fieldType[initParam] = 'input';
      //this.fieldType[initParam] = 'Phone Dash';
    }
  }
}