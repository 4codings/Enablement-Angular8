import { Component, OnInit, Input, forwardRef, ChangeDetectorRef, ViewChild } from '@angular/core';
//import { GetFormData } from '../getDataForm';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { FormComponent } from '../form/form.component';
import { AppComponent } from '../../../../app.component';
import * as dateFormat from 'dateformat';
import { CommonUtils } from '../../../../common/utils';
import { Http } from '@angular/http';
import { HomeComponent } from 'src/app/home/home.component';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { Globals2 } from 'src/app/service/globals';
import { Globals } from 'src/app/services/globals';
import { ApiService } from 'src/app/service/api/api.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { EndUserService } from 'src/app/services/EndUser-service';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-repeatable-form',
  templateUrl: './repeatable-form.component.html',
  styleUrls: ['./../../../../../assets/css/threepage.css']
})
export class RepeatableFormComponent extends FormComponent implements OnInit {
  // domain_name = this.globals.domain_name;
  //  private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  //formData: GetFormData;
  private apiUrlGetSecure = this.apiService.endPoints.secure;
  public form: FormGroup;
  input: any[][] = [];
  rows = [0];
  totalRow = 1;
  edit_or_done: string[] = ["edit"];
  isDisabled: boolean[] = [true];
  ctrl_variables: Object;
  phoneDash_arr: Array<any> = [];
  plainInput_arr: Array<any> = [];
  dateEntry_arr: Array<any> = [];
  deleted: boolean[] = [false];
  currentDate: any;
  PVP_Updated: any = {};
  navigationSubscription;
  dialogRef: any;
  @ViewChild('rpForm') rpForm: any;
  constructor(
    public StorageSessionService: StorageSessionService,
    public app: HomeComponent,
    public globalUser: Globals2,
    public https: Http,
    public http: HttpClient,
    public router: Router,
    public globals: Globals,
    public cdr: ChangeDetectorRef,
    public apiService: ApiService,
    public configService: ConfigServiceService,
    private endUserService: EndUserService,
    private dialog: MatDialog,
  ) {
    super(StorageSessionService, http, https, router, globals, app, cdr, apiService, globalUser, configService);
    this.navigationSubscription = router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // alert('en'+e.urlAfterRedirects);
        this.registerDataChangeHandler(this.updateInput.bind(this));
        this.getFormData();
        this.updateInput();
        // this.ngOnInit();
      });
  }


  updateForm(form): void {
    var Field_Names_Ar = [];
    var Field_Values_Ar = [];


    for (const field_name in form) {
      if (form.hasOwnProperty(field_name) && field_name !== "iteration") {
        Field_Names_Ar.push("`" + field_name + "`");
        Field_Values_Ar.push("'" + form[field_name] + "'");
      }
    }



    const Field_Names = Field_Names_Ar.join("|");
    const Field_Values = Field_Values_Ar.join("|");

    let body_req = {
      "V_Table_Name": this.V_TABLE_NAME,
      "V_Schema_Name": this.V_SCHEMA_NAME,
      "V_SRVC_CD": this.V_SRVC_CD,
      "V_USR_NM": this.V_USR_NM,
      "V_SRC_CD": this.V_SRC_CD,
      "V_PRCS_ID": this.V_PRCS_ID
    }

    if (Field_Names !== this.Field_Names_initial) {
      body_req["Field_Names"] = Field_Names;
    }
    if (Field_Values !== this.Field_Values_initial) {
      body_req["Field_Values"] = Field_Values;
    }
    body_req["Verb"] = "POST";
    body_req["V_Key_Names"] = this.V_KEY_NAME;
    body_req["V_Key_Values"] = this.V_KEY_VALUE;
    body_req["REST_Service"] = "Forms_Record";
    if (this.V_TABLE_NAME.length && this.V_TABLE_NAME != '') {
      this.http.post(this.apiUrlGetSecure, body_req).subscribe(
        (res: any) => {
          let res_data = Object.keys(res);
          if (res_data.length) {
            if (res.RESULT[0] === 'SUCCESS') {
              this.V_ID.push(res.V_ID[0]);
            }
          }
        }
      );
    }
    //(body_FORMrec);
    //this.http.put(this.apiUrlGet, body_FORMrec).subscribe(
    // 10th April not used method
    // httpMethod(this.apiUrlGet, body_req).subscribe(
    //   res => {
    //     ("Response:\n" + res);
    //   }),
    //   err => {
    //     console.error("failure response recieved in post");
    //     console.error(err);
    //   }
  }

  deleteForm(form, index): void {


    this.dialogRef = this.dialog.open(DeleteConfirmComponent, { data: { recordName: this.V_TABLE_NAME }, disableClose: true, hasBackdrop: true });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // secure
        if (this.V_TABLE_NAME.length && this.V_TABLE_NAME != '') {
          var secure_del_URL = this.apiService.endPoints.secure + "V_Table_Name=" + this.V_TABLE_NAME + "&V_Schema_Name=" + this.V_SCHEMA_NAME + "&V_ID=" + this.V_ID[index - 1] + "&V_SRVC_CD=" + this.V_SRVC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_ID=" + this.V_PRCS_ID + "&REST_Service=Forms_Record&Verb=DELETE";

          // var secure_del_URL = this.apiService.endPoints.secure + "V_Table_Name=" + this.V_TABLE_NAME + "&V_Schema_Name=" + this.V_SCHEMA_NAME + "&V_SRVC_CD=" + this.V_SRVC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_ID=" + this.V_PRCS_ID + "&REST_Service=Forms_Record&Verb=DELETE";
          secure_del_URL = encodeURI(secure_del_URL);
          this.https.delete(secure_del_URL, this.apiService.setHeaders()).subscribe(
            res => {
              this.deleted[index] = true;
            });
        } else {
          this.deleted[index] = true;
        }
        // var insecure_del_URL = this.apiService.endPoints.insecure + "V_Table_Name=" + this.V_TABLE_NAME + "&V_Schema_Name=" + this.V_SCHEMA_NAME + "&V_ID=" + this.V_ID[form["iteration"] - 1] + "&V_SRVC_CD=" + this.V_SRVC_CD + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_ID=" + this.V_PRCS_ID + "&REST_Service=Forms_Record&Verb=DELETE";
        // insecure_del_URL = encodeURI(insecure_del_URL);

        // insecure
        // this.https.delete(insecure_del_URL).subscribe(
        //   res => {
        //     ("Response:\n" + res);
        //     this.deleted[index] = true;
        //   });

      }
    });
  }

  build_PVP(form) {
    this.currentDate = dateFormat(new Date(), "ddd mmm dd yyyy hh:MM:ss TT o");
    //-------Update PVP--------//
    (form);
    var PVP_str = "{";
    var key;
    for (let i = 0; i < this.RVP_labels.length; i++) {
      key = this.RVP_labels[i].split(" ").join("_");
      PVP_str += "\"" + key + "\"" + ":[";
      for (let j = 0; j < this.totalRow - 1; j++) {
        PVP_str += "\"" + form[key][j] + "\"";
        if (j < this.totalRow - 2)
          PVP_str += ",";
      }
      PVP_str += "]";
      if (i < this.RVP_labels.length - 1)
        PVP_str += ",";
    }
    PVP_str += "}";

    let body_buildPVP = {
      "V_USR_NM": this.V_USR_NM,
      "V_EXE_CD": this.Check_RPT_NRPT,
      "V_PRCS_TXN_ID": this.V_PRCS_TXN_ID,
      "V_APP_ID": this.V_APP_ID,
      "V_PRCS_ID": this.V_PRCS_ID,
      "V_SRVC_ID": this.V_SRVC_ID,
      "V_PVP": PVP_str,
      "V_RELEASE_RSN": "Submitted manual input",
      "V_SRC_ID": this.V_SRC_ID,
      "V_OPERATION": "MANUALSUBMIT",
      "V_UNIQUE_ID": this.V_UNIQUE_ID,
      "TimeZone": this.currentDate
    }
    // 10th April added for future call after token works

    // insecure
    // this.https.post(this.apiService.endPoints.insecureFormSubmit, body_buildPVP).subscribe(
    //   res => {
    //     (res);
    //     res = res.json();
    //     this.invoke_router(res.json());
    //   });

    // 10th April secured call
    // secure
    this.https.post(this.apiService.endPoints.secureFormSubmit, body_buildPVP, this.apiService.setHeaders()).subscribe(
      res => {
        (res);
        res = res.json();
        this.invoke_router(res);
      });
  }
  Field_Names_initial = '';
  Field_Values_initial = "";
  ngOnInit() {

    var form: any[][] = [];
    for (let i = 0; i < this.totalRow; i++) {
      for (let j = 0; j < this.RVP_labels.length; j++) {
        const form_key = this.RVP_labels[j].split(" ").join("_");
        if (CommonUtils.isValidValue(form[form_key])) {
          form[form_key] = this.input[this.RVP_labels[j]][i];
          if (!CommonUtils.isValidValue(form[form_key][i])) {
            form[this.RVP_labels[j].split(" ").join("_")][i] = "";
          }
        }
      }
    }
    var key_array = Object.keys(form)
    for (let i = 0; i < key_array.length; i++) {
      if (i != 0) {
        this.Field_Names_initial += '|';
        this.Field_Values_initial += '|';
      }
      this.Field_Names_initial += "\"" + key_array[i] + "\"";
      this.Field_Values_initial += "\"" + form[key_array[i]] + "\"";
    }

    // this.Field_Names_initial += '|\"V_abcd\"';
    // this.Field_Values_initial += '|\"\"';

  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }

  Update_value(v: any, n: any, iter) { //v=value and n=paramter name
    // var Field_Names_Ar = [];
    // var Field_Values_Ar = []
    console.log('RVP_labels', this.RVP_labels);
    n = n.split(" ").join("_")
    // var Field_Names_Ar = ('"`' + n + '`"');
    var Field_Values_Ar = ( '"' + v + '"' );

    var Field_Names_Ar = n;
    // var Field_Values_Ar = v;

    if (this.V_TABLE_NAME.length && this.V_TABLE_NAME != '' && this.V_ID[iter - 1] != undefined) {
      {
        this.apiService.requestSecureApi(this.apiUrlGetSecure + 'V_ID=' + this.V_ID[iter - 1] + '&V_Table_Name=' + this.V_TABLE_NAME + '&V_Schema_Name=' + this.V_SCHEMA_NAME + '&V_SRVC_CD=' + this.V_SRVC_CD + '&V_PRCS_ID=' + this.V_PRCS_ID + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&Field_Names=' + Field_Names_Ar + '&Field_Values=' + Field_Values_Ar + '&REST_Service=Forms_Record&Verb=PATCH', 'get').subscribe(
          res => {
          }
        );
      }
    }
  }
  updateInput() {
    for (let i = 0; i < this.RVP_labels.length; i++) {
      this.input[this.RVP_labels[i]] = [];
    }
    this.totalRow = 1;
    this.rows = [0];
    this.cdr.detectChanges();
    var row_present = this.RVP_DataObj[this.RVP_labels[0].split(" ").join("_")].length;
    this.totalRow += row_present;
    for (let i = 1; i < this.totalRow; i++) {
      this.rows.push(i);
    }
    for (let i = 1; i < this.totalRow; i++) {
      for (let j = 0; j < this.RVP_labels.length; j++) {
        this.input[this.RVP_labels[j]][i] = this.RVP_DataObj[this.RVP_labels[j].split(" ").join("_")][i - 1];
      }
      this.edit_or_done[i] = 'edit';
    }
    this.cdr.detectChanges();
  }

  addRow() {

    var areAllDisabled = true;
    // for (let i = 0; i < this.totalRow; i++) {
    //   if (!this.isDisabled[i]) {
    //     areAllDisabled = false;
    //   }
    // }
    let obj = [];
    if (areAllDisabled) {
      this.rows.push(this.totalRow);
      ++this.totalRow;
      this.edit_or_done[this.totalRow - 1] = "done";

      // for (let i = 0; i < this.RVP_labels.length; i++) {
      //   let temp = null
      //   obj.push(temp);
      //   this.input[this.RVP_labels[i]].push(temp);
      // }
      this.isDisabled[this.totalRow - 1] = false;
      this.deleted[this.totalRow - 1] = false;
    }

    // if (this.V_TABLE_NAME.length && this.V_TABLE_NAME != '') {
    //   this.apiService.requestSecureApi(this.apiUrlGetSecure + 'V_Table_Name=' + this.V_TABLE_NAME + '&V_SCHEMA_NAME=' + this.V_SCHEMA_NAME + '&V_SRVC_CD=' + this.V_SRVC_CD + '&V_PRCS_ID=' + this.V_PRCS_ID + '&V_SRC_CD=' + this.V_SRC_CD + '&V_USR_NM=' + this.V_USR_NM + '&Field_Names=' + this.RVP_labels + '&V_Key_Names=' + this.RVP_labels + '&Field_Values=' + obj + '&V_Key_Values=' + obj + '&REST_Service=Forms_Record&Verb=POST', 'get').subscribe(
    //     res => {
    //     }
    //   );
    // }
  }

  editTick_click(i) {
    this.isDisabled[i] = !this.isDisabled[i];
    this.edit_or_done[i] = "edit";
    var form: any = [];
    for (let j = 0; j < this.RVP_labels.length; j++) {
      form[this.RVP_labels[j].split(" ").join("_")] = this.input[this.RVP_labels[j]][i];
      if (form[this.RVP_labels[j].split(" ").join("_")] == null) {
        form[this.RVP_labels[j].split(" ").join("_")] = "";
      }
    }
    form["iteration"] = i;
    // if (this.V_TABLE_NAME === null || this.V_TABLE_NAME.length > 0)
    this.updateForm(form);
  }

  delete_click(i) {
    // this.deleted[i] = true;
    var form: any = [];
    if (this.V_TABLE_NAME === null || this.V_TABLE_NAME.length > 0)
      this.deleteForm(form, i);
    for (let j = 0; j < this.RVP_labels.length; j++) {
      form[this.RVP_labels[j].split(" ").join("_")] = this.input[this.RVP_labels[j]][i];
      if (form[this.RVP_labels[j].split(" ").join("_")] == null) {
        form[this.RVP_labels[j].split(" ").join("_")] = "";
      }
    }
    form["iteration"] = i;
    // if (this.V_TABLE_NAME === null || this.V_TABLE_NAME.length > 0)
    //   this.deleteForm(form,i);
  }

  onCancel() {
    this.endUserService.processCancel(this.V_SRVC_ID, this.V_PRCS_TXN_ID, this.V_UNIQUE_ID[0]).subscribe(
      res => {
        this.router.navigateByUrl('End_User', { skipLocationChange: true });
      });
  }

  onSubmit() {
    if (this.rpForm.valid) {
      var form: any = [];
      var temp: any;
      for (let i = 0; i < this.RVP_labels.length; i++) {
        for (let j = 1; j < this.totalRow; j++) {
          temp = this.input[this.RVP_labels[i]][j]
          if (temp == null) {
            temp = "";
          }
          if (j === 1)
            form[this.RVP_labels[i].split(" ").join("_")] = [temp];
          else
            form[this.RVP_labels[i].split(" ").join("_")].push(temp);
        }
      }
      // for (let i = 0; i < this.totalRow; i++) {
      //   if (!this.isDisabled[i]) {
      //     areAllDisabled = false;
      //   }
      // }
      this.build_PVP(form);
    }
  }
}
