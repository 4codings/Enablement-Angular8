import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogChartsComponent } from './dialog-charts/dialog-charts.component';
import { PersonalizationTableComponent } from './personalization-table/personalization-table.component';
import { ConfigServiceService } from '../../../services/config-service.service';
import { Globals } from '../../../services/globals';
import { Globals2 } from '../../../service/globals';
import { EndUserService } from '../../../services/EndUser-service';
import { ApiService } from '../../../service/api/api.service';
import { StorageSessionService } from '../../../services/storage-session.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts-x';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'chartjs-plugin-zoom';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Viewer } from '../execute/bpmn-viewer';
import { RollserviceService } from '../../../services/rollservice.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { InputOutputElementComponent } from 'src/app/shared/components/input-output-element/input-output-element.component';
import { InstanceElementList } from '../process-design/monitor/monitor.component';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
// import { Viewer } from '../execute/bpmn-viewer-js';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportTableComponent implements OnInit, AfterViewInit, OnDestroy {

  removable = true;

  hiddencols: string[] = [];

  // myControl = new FormControl();
  columnsToDisplayKeys: string[];
  columnsPreferences: string[] = ['chartNo', 'chartType', 'xaxisData', 'yaxisData', 'unit',
    'scale', 'ystepSize', 'gridlineWidth', 'backgroundColor', 'borderColor', 'fillBackground',
    'lineTension', 'pointSize', 'animations', 'pointStyle', 'lineStyle', 'addRow'];
  Element_Preferences = [{
    chartNo: "1", chartType: "", xaxisData: "", yaxisData: "", unit: "", scale: "", ystepSize: "", gridlineWidth: "",
    backgroundColor: "", borderColor: "", fillBackground: "", lineTension: "", pointSize: "", animations: "",
    pointStyle: "", lineStyle: "", addRow: ""
  }];
  dataPreferences = new MatTableDataSource(this.Element_Preferences);
  domain_name = this.globals.domain_name;
  @ViewChild(MatSort, { static: true } as any) sort: MatSort;
  @ViewChild(BaseChartDirective, { static: false } as any) chart: BaseChartDirective;
  roleObservable$: Subscription;
  reportTableClickObservable$: Subscription;
  roleValues;
  hasMonitorPermission = false;
  isMonitorClicked = false;
  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  pointer = 0;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Exe_data = this.dataStored.getCookies("executedata");
  iddata: any[] = [];
  table_help_text: any;
  Table_of_Data: any[];
  Table_of_Data1: any[];
  Table_of_Data2: any[] = [];
  Table_of_Data3: any[] = [];
  Table_of_Data4: any[] = [];
  APP_ID = "";
  UNIQUE_ID = "";
  PRCS_ID = "";
  SRC_ID = "";
  SRVC_ID = "";
  SRVC_CD = "";
  PRCS_TXN_ID = "";
  F1: any[];
  ArraData: any = [];
  hiddencolsflag: any = [];
  Table_of_Data5: any;
  helpertext = {};
  tabledata = {};
  dispchart: boolean = true;
  disptable: boolean = true;
  dispPersonalTable = false;
  Select_show_option: any = ["Table", "Charts", "Both"];
  show_choice = "Both";
  selectedchart = [];
  selectedcustomize = "";
  myobj = { mychartType: "", myxaxisdata: "", myyaxisdata: "", myUoM: "", mySoM: "" }
  PersonalTableCols: any = ["Chart type", "x-axis data", "y-axis data", "Unit of measure", "Scale of measure"];
  personalizationtable: any = [];
  linearray: any = [];
  bararray: any = [];
  piearray: any = [];
  doughnutarray: any = [];
  APP_CD = '';
  PRCS_CD = '';
  V_UPDATE = '';
  private viewer: any;
  ctrl_variables: any;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  public path = '';
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  endClicked = false;
  submitClicked = false;
  selectedReportTableMenuOption;
  constructor(private dataStored: StorageSessionService,
    private https: Http,
    private route: Router,
    private data: ConfigServiceService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private globals: Globals,
    private globalUser: Globals2,
    private endUserService: EndUserService,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private toasterService: ToastrService,
    private httpClient: HttpClient,
    private roleService: RollserviceService,
    private optionalService: OptionalValuesService,
  ) {
    this.roleObservable$ = this.roleService.roleValue.subscribe(data => {
      if (data != null) {
        this.roleValues = data;
        if (this.roleValues.length) {
          this.roleValues.forEach(ele => {
            switch (ele) {
              case 'Enablement Workflow Dashboard Role':
                this.hasMonitorPermission = true;
                break;
              default:
                break;
            }
          })
        }
      }
    });
    this.reportTableClickObservable$ = this.optionalService.reportTableMenuClickValue.subscribe(res => {
      if (res != null) {
        if (!res.flag) {
          if (res.value.key != 'Properties') {
            this.showhide(res.value.key);
          } else {
            this.dispPersonalTable = true;
          }
        }
      }
    })
  }

  chartposition: any = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

  onMonitorClick() {
    this.isMonitorClicked = true;
  }
  remove(item: string): void {
    const index = this.hiddencols.indexOf(item);
    if (index >= 0) {
      this.hiddencols.splice(index, 1);
      this.columnsToDisplay.splice(0, 0, item);
    }
    this.settablepreferences();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedchart, event.previousIndex, event.currentIndex);
  }
  dataSource;
  ngAfterViewInit() {
    this.httpClient.get('../../../../assets/control-variable.json').subscribe((res: any) => {
      this.ctrl_variables = res;
      this.path = this.ctrl_variables.bpmn_file_path;
    });
    this.dataSource = new MatTableDataSource(this.Table_of_Data4);

    this.dataSource.sort = this.sort;
    // console.log(this.Table_of_Data4);
    this.cd.detectChanges();
    this.optionalService.defaultreportTableValue.next(this.show_choice);
  }
  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
    this.roleObservable$.unsubscribe();
  }
  onCancelPersonalizeTable() {
    this.dispPersonalTable = false;
    this.optionalService.reportTableMenuClickValue.next({ 'value': '', 'flag': true });
  }
  getReportData() {

    this.Table_of_Data = this.dataStored.getCookies('report_table')['RESULT'];
    this.V_UPDATE = this.dataStored.getCookies('report_table')['V_UPDATE'][0];
    this.SRVC_CD = this.dataStored.getCookies('report_table')['SRVC_CD'][0];
    // this.SRVC_ID = this.dataStored.getCookies('report_table')['SRVC_ID'][0];
    this.UNIQUE_ID = this.dataStored.getCookies('report_table')['TEMP_UNIQUE_ID'][0];
    this.Table_of_Data1 = this.dataStored.getCookies('report_table')['LOG_VAL'];
    // console.log(this.Table_of_Data1);
    this.iddata.push(this.dataStored.getCookies('iddata'));
    this.PRCS_TXN_ID = this.dataStored.getCookies('executeresdata')['V_PRCS_TXN_ID'];
    this.APP_ID = this.dataStored.getCookies('report_table')['APP_ID'][0];
    this.PRCS_ID = this.dataStored.getCookies('report_table')['PRCS_ID'][0];
    this.SRC_ID = this.dataStored.getCookies('report_table')['SRC_ID'][0];
    this.APP_CD = this.dataStored.getCookies('report_table')['APP_CD'][0];
    this.PRCS_CD = this.dataStored.getCookies('report_table')['PRCS_CD'][0];
    this.table_help_text = this.dataStored.getCookies('report_table')['FLD_HLP_TXT'][0].split(",");;
    //(JSON.parse(this.Table_of_Data1[0]));
    this.columnsToDisplay = Object.keys(JSON.parse(this.Table_of_Data1[0]));
    // console.log(this.columnsToDisplay);
    this.hiddencolsflag = this.dataStored.getCookies('report_table')['HIDDEN'];
    var a = this.hiddencolsflag[0];
    var outputstr = a.replace(/'/g, '');
    outputstr.replace(/\s+/g, '-');
    this.hiddencolsflag = outputstr.split(",");
    for (let i = 0; i < this.hiddencolsflag.length; i++) {
      this.hiddencolsflag[i] = this.hiddencolsflag[i].toString().trim();
    }
    for (let j = 0; j < this.columnsToDisplay.length; j++) {
      if (this.hiddencolsflag[j] != undefined && this.hiddencolsflag[j].toString().trim() == "Y") {
        this.columnsToDisplay.splice(j, 1);
      }
    }
    if (this.V_UPDATE == 'Y') {
      this.optionalService.reportTableMenuViewValue.next(true);
    } else {
      this.optionalService.reportTableMenuViewValue.next(false);
    }
  }

  columnsToDisplay = [];

  showhide(abc) {
    this.show_choice = abc;
    switch (abc) {
      case 'Table':
        this.disptable = true;
        this.dispchart = false;
        break;
      case 'Charts':
        this.disptable = false;
        this.dispchart = true;
        if (this.V_PRF_NM.length) {
          this.getchartpreferences();
        }
        break;
      case 'Both':
        this.disptable = true;
        this.dispchart = true;
        if (this.V_PRF_NM.length) {
          this.getchartpreferences();
        }
        break;
    }
    this.settablepreferences();
  }
  //___________________________Chart configuration ______________________________________
  V_PRF_NM = [];
  V_PRF_VAL = [];
  userprefs = {};
  hiddencolsconfig = {};


  //__________________________Set Preferences_________________________________

  settablepreferences() {
    if (this.hiddencols.length > -1) {
      var abc = this.hiddencols.toString();
      this.userprefs['hiddencolname'] = abc;
    }
    this.userprefs['displaychoice'] = this.show_choice;
    this.V_PRF_NM = Object.keys(this.userprefs);
    this.V_PRF_VAL = Object.values(this.userprefs);
    for (let j = 0; j < this.V_PRF_NM.length; j++) {
      this.data.setchartstyling(this.UNIQUE_ID, this.SRC_ID, '-1', this.V_PRF_NM[j], this.V_PRF_VAL[j]).subscribe(
        () => {
          //(res);
        });
    }
  }

  //__________________________Get Preferences________________________________
  getchartpreferences() {
    var cp = [];
    /*if (this.userprefs['backgroundcolor'] != undefined)
      this._backgroundColor = this.userprefs['backgroundcolor'];
    if (this.userprefs['bordercolor'] != undefined)
      this._borderColor = this.userprefs['bordercolor'];
    if (this.userprefs['fill'] != undefined)
      this._fill = this.userprefs['fill'];
    if (this.userprefs['pointstyle'] != undefined)
      this._pointstyle = this.userprefs['pointstyle'];
    if (this.userprefs['linetension'] != undefined)
      this._linetension = this.userprefs['linetension'];
    if (this.userprefs['animations'] != undefined)
      this._animations = this.userprefs['animations'];
    if (this.userprefs['pointradius'] != undefined)
      this._pointradius = this.userprefs['pointradius'];
    if (this.userprefs['linestyle'] != undefined)
      this._linestyle = this.userprefs['linestyle'];
    if (this.userprefs['gridlinedashed'] != undefined)
      this._gridborder = this.userprefs['gridlinedashed'];

    this._fill.toString().toUpperCase() == "TRUE" ? this._fill = true : this._fill = false;
    this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
    this._gridborder.toString().toUpperCase() == "TRUE" ? this._gridborder = true : this._gridborder = false;
    this._gridlinewidth = this.userprefs['linewidth'];
    this._yaxisAutoskip.toString().toUpperCase() == "TRUE" ? this._yaxisAutoskip = true : this._yaxisAutoskip = false;
    if (this.userprefs['linexaxis'] != undefined && this.userprefs['linexaxis'] != "")
      this._xaxis_sel_line = this.userprefs['linexaxis'];
    if (this.userprefs['lineyaxis'] != undefined && this.userprefs['lineyaxis'] != "")
      this._yaxis_sel_line = this.userprefs['lineyaxis'].toString().split(',');
    if (this.userprefs['personalizationtable'] != undefined && this.userprefs['personalizationtable'] != "")
      this.personalizationtable = this.userprefs['personalizationtable'].toString().split(',');
    if (this.userprefs['barxaxis'] != undefined && this.userprefs['barxaxis'] != "")
      this._xaxis_sel_bar = this.userprefs['barxaxis'];
    if (this.userprefs['baryaxis'] != undefined && this.userprefs['baryaxis'] != "")
      this._yaxis_sel_bar = this.userprefs['baryaxis'].toString().split(',');
    if (this.userprefs['piexaxis'] != undefined && this.userprefs['piexaxis'] != "")
      this._xaxis_sel_pie = this.userprefs['piexaxis'];
    if (this.userprefs['pieyaxis'] != undefined && this.userprefs['pieyaxis'] != "")
      this._yaxis_sel_pie = this.userprefs['pieyaxis'].toString().split(',');
    if (this.userprefs['doughnutxaxis'] != undefined && this.userprefs['doughnutxaxis'] != "")
      this._xaxis_sel_doughnut = this.userprefs['doughnutxaxis'];
    if (this.userprefs['doughnutyaxis'] != undefined && this.userprefs['doughnutyaxis'] != "")
      this._yaxis_sel_doughnut = this.userprefs['doughnutyaxis'].toString().split(',');

    if (this.userprefs['selectedchart'] != undefined && this.userprefs['selectedchart'] != "")
      this.selectedchart = this.userprefs['selectedchart'].toString().split(',');
    if (this.userprefs['chartposition'] != undefined)
      cp = this.userprefs['chartposition'].toString().split(',').map(Number);
    this.chartposition[0].x = cp[0];
    this.chartposition[1].x = cp[2];
    this.chartposition[2].x = cp[4];
    this.chartposition[3].x = cp[6];
    this.chartposition[0].y = cp[1];
    this.chartposition[1].y = cp[3];
    this.chartposition[2].y = cp[5];
    this.chartposition[3].y = cp[7];*/

    //this.updatechart();
  }
  gettablepreferences() {
    if (this.userprefs['displaychoice'] != undefined) {
      this.show_choice = this.userprefs['displaychoice'];
      this.optionalService.defaultreportTableValue.next(this.show_choice);
      this.showhide(this.userprefs['displaychoice'])
    }
    if (this.userprefs['hiddencolname'] != undefined) {
      var a = this.userprefs['hiddencolname'].toString();
      this.hiddencols = a.split(',');
      for (let i = 0; i < this.hiddencols.length; i++) {
        if (this.hiddencols.includes("")) {
          var emptyindex = this.columnsToDisplay.indexOf(this.hiddencols[""]);
          this.hiddencols.splice(emptyindex, 1);
        }
        var index = this.columnsToDisplay.indexOf(this.hiddencols[i]);
        if (index > -1) {
          this.columnsToDisplay.splice(index, 1);
        }
      }
    }
  }
  getpreferences() {
    // console.log("getpref");
    this.data.getchartstyling(this.UNIQUE_ID, this.SRC_ID).subscribe(
      res => {
        // console.log(res.json());
        var result = res.json();

        var name = result.PRF_NM;
        var value = result.PRF_VAL;
        this.V_PRF_NM = name;
        this.V_PRF_VAL = value;
        for (let i = 0; i < name.length; i++) {
          this.userprefs[name[i]] = value[i];
        }
        if (name.length) {
          // console.log(this.userprefs);
          this.gettablepreferences();
          this.getchartpreferences();
        } else {
          this.showhide(this.show_choice);
        }
      });
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getReportData();
    this.Table_of_Data3 = this.Table_of_Data2[0];
    this.Table_of_Data5 = JSON.parse(this.Table_of_Data1[0]);
    //(this.Table_of_Data5);
    var keyy = [];
    keyy = Object.keys(this.Table_of_Data5);
    var vals = [];
    vals = Object.values(this.Table_of_Data5);
    //(keyy);
    //(vals);
    for (let j = 0; j < vals.length; j++) {
      while (vals[j].indexOf(" ") != -1) {
        vals[j].splice(vals[j].indexOf(" "), 1, "----");
      }
      while (vals[j].indexOf("") != -1) {
        vals[j].splice(vals[j].indexOf(""), 1, "----");
      }
    }
    for (let i = 0; i < keyy.length; i++) {
      this.tabledata[keyy[i]] = vals[i];
    }
    //(vals);
    this.Table_of_Data5 = this.tabledata;
    //(this.Table_of_Data5);
    //(this.Table_of_Data5['PIID']);
    this.F1 = this.Table_of_Data5[this.columnsToDisplay[0]];
    for (let i = 0; i < this.F1.length; i++) {
      let rowData = {};
      for (let j = 0; j < this.columnsToDisplay.length; j++) {

        let key = this.columnsToDisplay[j];
        rowData[key + ""] = this.Table_of_Data5[key + ""][i];
      }
      this.Table_of_Data4[i] = rowData;
      //(this.Table_of_Data4);
    }

    for (let j = 0; j <= this.columnsToDisplay.length; j++) {

      this.helpertext[this.columnsToDisplay[j]] = this.table_help_text[j];
      // this.https.get(this.apiService.endPoints.secure + "FieldName=" + this.columnsToDisplay[j] + "&REST_Service=Field_Description&Verb=GET", this.apiService.setHeaders())
      //   .subscribe(res => {
      //     var data: data = res.json();
      //     var name = data.Field_Name;
      //     var tip = data.Description_Text;
      //     var i;
      //     for (i = 0; i < tip.length; i++) {
      //       this.helpertext[name[i]] = tip[i];
      //     }
      //   })

    }
    this.getpreferences();
    let obj = {
      'V_APP_ID': this.APP_ID,
      'V_PRCS_ID': this.PRCS_ID,
      'V_PRCS_TXN_ID': this.PRCS_TXN_ID,
      'V_SRC_ID': this.SRC_ID,
      'USR_NM': this.V_USR_NM
    }
    this.optionalService.selecetedProcessTxnValue.next(obj);
    this.data.ReportTable_data = this.Table_of_Data5;
    // this.getInputOutput();
  }

  ExecuteAgain() {
    this.submitClicked = true;
    this.Execute_Now();

  }
  Redirect_to_user() {
    //   var timezone = new Date();

    //   var Intermediatetimezone = timezone.toString()
    //   let body = {
    //     "V_USR_NM":this.V_USR_NM,
    //     "V_PRCS_TXN_ID":this.PRCS_TXN_ID,
    //     "V_SRC_ID":this.SRC_ID,
    //     "V_APP_ID":this.APP_ID,
    //     "V_PRCS_ID":this.PRCS_ID,
    //     "V_SRVC_ID":this.SRVC_ID,
    //     "V_RELEASE_RSN":"Cancelled Navigation "+this.SRVC_CD,
    //     "V_OPERATION":"MANUALDELETE",
    //     "TimeZone":Intermediatetimezone,
    //     "REST_Service":"Form_Report",
    //     "Verb":"PUT"
    //   };
    //   //(body);
    //    this.https.put("https://"+this.domain_name+"/rest/Process/Submit/FormSubmit", body).subscribe(
    //     res => {
    //       //(res);

    //  });
    this.endClicked = true;
    this.endUserService.processCancel(this.SRVC_ID, this.PRCS_TXN_ID, this.globals.Report.TEMP_UNIQUE_ID[0]).subscribe(
      () => {
        this.endClicked = false;
        this.route.navigateByUrl('End_User', { skipLocationChange: true });
      });
  }

  showhidecol(col) {

    if (this.columnsToDisplay.includes(col)) {
      this.hiddencols.push(col);
      var index = this.columnsToDisplay.indexOf(col);
      if (index > -1) {
        this.columnsToDisplay.splice(index, 1);
      }
    }
    this.settablepreferences();
  }
  //__________________________________________________________
  Execute_res_data: any[];
  // progress: boolean = false;
  Execute_Now() {
    // this.progress = true;
    let body = {
      "V_APP_CD": this.Exe_data['SL_APP_CD'].toString(),
      "V_PRCS_CD": this.Exe_data['SL_PRC_CD'].toString(),
      "V_SRVC_CD": 'START',
      "V_SRC_CD": this.V_SRC_CD,
      "V_USR_NM": this.V_USR_NM

    };

    this.https.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders()).subscribe(
      res => {
        this.Execute_res_data = res.json();
        this.submitClicked = false;
        this.route.navigateByUrl('End_User', { skipLocationChange: true });
      }
    );
  }
  GenerateReportTable() {
    let body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      // 10th April
      // V_UNIQUE_ID: this.Execute_res_data['V_UNIQUE_ID'],
      // V_APP_ID: this.Execute_res_data['V_APP_ID'],
      // V_PRCS_ID: this.Execute_res_data['V_PRCS_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      // V_NAV_DIRECTION: this.Execute_res_data['V_NAV_DIRECTION'],
      V_USR_ID: this.globalUser.currentUser.USR_ID,
      // V_DSPLY_WAIT_SEC: 100,
      // V_MNL_WAIT_SEC: 180,
      REST_Service: 'Report',
      Verb: 'POST'
    }
    // insecure
    // this.https.post(this.apiService.endPoints.insecureProcessReport, body)
    //   .subscribe(
    //     res => {
    //       //(res.json());
    //       this.dataStored.setCookies("report_table", res.json());

    //     }
    //   );

    // secure

    this.https.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders())
      .subscribe(
        res => {
          // console.log(res.json());
          this.dataStored.setCookies("report_table", res.json());

        }
      );
    // this.progress = false;
    this.getReportData();
  }
  dialogOpen = false;
  dialogRef: any;
  ganttChart() {
    ("Gantt Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'gantt' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }

  }

  barChart() {
    ("Bar Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'bar' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }
  }

  pieChart() {
    ("Pie Chart");
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(DialogChartsComponent, {
        panelClass: 'custom-dialog-container',
        width: '60%',
        data: { Execute_res_data: { V_APP_ID: this.APP_ID, V_SRC_ID: this.SRC_ID, V_PRCS_ID: this.PRCS_ID, V_PRCS_TXN_ID: this.PRCS_TXN_ID }, type: 'pie' }
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false;
      });

    }
  }

  //currency = 'USD';
  //price: number;
}

export interface data {
  Field_Name: string[];
  Description_Text: string[];

}
