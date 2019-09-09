
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { StorageSessionService } from './storage-session.service';
import { Observable } from 'rxjs';
import { Globals } from './globals';
import { CommonUtils } from '../common/utils';
import { ApiService } from '../service/api/api.service';
import { BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})

export class ConfigServiceService {
  domain_name = this.globals.domain_name;
  chartPreferences: any = [];

  chartSelection: any = {chartNo:'',chartPreferences:[],update:false,selection:''};
  chartposition: any = [];
  ReportTable_data: any;

  chartPreferencesChange = new BehaviorSubject<any>(this.chartPreferences);

  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  constructor(private http: Http, private https: HttpClient, private apiService: ApiService,
    private StorageSessionService: StorageSessionService, private globals: Globals) {

  }

  private apiUrlGet = this.apiService.endPoints.insecure;
  private apiUrlGetSecure = this.apiService.endPoints.secure;
  private apiUrlPost = "https://" + this.domain_name + "/";
  private fieldConfig: { [key: string]: IFormFieldConfig } = {};
  //-------------TAB GROU
  public getJSON(): Observable<any> {
    return this.http.get("assets/label/label.json")
  }

  public prepareAndGetFieldConfigurations(form_data, hasArrayOfArr = false) {
    const paramNameArray = this.prepareArrayFromFormDataKey(form_data, "PARAM_NM", hasArrayOfArr);
    const fieldConfigDetails: { [key: string]: IFormFieldConfig } = {};
    if (paramNameArray.length > 0) {
      let index = -1;
      for (let param of paramNameArray) {
        index++;
        if (!CommonUtils.isValidValue(fieldConfigDetails[param])) {
          const CSS_CD_Array = this.prepareArrayFromFormDataKey(form_data, "CSS_CD", hasArrayOfArr);
          const HIDDEN_array = this.prepareArrayFromFormDataKey(form_data, "HIDDEN", hasArrayOfArr);
          const MANDATORY_FLD_array = this.prepareArrayFromFormDataKey(form_data, "MANDATORY_FLD", hasArrayOfArr);
          const MAX_LENGTH_array = this.prepareArrayFromFormDataKey(form_data, "MAX_LENGTH", hasArrayOfArr);
          const READ_ONLY_array = this.prepareArrayFromFormDataKey(form_data, "READ_ONLY", hasArrayOfArr);
          const PARAM_DSC_array = this.prepareArrayFromFormDataKey(form_data, "PARAM_DSC", hasArrayOfArr);
          const param_css_cd_value = CSS_CD_Array[index];
          const isParamHidden = HIDDEN_array[index] === "N" ? false : true;
          const isParamMendatory = MANDATORY_FLD_array[index] === "N" ? false : true;
          const param_max_length = MAX_LENGTH_array[index];
          const paramTooltip = PARAM_DSC_array[index];
          let isParamReadOnly = READ_ONLY_array[index] === "N" ? false : true;
          if (!isParamReadOnly && param_css_cd_value === "'disabled'") {
            isParamReadOnly = true;
          }
          let fieldClass = "";
          if (CommonUtils.isValidValue(param_css_cd_value)) {
            fieldClass = "field-config_" + param_css_cd_value.replace(" ", "_");
          }
          const fieldConfigObj = {
            fieldClass,
            isParamReadOnly,
            isParamHidden,
            isParamMendatory,
            maxLength: param_max_length,
            paramTooltip,
          }
          if (hasArrayOfArr) {
            param = param.replace(new RegExp('_', 'g'), ' ').trim();
          }
          fieldConfigDetails[param] = fieldConfigObj;
        }

      }
    }
    // 10th April solved error
    // } else {
    //   console.error("Param name is not provided in form data");
    //   console.error(form_data);
    // }
    return this.fieldConfig = fieldConfigDetails;
  }

  public isFieldInvalid(modelReference: any) {
    return modelReference && modelReference.invalid && (modelReference.touched || modelReference.dirty);
  }

  public getICN() {
    return this.https.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=ICN&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Masters&Verb=GET");
  }

