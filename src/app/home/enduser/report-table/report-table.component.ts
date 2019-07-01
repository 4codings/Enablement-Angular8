import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router'
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { DialogChartsComponent } from './dialog-charts/dialog-charts.component';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { Globals } from 'src/app/services/globals';
import { Globals2 } from 'src/app/service/globals';
import { EndUserService } from 'src/app/services/EndUser-service';
import { ApiService } from 'src/app/service/api/api.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { FormControl } from '@angular/forms'
import { BaseChartDirective } from 'ng2-charts-x';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  // styleUrls: ['./report-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportTableComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  removable = true;

  hiddencols: string[] = [];

  myControl = new FormControl();
  columnsToDisplayKeys: string[];
  domain_name = this.globals.domain_name;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dataStored: StorageSessionService,
    private https: Http,
    private route: Router,
    private data: ConfigServiceService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private globals: Globals,
    private globalUser: Globals2,
    private endUserService: EndUserService,
    private apiService: ApiService
  ) { }

  remove(item: string): void {
    const index = this.hiddencols.indexOf(item);

    if (index >= 0) {
      this.hiddencols.splice(index, 1);
      this.columnsToDisplay.splice(0, 0, item);
    }
  }

  pointer = 0;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Exe_data = this.dataStored.getCookies("executedata");
  iddata: any[] = [];
  Table_of_Data: any[];
  Table_of_Data1: any[];
  Table_of_Data2: any[] = [];
  Table_of_Data3: any[] = [];
  Table_of_Data4: any[] = [];
  APP_ID = "";
  PRCS_ID = "";
  SRC_ID = "";
  SRVC_ID = "";
  SRVC_CD = "";
  PRCS_TXN_ID = "";
  F1: any[];
  ArraData: any = [];
  Table_of_Data5: any;
  helpertext = {};
  tabledata = {};
  dispchart: boolean;
  disptable: boolean;
  Select_show_option: any = ["Table", "Charts", "Both"];
  show_choice = "Table";
  selectedchart = "";
  selectedcustomize = "";

  getReportData() {

    this.Table_of_Data = this.dataStored.getCookies('report_table')['RESULT'];
    //(this.dataStored.getCookies('report_table'));
    this.SRVC_CD = this.dataStored.getCookies('report_table')['SRVC_CD'][0];
    // this.SRVC_ID = this.dataStored.getCookies('report_table')['SRVC_ID'][0];
    this.Table_of_Data1 = this.dataStored.getCookies('report_table')['LOG_VAL'];
    this.iddata.push(this.dataStored.getCookies('iddata'));
    this.PRCS_TXN_ID = this.dataStored.getCookies('executeresdata')['V_PRCS_TXN_ID'];
    this.APP_ID = this.dataStored.getCookies('report_table')['APP_ID'][0];
    this.PRCS_ID = this.dataStored.getCookies('report_table')['PRCS_ID'][0];
    this.SRC_ID = this.dataStored.getCookies('report_table')['SRC_ID'][0];

    //(JSON.parse(this.Table_of_Data1[0]));

    this.columnsToDisplay = Object.keys(JSON.parse(this.Table_of_Data1[0]));
  }
  dataSource = new MatTableDataSource(this.Table_of_Data4);
  columnsToDisplay = [];
  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    //this.updatechart();
    this.cd.detectChanges();

  }
  showhide(abc) {
    switch (abc) {
      case 'Table':
        this.disptable = true;
        this.dispchart = false;
        break;
      case 'Charts':
        this.disptable = false;
        this.dispchart = true;
        this.getchartstyling();
        break;
      case 'Both':
        this.disptable = true;
        this.dispchart = true;
        break;
    }
  }
  //___________________________Chart configuration ______________________________________
  yaxiscallbacks = ['$', '£', '€', '₹', 'm', 'km', 'k', 'gm', 'kg', 's'];
  V_PRF_NM = [];
  V_PRF_VAL = [];
  chartconfig = {};
  _yaxismin = 0;
  _yaxismax = null;
  _yaxisstepSize = null;
  _yaxisAutoskip: boolean = false;
  _xaxis_sel = "";
  _yaxis_sel = [];
  // _yaxis2_sel = "";
  _yaxisCB = '';
  yaxis_data = [];
  // yaxis_data2 = [];
  _backgroundColor = "rgba(34,181,306,0.2)";
  _borderColor = "rgba(44,191,206,1)";
  _fill: boolean = false;
  _borderdash = [];
  _pointstyle = "rectRot";
  _linetension = "none";
  _animations = "easeInOutQuad";
  _pointradius = "normal";
  _linestyle = "solid";
  lineten: number = 0;
  pointrad: number = 8;
  chartlabels = [];
  linedata = [{ data: this.yaxis_data[0], label: this._yaxis_sel }];
  bardata = [{ data: this.yaxis_data[0], label: this._yaxis_sel }];
  piedata = [{ data: this.yaxis_data[0], labels: this._yaxis_sel }];
  doughnutdata = [{ data: this.yaxis_data[0], labels: this._yaxis_sel }];
  // Line Chart Configuration
  public lineChartColors: Array<any> = [
    {
      backgroundColor: this._backgroundColor,
      borderColor: this._borderColor,
      pointBackgroundColor: this._borderColor,
      pointBorderColor: '#fff',
      pointHoverBorderColor: this._borderColor,
      pointHoverBackgroundColor: '#fff',
    },
    {
      backgroundColor: "rgba(154,67,208,0.38)",
      borderColor: "violet",
      pointBackgroundColor: "rgba(154,67,208,0.38)",
      pointBorderColor: '#fff',
      pointHoverBorderColor: "violet",
      pointHoverBackgroundColor: '#fff'
    }
  ];;
  public lineChartData: Array<any> = this.linedata;
  public lineChartLabels: Array<any> = this.chartlabels;
  public lineChartType: string = 'line';
  public lineChartOptions: any;
  // Bar Chart Configuration
  public barChartOptions: any;
  public barChartLabels: string[] = this.chartlabels;
  public barChartType: string = 'bar';
  public barChartData: Array<any> = this.bardata;
  public barChartColors: Array<any> = [{
    backgroundColor: this._backgroundColor,
    borderColor: this._borderColor,
    pointBackgroundColor: this._borderColor,
    pointBorderColor: '#fff',
    pointHoverBorderColor: this._borderColor,
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(154,67,208,0.38)",
    borderColor: "violet",
    pointBackgroundColor: "rgba(154,67,208,0.38)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "violet",
    pointHoverBackgroundColor: '#fff',
  }];
  // Pie Chart Configuration
  public pieChartLabels: string[] = this.chartlabels;
  public pieChartData: Array<any> = this.piedata;
  public pieChartType: string = 'pie';

  // Doughnut Chart Configuration
  public doughnutChartLabels: string[] = this.chartlabels;
  public doughnutChartData: Array<any> = this.doughnutdata;
  public doughnutChartType: string = 'doughnut';

  //_________________________CHART FUNCTIONS________________________________________
  updateLineChart() {
    var unit = this._yaxisCB;
    this.lineChartData = [];
    this.lineChartLabels = [];
    this.yaxis_data = [];
    this.lineChartOptions = null;

    switch (this._linetension) {
      case 'none': this.lineten = 0;
        break;
      case 'mild': this.lineten = 0.2;
        break;
      case 'full': this.lineten = 0.5;
        break;
      default: this.lineten = 0;
        break;
    }
    switch (this._pointradius) {
      case 'small': this.pointrad = 6;
        break;
      case 'normal': this.pointrad = 8;
        break;
      case 'large': this.pointrad = 10;
        break;
      default: this.pointrad = 6;
        break;
    }
    this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];


    this.lineChartLabels = this.Table_of_Data5[this._xaxis_sel];
    if (this._yaxis_sel != []) {
      // this.yaxis_data = this.Table_of_Data5[this._yaxis1_sel].map(Number);
      for (let i = 0; i < this._yaxis_sel.length; i++) {
        this.yaxis_data[i] = this.Table_of_Data5[this._yaxis_sel[i]].map(Number);
        this.lineChartData[i] = {
          label: this._yaxis_sel[i],
          fill: this._fill,
          borderDash: this._borderdash,
          pointRadius: this.pointrad,
          pointStyle: this._pointstyle,
          data: this.yaxis_data[i],
          yAxisID: "y-".concat((i + 1).toString())
        }
      }
    }
    if (this._yaxismax == null || this._yaxismax == undefined || this._yaxismax == -Infinity) {
      this._yaxismax = Math.max.apply(null, this.yaxis_data[0]);
    }
    this.lineChartOptions = {
      responsive: true,
      annotation: {
        // drawTime: 'afterDatasetsDraw',
        // events: ['click'],
        // annotations: [{
        //   type: 'line',
        //   id: 'vline',
        //   mode: 'vertical',
        //   scaleID: 'x-axis-0',
        //   value: "Jan-2018",
        //   borderColor: 'rgba(0, 255, 0, 0.6)',
        //   borderWidth: 1,
        //   label: {
        //     backgroundColor: 'rgba(0,0,0,0.5)',
        //     fontFamily: "sans-serif",
        //     fontSize: 12,
        //     fontStyle: "bold",
        //     fontColor: "#fff",
        //     xPadding: 6,
        //     yPadding: 6,
        //     cornerRadius: 6,
        //     xAdjust: 0,
        //     yAdjust: 0,
        //     enabled: true,
        //     position: "center",
        //     content: "Spend Plan Raised alot"
        //   }
        // }]
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        point: {
          pointStyle: this._pointstyle
        },
        line: { tension: this.lineten },
        animation: {
          duration: 3000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            return (unit + " " + tooltipItems.yLabel.toString());
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          },
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel
          },
          display: true
        }],
        yAxes: Array<any>()
      }
    };
    for (let i = 0; i < this.barChartData.length; i++) {
      if (i == 0) {
        this.lineChartOptions.scales.yAxes[i] = {
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel[i],
            fontColor: this.lineChartColors[i].borderColor
          },
          ticks: {
            fontColor: this.lineChartColors[i].borderColor,
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return (label / 1000);
              }
              else {
                return unit + " " + label + " k";
              }
            }
          }
        };
      }
      if (i > 0) {
        this.lineChartOptions.scales.yAxes[i] = {
          position: 'right',
          type: 'linear',
          display: true,
          id: "y-".concat((i + 1).toString()),
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel[i],
            fontColor: this.lineChartColors[i].borderColor
          },
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            fontColor: this.lineChartColors[i].borderColor,
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return (label / 1000);
              }
              else {
                return unit + " " + label + " k";
              }
            }
          }
        };
      }
    }
    console.log(this._yaxismax);
  }
  updateBarChart() {
    var unit = this._yaxisCB;
    this.barChartData = [];
    this.barChartLabels = [];
    this.barChartOptions = null;

    if (this._yaxis_sel != []) {
      for (let i = 0; i < this._yaxis_sel.length; i++) {
        this.yaxis_data[i] = this.Table_of_Data5[this._yaxis_sel[i]].map(Number);
        this.barChartData[i] = {
          label: "",
          data: Array<any>()
        }
        this.barChartData[i].data = this.yaxis_data[i];
        this.barChartData[i].label = this._yaxis_sel[i];
        console.log(this.barChartData[i]);

      }
    }
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        animation: {
          duration: 3000,
          easing: this._animations
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            return (unit + " " + tooltipItems.yLabel.toString());
          }
        },
        mode: 'index',
        intersect: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          },
          scaleLabel: {
            display: true,
            labelString: this._xaxis_sel
          },
          display: true
        }],
        yAxes: Array<any>()
      }
    };
    for (let i = 0; i < this.barChartData.length; i++) {
      if (i == 0) {
        this.barChartOptions.scales.yAxes[0] = {
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          ticks: {
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            fontColor: this.barChartColors[0].borderColor,
            beginAtZero: true,
            callback: function (label) {

              if (label > 1000) {
                return (label / 1000);
              }
              else {
                return (unit + " " + label);
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel[0],
            fontColor: this.barChartColors[0].borderColor
          }
        };
      }
      if (i > 0) {
        this.barChartOptions.scales.yAxes[i] = {
          position: 'right',
          type: 'linear',
          display: true,
          id: "y-".concat((i + 1).toString()),
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks: {
            min: this._yaxismin,
            max: this._yaxismax,
            stepSize: this._yaxisstepSize,
            autoSkip: this._yaxisAutoskip,
            fontColor: this.barChartColors[i].borderColor,
            beginAtZero: true,
            callback: function (label) {

              if (label > 1000) {
                return (label / 1000);
              }
              else {
                return (unit + " " + label);
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: this._yaxis_sel[i],
            fontColor: this.barChartColors[i].borderColor
          }
        };
      }
    }
    this.barChartLabels = this.Table_of_Data5[this._xaxis_sel];
  }
  updatePieChart() {
    this.pieChartData = [];
    this.pieChartLabels = [];

    if (this._yaxis_sel != []) {
      for (let i = 0; i < this._yaxis_sel.length; i++) {
        this.yaxis_data[i] = this.Table_of_Data5[this._yaxis_sel[i]].map(Number);
        this.pieChartData.push({
          labels: this._yaxis_sel[i],
          data: this.yaxis_data[i]
        })
      }
    }
    this.pieChartLabels = this.Table_of_Data5[this._xaxis_sel];
  }
  updateDoughnutChart() {
    this.doughnutChartData = [];
    this.doughnutChartLabels = [];

    if (this._yaxis_sel != []) {
      for (let i = 0; i < this._yaxis_sel.length; i++) {
        this.yaxis_data[i] = this.Table_of_Data5[this._yaxis_sel[i]].map(Number);
        this.doughnutChartData.push({
          labels: this._yaxis_sel[i],
          data: this.yaxis_data[i]
        })
      }
    }
    this.doughnutChartLabels = this.Table_of_Data5[this._xaxis_sel];
  }
  updatechart() {
    this.updateLineChart();
    this.updateBarChart();
    this.updatePieChart();
    this.updateDoughnutChart();
  }
  //__________________________get chart styling________________________________
  getchartstyling() {
    this.data.getchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID).subscribe(
      res => {
        (res.json());
        var result = res.json();
        console.log(result);
        var name = result.PRF_NM;
        var value = result.PRF_VAL;
        this.V_PRF_NM = name;
        this.V_PRF_VAL = value;
        for (let i = 0; i < name.length; i++) {

          this.chartconfig[name[i]] = value[i];
        }

        this._backgroundColor = this.chartconfig['backgroundcolor'];
        this._borderColor = this.chartconfig['bordercolor'];
        this._fill = this.chartconfig['fill'];
        this._pointstyle = this.chartconfig['pointstyle'];
        this._linetension = this.chartconfig['linetension'];
        this._animations = this.chartconfig['animations'];
        this._pointradius = this.chartconfig['pointradius'];
        this._linestyle = this.chartconfig['linestyle'];
        this._fill.toString().toUpperCase() == "TRUE" ? this._fill = true : this._fill = false;
        this._linestyle == "dashed" ? this._borderdash = [5, 5] : this._borderdash = [];
        this.updatechart();
      }

    );
  }
  //__________________________Set Chart Styling_________________________________
  setchartstyling() {
    this.chartconfig['backgroundcolor'] = this._backgroundColor;
    this.chartconfig['bordercolor'] = this._borderColor;
    this.chartconfig['fill'] = this._fill.toString().toLocaleUpperCase();
    this.chartconfig['pointstyle'] = this._pointstyle;
    this.chartconfig['linetension'] = this._linetension;
    this.chartconfig['animations'] = this._animations;
    this.chartconfig['pointradius'] = this._pointradius;
    this.chartconfig['linestyle'] = this._linestyle;

    this.V_PRF_NM = Object.keys(this.chartconfig);
    this.V_PRF_VAL = Object.values(this.chartconfig);
    //(this.V_PRF_NM);
    //(this.V_PRF_VAL);
    for (let j = 0; j < this.V_PRF_NM.length; j++) {
      this.data.setchartstyling(this.APP_ID, this.PRCS_ID, this.SRC_ID, this.V_PRF_NM[j], this.V_PRF_VAL[j]).subscribe(
        () => {
          //(res);
        });
    }
  }
  ngOnInit() {
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

    // for (let j = 0; j <= this.columnsToDisplay.length; j++) {
    // insecure
    // this.http.get<data>(this.apiService.endPoints.insecure + "FieldName=" + this.columnsToDisplay[j] + "&REST_Service=Field_Description&Verb=GET")
    //   .subscribe(res => {

    //     var name = res.Field_Name;
    //     var tip = res.Description_Text;
    //     var i;
    //     for (i = 0; i < tip.length; i++) {
    //       this.helpertext[name[i]] = tip[i];
    //     }
    //   })
    // secure
    //   this.https.get(this.apiService.endPoints.secure + "FieldName=" + this.columnsToDisplay[j] + "&REST_Service=Field_Description&Verb=GET", this.apiService.setHeaders())
    //     .subscribe(res => {
    //       var data: data = res.json();
    //       var name = data.Field_Name;
    //       var tip = data.Description_Text;
    //       var i;
    //       for (i = 0; i < tip.length; i++) {
    //         this.helpertext[name[i]] = tip[i];
    //       }
    //     })

    // }
    this.showhide('Table');
    //this.getchartstyling();
  }

  ExecuteAgain() {
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
    // console.log('exitbtn_click');
    this.endUserService.processCancel(this.SRVC_ID, this.PRCS_TXN_ID, this.globals.Report.TEMP_UNIQUE_ID[0]).subscribe(
      () => {
        // console.log('Response:\n', res);
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
    //(this.columnsToDisplay);
  }
  //__________________________________________________________
  Execute_res_data: any[];
  // progress: boolean = false;
  Execute_Now() {
    console.log(this.Exe_data);
    // this.progress = true;
    let body = {
      "V_APP_CD": this.Exe_data['SL_APP_CD'].toString(),
      "V_PRCS_CD": this.Exe_data['SL_PRC_CD'].toString(),
      "V_SRVC_CD": 'START',
      "V_SRC_CD": this.V_SRC_CD,
      "V_USR_NM": this.V_USR_NM

    };

    // insecure
    // this.https.post(this.apiService.endPoints.insecureProcessReport, body).subscribe(
    //   res => {

    //     //(res.json());
    //     this.Execute_res_data = res.json();
    //     //(this.Execute_res_data);

    //     this.GenerateReportTable();
    //   }
    // );

    // secure
    this.https.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders()).subscribe(
      res => {

        console.log(res.json());
        this.Execute_res_data = res.json();
        //(this.Execute_res_data);
        // this.GenerateReportTable();
        this.route.navigateByUrl('End_User', { skipLocationChange: true });
      }
    );
  }
  GenerateReportTable() {
    //("in GenerateReportTable");

    //"&V_DSPLY_WAIT_SEC=100&V_MNL_WAIT_SEC=180&REST_Service=Report&Verb=GET
    console.log(this.globalUser.currentUser);
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
          //(res.json());
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