  public getFieldInValidMsg(modelReference: any, fieldName: string) {
    let msg = fieldName + " is not valid";
    if (CommonUtils.isValidValue(modelReference.errors)) {
      if (modelReference.errors.invalid) {
        msg = "";
      } else if (modelReference.errors.pattern) {
        msg = fieldName + " is not valid";
      } else if (modelReference.errors.maxLength) {
        msg = fieldName + " should not be more then " + this.getFieldMaxLength(fieldName);
      }
    }
    return msg;
  }


  public getFieldClass(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName])) {
      return this.fieldConfig[paramName].fieldClass;
    }
    return "";
  }

  public isFieldHidden(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName]) && this.fieldConfig[paramName].isParamHidden) {
      return true;
    }
    return false;
  }

  public isFieldDisabled(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName]) && this.fieldConfig[paramName].isParamReadOnly) {
      return true;
    }
    return false;
  }

  public isFieldMendatory(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName]) && this.fieldConfig[paramName].isParamMendatory) {
      return true;
    }
    return false;
  }

  public getFieldMaxLength(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName]) && this.fieldConfig[paramName].maxLength) {
      return this.fieldConfig[paramName].maxLength > 0 ? this.fieldConfig[paramName].maxLength : -1;
    }
    return 0;
  }

  public getFieldTooltip(paramName: string) {
    if (CommonUtils.isValidValue(this.fieldConfig[paramName]) && this.fieldConfig[paramName].paramTooltip && (this.fieldConfig[paramName].paramTooltip !== "TBD" && this.fieldConfig[paramName].paramTooltip !== "'TBD'")) {
      return this.fieldConfig[paramName].paramTooltip;
    }
    return null;
  }

  public getMaxLengthForField(type: string) {
    let maxLength = null;
    switch (type) {
      case "Phone Dash":
        maxLength = 12;
        break;
      case "Phone Bracket":
        maxLength = 14;
        break;
      case "Zipecode":
        maxLength = 10
        break;
    }
    return maxLength;
  }

  public getValidationPattern(type: string) {
    let maxLength = null;
    switch (type) {
      case "Phone Dash":
        maxLength = 12;
        break;
      case "Phone Bracket":
        maxLength = 14;
        break;
      case "Zipecode":
        maxLength = "^[0-9]{5}(?:-[0-9]{4})?$";
        break;
      default:
        maxLength = null;
        break;
    }
    return maxLength;
  }

  public transformFieldValueOnChange(event: any, type: string): any {
    let setVal = event.target.value;
    let valueToSet = setVal;
    switch (type) {
      case "Phone Dash":
        valueToSet = this.changeValueInPhoneDashFormat(setVal);
        break;
      case "Phone Bracket":
        valueToSet = this.changeValueInPhoneBracketFormat(setVal);
        break;
      case "Zipecode":
        valueToSet = this.changeValueInZipcodeFormat(setVal);
        break;
      case "Currency":
        valueToSet = this.changeValueForCurrencyFormat(setVal);
        break;
    }
    if (CommonUtils.isValidValue(valueToSet)) {
      event.target.value = valueToSet;
    }
  }

  public getFieldTypeForChange(type) {
    if (type === "Phone Dash" || type === "Phone Bracket" || type === "Zipecode" || type === "Currency") {
      return type;
    } else {
      return "no-match";
    }
  }

  private changeValueInPhoneDashFormat(value) {
    if (value.length < 11 && value.length > 0) {
      let noDash = value.split('-').join('');
      if (noDash.length > 0) {
        noDash = noDash.match(new RegExp('.{1,3}', 'g')).join('-');
      }
      return noDash;
    }
    return value;
  }

  private changeValueInPhoneBracketFormat(value) {
    const input = value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) { value = `(${zip}) ${middle} - ${last}`; }
    else if (input.length > 3) { value = `(${zip}) ${middle}`; }
    else if (input.length > 0) { value = `(${zip}`; }
    return value;
  }

  private changeValueInZipcodeFormat(value) {
    if (value.length < 10 && value.length > 0) {
      let noDash = value.split('-').join('');
      if (noDash.length > 0) {
        noDash = noDash.match(new RegExp('.{1,5}', 'g')).join('-');
      }
      return noDash;
    }
  }

  private changeValueForCurrencyFormat(value) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = value < 0 ? "-" : "",
      i = String(parseInt(value = Math.abs(Number(value) || 0).toFixed(c))) as any;
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(value - i).toFixed(c).slice(2) : "");
  }

  private prepareArrayFromFormDataKey(form_data, key, hasArrayOfArr) {
    let arrayToReturn = [];
    if (key && CommonUtils.isValidValue(form_data[key]) && CommonUtils.isValidValue(form_data[key][0])) {
      const stringSequence = hasArrayOfArr ? form_data[key][0].replace(/'/g, '') : form_data[key];
      arrayToReturn = hasArrayOfArr ? stringSequence.split(",") : stringSequence;
      arrayToReturn = arrayToReturn.map(s => s.trim());

    }
    return arrayToReturn;
  }

  checkUserPwd(email: any) {
    return this.http.get(this.apiUrlGet + "V_USR_NM=" + email + "&V_ACTN_NM=LOGIN&REST_Service=UserValidity&Verb=GET").pipe(
      map((data: Response) => data));
  }
  // async getPrice(currency: string): Promise<number> {
  //   const response = await this.http.get('http://api.coindesk.com/v1/bpi/currentprice.json').toPromise();
  //   return response.json().bpi[currency].rate;
  // }
  checkLoginPassword(data: any) {
    let body = {
      "V_USR_NM": data.email,
      "V_PSWRD": data.pass,
      "V_ACTN_NM": "LOGIN",
      "RESULT": "@RESULT"
    };
    var aa = JSON.stringify(body);
    return this.http.post(this.apiUrlPost + "CheckUsr", aa).pipe(
      map((data: Response) => data.json()));
  }

  checkOrganization(organization: any) {
    let body = {
      "V_SRC_CD": organization,
      "RESULT": "@RESULT"
    };
    var aa = JSON.stringify(body);
    return this.http.post(this.apiUrlPost + "CheckSrc", aa).pipe(
      map((data: Response) => data.json()));
  }

  sendConfirmMail(data: any) {
    let body = {
      "V_USR_NM": data.email,
      "V_PSWRD": data.pass,
      "SRC_CD": data.agency,
      "message": "Please confirm your login..."
    };
    var aa = JSON.stringify(body);
    return this.http.post(this.apiUrlPost + "SendEmail", aa).pipe(
      map((data: Response) => data.json()));
  }

  Execute_Now() {
    var headers = new Headers();
    headers.append('application', 'json');
    let body = {
      "V_APP_CD": 'Federal Contracts',
      "V_PRCS_CD": 'Federal Opportunities',
      "V_SRVC_CD": 'START',
      "V_SRC_CD": 'local13',
      "V_USR_NM": 'local13@adventbusiness.com'

    };
    var aa = JSON.stringify(body);
    return this.https.post("https://" + this.domain_name + "/rest/Process/Execute", aa)
      ;

  }

  onPause(TriggerKey, JobKey) {
    ('onPause!!!');
    // (TriggerKey);

    var headers = new Headers();
    headers.append('application', 'json');
    let body = {
      "TriggerKey": TriggerKey,
      "JobKey": JobKey,
      "Operation": ["Pause"]
    };

    // var aa = JSON.stringify(body);
    return this.https.post("https://" + this.domain_name + "/rest/Hold/ScheduleAction", body)
  }

  onResume(TriggerKey, JobKey) {
    ('RESUME!!!');

    var headers = new Headers();
    headers.append('application', 'json');
    let body = {
      "TriggerKey": TriggerKey,
      "JobKey": JobKey,
      "Operation": ["Resume"]
    };

    return this.https.post("https://" + this.domain_name + "/rest/Hold/ScheduleAction", body)
  }

  onKill(TriggerKey, JobKey) {
    ('KILL!!!');
    var headers = new Headers();
    headers.append('application', 'json');
    let body = {
      "TriggerKey": TriggerKey,
      "JobKey": JobKey,
      "Operation": ["Kill"]
    };

    return this.https.post("https://" + this.domain_name + "/rest/Hold/ScheduleAction", body)
  }

  getUserId(data: any) {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=SRC&V_SRC_CD=" + data + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=SRC&V_SRC_CD=" + data + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
  }

  getExecutableType() {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=EXE&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=EXE&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
  }

  getPlatformType() {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=server&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=server&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
    //  V_CD_TYP=server&V_SRC_CD=Advent%20Business%20Company%20Inc.%20&SCREEN=PROFILE&REST_Service=Masters&Verb=GET


    // return this.http.get(this.apiUrlGet + "V_EXE_CD="+EXE_CD+"&V_SRC_CD=" + this.V_SRC_CD +"&V_APP_CD="+this.V_APP_CD+"&SCREEN=PROFILE&REST_Service=Masters&Verb=GET");

  }
  //  /v1/secured?V_EXE_CD=GetRefulingDistanceTimeFuel&V_SRC_CD=local&V_APP_CD=ALL&V_PRCS_CD=Contracts%20Opportunities&V_USR_NM=local@adventbusiness.com&V_TRIGGER_STATE=ALL&REST_Service= Exe_Server&Verb=GET

  getPlatformDescription(PLF_CD) {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=SERVER&V_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Description&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=SERVER&V_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Description&Verb=GET", this.apiService.setHeaders());
    // return this.http.get("https://"+this.domain_name+"/rest/v1/secured?V_CD_TYP=ROLE&V_SRC_CD=Advent%20Business%20Company%20Inc.&REST_Service=Masters&Verb=GET")
  }

  getRoleCode() {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=ROLE&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Masters&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=ROLE&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
  }

  getRoleDescription(ROLE_CD) {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=ROLE&V_CD=" + ROLE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Description&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=ROLE&V_CD=" + ROLE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Description&Verb=GET", this.apiService.setHeaders());

  }

  getAccessRights(ROLE_CD, EXE_CD_R, EXE_TYPE_R) {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=EXE&V_SRC_CD=" + this.V_SRC_CD + "&V_CODE=" + EXE_CD_R + "&V_ROLE_CD=" + ROLE_CD + "&V_APP_CD=&V_PRCS_CD=&V_EXE_TYP=" + EXE_TYPE_R + "&V_ASSET_TYP=&REST_Service=Access&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=EXE&V_SRC_CD=" + this.V_SRC_CD + "&V_CODE=" + EXE_CD_R + "&V_ROLE_CD=" + ROLE_CD + "&V_APP_CD=&V_PRCS_CD=&V_EXE_TYP=" + EXE_TYPE_R + "&V_ASSET_TYP=&REST_Service=Access&Verb=GET", this.apiService.setHeaders());

  }

  sendParams(body) {
    // return this.http.put(this.apiUrlGet + "V_EXE_CD=" + EXE[] + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Description&Verb=GET");
    return this.http.put("https://" + this.domain_name + "/rest/v1/secured", body);

  }

  getDeploymentStatus() {

  }

  // }getExecutableCode
  getExecutableCode(EXE_TYPE: any) {
    // return this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_EXE_TYP=" + EXE_TYPE + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=User_Executables&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_SRC_CD=" + this.V_SRC_CD + "&V_EXE_TYP=" + EXE_TYPE + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=User_Executables&Verb=GET", this.apiService.setHeaders());
  }

  getExecutableAll(EXE_TYPE, EXE_CD: any) {
    // return this.http.get(this.apiUrlGet + "V_UNIQUE_ID=&V_EXE_TYP=" + EXE_TYPE + "&V_EXE_CD=" + EXE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Exe_Detail&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_UNIQUE_ID=&V_EXE_TYP=" + EXE_TYPE + "&V_EXE_CD=" + EXE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Exe_Detail&Verb=GET", this.apiService.setHeaders());
  }

  //Undefine Button executables
  doDelete(EXE_TYPE, EXE_CD) {
    ("UNDEFINE");
    return this.http.delete(this.apiUrlGet + "V_EXE_TYP=" + EXE_TYPE + "&V_EXE_CD=" + EXE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Exe&Verb=DELETE");
    // { "V_EXE_TYP": ["VARCHAR"], "V_EXE_CD": ["VARCHAR"], "V_SRC_CD": ["VARCHAR"], "REST_Service": ["Exe"], "Verb": ["DELETE"] }


  }

  // ____________DEPLOYMENT- MACHINE_______________

  getMachineCode() {
    // return this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=Users_Machines&Verb=GET" ).pipe(
    //   map((data: Response) => data));

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=Users_Machines&Verb=GET", this.apiService.setHeaders());

  }

  getMachineDetails(PLF_CD) {
    // return this.http.get(this.apiUrlGet + "V_PLATFORM_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_PLATFORM_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine&Verb=GET", this.apiService.setHeaders());


  }
  // deleteSelectedMachine(PLF_CD){
  //   return this.http.delete(this.apiUrlGet + "V_PLATFORM_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine&Verb=DELETE");
  // }

  getAddMachineDetails(PLF_CD) {
    // return this.http.get(this.apiUrlGet + "V_PLATFORM_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine_Detail&Verb=GET");

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_PLATFORM_CD=" + PLF_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine_Detail&Verb=GET", this.apiService.setHeaders());
  }
  //_____________________________LAKVERR
  getApplicationSelectBoxValues() {
    let agency = this.V_SRC_CD;
    let body = {
      "V_SRC_CD": agency,
      "RESULT": "@RESULT"
    };
    var aa = JSON.stringify(body);
    return this.http.post(this.apiUrlPost + "/SubmitSrcCode", aa).pipe(
      map((data: Response) => data.json()));
  }

  getProcessSelectBoxValues(appName: any) {
    let agency = this.V_SRC_CD;
    let email = this.V_USR_NM;
    let body = {
      "V_SRC_CD": agency,
      "V_APP_CD": appName,
      "V_USR_NM": email
    };
    var aa = JSON.stringify(body);
    return this.http.post(this.apiUrlPost + "/SubmitAppCode", aa).pipe(
      map((data: Response) => data.json()));
  }

  newScheduleJobCtl(data: any) {
    var aa = JSON.stringify(data);
    return this.http.post(this.apiUrlPost + "/NewScheduleJobCtl", aa).pipe(
      map((data: Response) => data.json()));
  }

  manualSubmitCtl(data: any) {
    var aa = JSON.stringify(data);
    return this.http.post(this.apiUrlPost + "/ManualSubmitCtl", aa).pipe(
      map((data: Response) => data.json()));
  }



  getAppId(data: any) {
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=APP&V_SRC_CD=" + data + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=APP&V_SRC_CD=" + data + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
  }

  SLCT_MANUAL_INPUT_DBDATA() {
    // return this.http.get(this.apiUrlGet + "V_SRC_ID=198&V_APP_ID=136&V_PRCS_ID=287&V_PRCS_TXN_ID=3042&V_UNIQUE_ID=1569&%20&REST_Service=Form&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_SRC_ID=198&V_APP_ID=136&V_PRCS_ID=287&V_PRCS_TXN_ID=3042&V_UNIQUE_ID=1569&%20&REST_Service=Form&Verb=GET", this.apiService.setHeaders());

  }
  //--------------------------------------------
  //______________USER___________________________________________________________
  applicationCode() {
    // return this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET", this.apiService.setHeaders());
  }

  processCode(SL_APP_CD) {
    // return this.http.get(this.apiUrlGet + "V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET", this.apiService.setHeaders());
  }

  serviceCode(SL_APP_CD, SL_PRCS_CD) {
    // return this.http.get(this.apiUrlGet + "V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + SL_PRCS_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + SL_PRCS_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET", this.apiService.setHeaders());

  }

  getID(SL_APP_CD, SL_PRCS_CD, SL_SRVC_CD) {
    // return this.http.get(this.apiUrlGet + "V_SRVC_CD=" + SL_SRVC_CD + "&V_PRCS_CD=" + SL_PRCS_CD + "&V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Service_Ids&Verb=GET" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_SRVC_CD=" + SL_SRVC_CD + "&V_PRCS_CD=" + SL_PRCS_CD + "&V_APP_CD=" + SL_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Service_Ids&Verb=GET", this.apiService.setHeaders());
    //V_SRVC_CD=Load%20Contracts%20to%20DB&V_PRCS_CD=Contract%20Opportunities&V_APP_CD=Federal%20Contracts&V_SRC_CD=Angular%20Migration&REST_Service=Service_Ids&Verb=GET

  }



  getDeployStatus(UNIQUE_ID, SL_SRC_ID, SL_APP_ID, SL_PRCS_ID, SL_SRVC_ID) {
    (this.apiUrlGet + "V_UNIQUE_ID=" + UNIQUE_ID + "&V_SRC_ID=" + SL_SRC_ID + "&V_APP_ID=" + SL_APP_ID + "&V_PRCS_ID=" + SL_PRCS_ID + "&V_SRVC_ID=" + SL_SRVC_ID + "&FULL_DTL_FLG=Y&AVL_DTL_FLG=N&REST_Service=DeploymentStatus&Verb=GET");
    // return this.http.get(this.apiUrlGet + "V_UNIQUE_ID=" + UNIQUE_ID + "&V_SRC_ID=" + SL_SRC_ID + "&V_APP_ID=" + SL_APP_ID + "&V_PRCS_ID=" + SL_PRCS_ID + "&V_SRVC_ID=" + SL_SRVC_ID + "&FULL_DTL_FLG=Y&AVL_DTL_FLG=N&REST_Service=DeploymentStatus&Verb=GET" );

    //secure
    return this.http.get(this.apiUrlGetSecure + "V_UNIQUE_ID=" + UNIQUE_ID + "&V_SRC_ID=" + SL_SRC_ID + "&V_APP_ID=" + SL_APP_ID + "&V_PRCS_ID=" + SL_PRCS_ID + "&V_SRVC_ID=" + SL_SRVC_ID + "&FULL_DTL_FLG=Y&AVL_DTL_FLG=N&REST_Service=DeploymentStatus&Verb=GET", this.apiService.setHeaders());
  }
  getAppCode(vSRCcd) {
    this.V_SRC_CD = vSRCcd;
    (this.apiUrlGet + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET");
    // return this.http.get(this.apiUrlGet + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_CD_TYP=APP&V_SRC_CD=" + this.V_SRC_CD + "&SCREEN=PROFILE&REST_Service=Masters&Verb=GET", this.apiService.setHeaders());
  }
  getProcessCD(V_APP_CD: any) {
    //V_CD_TYP=PRCS&V_SRC_CD="+this.V_SRC_CD+"&SCREEN=PROFILE&REST_Service=Masters&Verb=GET
    //"
    // return this.http.get(this.apiUrlGet + "V_APP_CD=" + V_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_APP_CD=" + V_APP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET", this.apiService.setHeaders());
  }

  find_process(ApplicationCD, ProcessCD, StatusCD) {

    return this.https.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + ApplicationCD + "&V_PRCS_CD=" + ProcessCD + "&V_USR_NM=" + this.V_USR_NM + "&V_TRIGGER_STATE=" + StatusCD + "&REST_Service=ScheduledJobs&Verb=GET"
    );
    // this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + ApplicationCD + "&V_PRCS_CD=" + ProcessCD + "&V_USR_NM=" + this.V_USR_NM + "&V_TRIGGER_STATE=" + StatusCD + "&REST_Service=ScheduledJobs&Verb=GET"


    //  https://enablement.us/rest/v1/secured?V_SRC_CD=local&V_APP_CD=ALL&V_PRCS_CD=Contracts%20Opportunities&V_USR_NM=local@adventbusiness.com&V_TRIGGER_STATE=ALL&REST_Service=ScheduledJobs&Verb=GET
  }
  Execute_AP_PR(SL_APP_CD, SL_PRC_CD) {
    // return this.http.get(this.apiUrlGet + "V_APP_CD=" + SL_APP_CD + "&V_PRCS_CD=" + SL_PRC_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=PorcessParameters&Verb=GET" );
    // secure
    return this.http.get(this.apiUrlGetSecure + "V_APP_CD=" + SL_APP_CD + "&V_PRCS_CD=" + SL_PRC_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=PorcessParameters&Verb=GET", this.apiService.setHeaders());
  }
  exec_schd_restCall(FormData, ref) {
    let ParametrValue: any[] = FormData['PARAM_VAL']
    const ParameterName: any[] = FormData['PARAM_NM'];
    const ParameterType: any[] = FormData['FLD_TYPE'];
    const ParameterHasOptions: any[] = FormData['HAS_OPTNS'];
    const ParameterHasDisplay: any[] = FormData['HAS_DSPLY'];
    const ParamterDisplay: any[] = FormData['DSPLY'];
    const ParamterDisplayField: any[] = FormData['DSPLY_FLD'];
    const ParamterValidation: any[] = FormData['VLDTN'];
    const ParameterValidationAlertText: any[] = FormData['VLDTN_ALERT_TXT'];
    const ParameterCnsldtVldtnAlert: any[] = FormData['CNSLD_VLDTN_ALERT'];
    const ParamterHelpText: any[] = FormData['FLD_HLP_TXT'];
    const ParamterDescription: any[] = FormData['PARAM_DSC'];

    var result: any = {};
    var Data: any = [];
    var k;

    if (!CommonUtils.isValidValue(ParametrValue)) {
      ParametrValue = [];
    }

    for (let i = 0; i < ParameterName.length; i++) {
      let currentVal = [];
      if (CommonUtils.isValidValue(ParametrValue[i])) {
        currentVal = ParametrValue[i].split(',');
        // remove empty values
        currentVal = currentVal.filter(function (el) {
          return el !== "";
        });
        currentVal = CommonUtils.removeDuplicate(currentVal);
      } else {
        currentVal[0] = null;
      }
      const fieldObj: any = {};
      const currentKey = ParameterName[i];
      result[currentKey] = currentVal;
      fieldObj.name = ParameterName[i];
      fieldObj.placeholder = ParameterName[i];
      if (ParameterHasDisplay[i] === 'Y') {
        fieldObj.display = ParamterDisplay[i];
      } else {
        fieldObj.display = ParameterName[i];
      }

      if (ParameterHasOptions) {
        fieldObj.hasOptions = ParameterHasOptions[i];
      }
      if (ParamterDisplayField[i] === 'Y') {
        fieldObj.hasfield = true;
      } else {
        fieldObj.hasfield = false;
      }
      if (CommonUtils.isValidValue(ParameterType) && CommonUtils.isValidValue(ParameterType[i]) && ParameterType[i] !== "") {
        fieldObj.type = ParameterType[i] || "input";
      } else {
        fieldObj.type = "input";
      }
      fieldObj.helptext = ParamterHelpText[i];
      if (fieldObj.type === "Checkbox" || fieldObj.type === "openlist") {
        // need value as array
        fieldObj.value = [currentVal[0]];
      } else {
        fieldObj.value = currentVal[0];
      }

      // log incorrect values if found
      if (fieldObj.type === "Checkbox" || fieldObj.type === "Radio Button" || fieldObj.type === "openlist") {
        if (currentVal.length === 1 && currentVal[0] == null) {
          // console.error("Invalid values provided for parameter " + fieldObj.name);
        }
      }

      Data.push(fieldObj);
      if (ParametrValue.length > 0) {
        ref['disp_dyn_param'] = true;
      }
      k = i;
    }
    var b;
    (ParametrValue.length > 0) ? b = true : b = false;
    return { Data: Data, Result: result, B: b, K: k };
  }


  functionDemo() {
    // return this.http.get("https://" + this.domain_name + "/rest/v1/secured?V_SRC_CD=exeserver&V_EXE_TYP=E_REST&V_USR_NM=exeserver@adventbusiness.com&REST_Service=UserExes&Verb=GET" );

    // secure
    return this.http.get(this.apiService.endPoints.secure + "V_SRC_CD=exeserver&V_EXE_TYP=E_REST&V_USR_NM=exeserver@adventbusiness.com&REST_Service=UserExes&Verb=GET", this.apiService.setHeaders());
  }

  //__________________________________________________User >> execute page ALL REST API________

  getDropDownListValue(V_APP_CD: any, V_PRCS_CD: any, V_PARAM_NM: any) {
    // this.http.get(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + V_APP_CD + "&V_PRCS_CD=" + V_PRCS_CD + "&V_PARAM_NM=" + V_PARAM_NM + "&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET" ).subscribe(
    //   res => {
    //     return res.json();
    //   }
    // );
    // secure
    this.http.get(this.apiUrlGetSecure + "V_SRC_CD=" + this.V_SRC_CD + "&V_APP_CD=" + V_APP_CD + "&V_PRCS_CD=" + V_PRCS_CD + "&V_PARAM_NM=" + V_PARAM_NM + "&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET", this.apiService.setHeaders()).subscribe(
      res => {
        return res.json();
      }
    );
  }


  //_______________________________CHART STYLING CONFIG____________________________________
  // V_APP_ID, V_PRCS_ID, V_SRC_ID
  getchartstyling(UNIQUE_ID, V_SRC_ID) {
    console.log(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_SRC_ID=" + V_SRC_ID + "&V_UNIQUE_ID=" + UNIQUE_ID + "&REST_Service=User_Preference&Verb=GET", this.apiService.setHeaders());
    // console.log(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_SRC_ID=" + V_SRC_ID + "&V_APP_ID=" + V_APP_ID + "&V_PRCS_ID=" + V_PRCS_ID + "&REST_Service=User_Preference&Verb=GET");
    return this.http.get(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_SRC_ID=" + V_SRC_ID + "&V_UNIQUE_ID=" + UNIQUE_ID + "&REST_Service=User_Preference&Verb=GET", this.apiService.setHeaders());
  }

  setchartstyling(UNIQUE_ID, V_SRC_ID, V_PRF_NM, V_PRF_VAL) {
    // return this.http.get(this.apiUrlGet + "V_USR_NM=" + this.V_USR_NM + "&V_PRF_NM=" + V_PRF_NM + "&V_PRF_VAL=" + V_PRF_VAL + "&V_SRC_ID=" + V_SRC_ID + "&V_APP_ID=" + V_APP_ID + "&V_PRCS_ID=" + V_PRCS_ID + "&REST_Service=User_Preference&Verb=PATCH" );

    // secure
    return this.http.get(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_PRF_NM=" + V_PRF_NM + "&V_PRF_VAL=" + V_PRF_VAL + "&V_SRC_ID=" + V_SRC_ID + "&V_UNIQUE_ID=" + UNIQUE_ID + "&REST_Service=User_Preference&Verb=PATCH", this.apiService.setHeaders());
  }

  deletechartstyling(UNIQUE_ID, V_SRC_ID, V_PRF_NM, V_ITM_ID){
    return this.http.get(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_PRF_NM=" + V_PRF_NM + "&V_UNIQUE_ID=" + UNIQUE_ID + "&V_ITM_ID=" + V_ITM_ID + "&V_SRC_ID=" + V_SRC_ID + "&REST_Service=User_Preference&Verb=DELETE", this.apiService.setHeaders());
    //enablement.us/Enablement/rest/v1/secured?V_USR_NM=VARCHAR&V_PRF_NM=VARCHAR&V_UNIQUE_ID=BIGINT&V_ITM_ID=INT&V_SRC_ID=INT&REST_Service=User_Preference&Verb=DELETE
  }

  deletepreferencerow(UNIQUE_ID, V_SRC_ID, V_ITM_ID){
    return this.http.get(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_UNIQUE_ID=" + UNIQUE_ID + "&V_ITM_ID=" + V_ITM_ID + "&V_SRC_ID=" + V_SRC_ID + "&REST_Service=User_Preference&Verb=DELETE", this.apiService.setHeaders());
  }

  deleteallpreferences(V_SRC_ID){
    return this.http.get(this.apiUrlGetSecure + "V_USR_NM=" + this.V_USR_NM + "&V_SRC_ID=" + V_SRC_ID + "&REST_Service=User_Preference&Verb=DELETE", this.apiService.setHeaders());
  }
  //________________________________________________________________________________________
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

export interface IFormFieldConfig {
  fieldClass: string;
  isParamReadOnly: boolean;
  isParamHidden: boolean;
  isParamMendatory: boolean;
  maxLength: number;
  paramTooltip: string;
}
