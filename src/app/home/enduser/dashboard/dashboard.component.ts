// import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSelectChange } from '@angular/material/select';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatTableDataSource } from '@angular/material/table';
// import { Http, Response, Headers } from '@angular/http';
// import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
// import { Router } from '@angular/router'
// import { Observable, Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { MONTH } from 'ngx-bootstrap/chronos/units/constants';
// import { trigger } from '@angular/animations';
// import { dboard_secondary } from './dboard_secondary';
// import { HostListener } from "@angular/core";
// import { Globals } from '../../../services/globals';
// import { ConfigServiceService } from '../../../services/config-service.service';
// import { HomeComponent } from '../../home.component';
// import { RollserviceService } from '../../../services/rollservice.service';
// import { StorageSessionService } from '../../../services/storage-session.service';
// import { OptionalValuesService } from '../../../services/optional-values.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   // styleUrls: ['./dashboard.component.css']
// })

// export class DashboardComponent extends dboard_secondary implements OnInit, AfterViewInit, OnDestroy {

//   V_SRC_CD: string = '';
//   V_USR_NM: string = '';
//   dataSource_Inp = new MatTableDataSource<{ Input_name: string; Input_value: string; }>();
//   dataSource_Oup = new MatTableDataSource<{ Output_name: string; Output_value: string; }>();
//   user_list = [this.V_USR_NM];
//   dataSource = new MatTableDataSource<dboard>();
//   domain_name = this.globals.domain_name;
//   screenHeight = 0;
//   screenWidth = 0;
//   mobileView = false;
//   desktopView = true;
//   applicationValues$: Subscription;
//   processValues$: Subscription;
//   serviceValues$: Subscription;
//   @HostListener('window:resize', ['$event'])
//   onResize(event?) {
//     this.screenHeight = window.innerHeight;
//     this.screenWidth = window.innerWidth;
//     if (this.screenWidth <= 767) {
//       this.mobileView = true;
//       this.desktopView = false;
//     } else {
//       this.mobileView = false;
//       this.desktopView = true;
//     }
//   }
//   ngOnInit(): void {
//     this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
//     this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
//     this.start_date = new Date();
//     this.end_date = new Date();
//     this.start_date.setHours(0, 0, 0);
//     this.functiongetgroups();
//     this.populate_dboard_table();
//     //this.populate_inp_table();
//     //this.populate_oup_table();
//   }

//   ngAfterViewInit(): void {
//     if (!this.applicationValuesObservable.length) {
//       this.functionapplist();
//     }
//     this.app.START = false;
//     // commented 10thApril
//     // if (this.selectedapp != 'ALL')
//     //   this.functionprocesslist();
//     // if (this.selectedprcs != 'ALL')
//     //   this.functionserviceslist();
//     //throw new Error("Method not implemented.");
//   }
//   constructor(

//     public globals: Globals,
//     private Router: Router,
//     private http: HttpClient,
//     private https: Http,
//     private StorageSessionService: StorageSessionService,
//     private data: ConfigServiceService,
//     private roll: RollserviceService,
//     public app: HomeComponent,
//     private optionalService: OptionalValuesService
//   ) {
//     super(app, globals);
//     this.onResize();
//     this.applicationValues$ = this.optionalService.applicationOptionalValue.subscribe(data => {
//       if (data != null) {
//         this.applicationValuesObservable = data;
//         this.APP_CD = (data.sort(function (a, b) { return a.localeCompare(b); }));
//       }
//     });
//     this.processValues$ = this.optionalService.processOptionalValue.subscribe(data => {
//       if (data != null) {
//         this.processValuesObservable = data;
//         if (this.processValuesObservable.length) {
//           this.processValues = [];
//           var value = 'ALL';
//           if (this.selectedapp !== '' && this.selectedapp !== value) {
//             this.processValuesObservable.forEach(ele => {
//               if (ele.app === this.selectedapp) {
//                 this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
//               }
//             });
//           }
//         }
//       }
//     });
//     this.serviceValues$ = this.optionalService.serviceOptionalValue.subscribe(data => {
//       if (data != null) {
//         this.serviceValuesObservable = [];
//         this.serviceValuesObservable = data;
//         if (this.serviceValuesObservable.length) {
//           this.serviceValues = [];
//           var value = 'ALL';
//           if (this.selectedapp !== '' && this.selectedprcs !== '' && this.selectedapp !== value) {
//             this.serviceValuesObservable.forEach(ele => {
//               if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
//                 this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
//               }
//             });
//           }
//         }
//       }
//     });
//   }

//   GenerateReportTable(): any {

//     let body = {
//       //V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
//       V_SRC_ID: this.ID_DATA['SRC'],
//       V_UNIQUE_ID: this.ID_DATA['UNIQUE_ID'],
//       //V_APP_ID: this.Execute_res_data['V_APP_ID'],
//       V_APP_ID: this.ID_DATA['APP'],
//       //V_PRCS_ID: this.Execute_res_data['V_PRCS_ID'],
//       V_PRCS_ID: this.ID_DATA['PRCS'],
//       V_PRCS_TXN_ID: this.ID_DATA['PRCS_TXN'],//this.Execute_res_data['V_PRCS_TXN_ID'],
//       //V_NAV_DIRECTION: this.Execute_res_data['V_NAV_DIRECTION'],
//       // V_DSPLY_WAIT_SEC: 100,
//       // V_MNL_WAIT_SEC: 180,
//       REST_Service: 'Report',
//       Verb: 'POST'
//     }
//     this.https.post("https://" + this.domain_name + "/rest/Process/Report", body)
//       .subscribe(
//         res => {
//           ('Report...');
//           (res.json());
//           //this.StorageSessionService.setCookies("report_table", res.json());
//           //this.getReportData();
//           // this.chart_JSON_call();
//         }
//       );
//     //  this.getReportData();
//   }

//   ngOnDestroy() {
//     this.applicationValues$.unsubscribe();
//     this.processValues$.unsubscribe();
//     this.serviceValues$.unsubscribe();
//   }
//   /*  getReportData() {

//       //this.Table_of_Data = this.StorageSessionService.getCookies('report_table')['RESULT'];
//       //(this.dataStored.getCookies('report_table'));
//       this.SRVC_CD_Rep = this.StorageSessionService.getCookies('report_table')['SRVC_CD'][0];
//       this.SRVC_ID = this.StorageSessionService.getCookies('report_table')['SRVC_ID'][0];
//       var Table_of_Data1 = this.StorageSessionService.getCookies('report_table')['LOG_VAL'];
//       //this.iddata.push(this.StorageSessionService.getCookies('iddata'));
//       this.PRCS_TXN_ID_Rep = this.StorageSessionService.getCookies('iddata')['PRCS_TXN'];
//       this.APP_ID = this.StorageSessionService.getCookies('iddata')['APP'];
//       this.PRCS_ID = this.StorageSessionService.getCookies('iddata')['PRCS'];
//       this.SRC_ID = this.StorageSessionService.getCookies('iddata')['SRC'];
//       (Table_of_Data1);
//       var obj={
//         SRVC_CD:this.SRVC_CD_Rep,
//         SRVC_ID:this.SRVC_ID,
//         PRCS_TXN_ID:this.PRCS_TXN_ID_Rep,
//         APP_ID:this.APP_ID,
//         PRCS_ID:this.PRCS_ID,
//         SRC_ID:this.SRC_ID
//       };
//       (obj);

//       //(JSON.parse(this.Table_of_Data1[0]));

//       //this.columnsToDisplay = Object.keys(JSON.parse(this.Table_of_Data1[0]));
//     }*/

//   Execute_res_data: any[];
//   progress: boolean = false;
//   //Exe_data = this.StorageSessionService.getSession("Exe_data");
//   Execute_Now() {
//     this.progress = true;
//     this.ID_DATA = { SRC: '298', APP: '333', PRCS: '585', PRCS_TXN: '8905', UNIQUE_ID: '3855' };
//     //this.chart_JSON_call();
//     //(this.Exe_data);
//     if (this.selectedapp != null && this.selectedapp != 'ALL' && this.selectedprcs != null && this.selectedprcs != 'ALL') {
//       let body = {
//         "V_APP_CD": this.selectedapp,
//         "V_PRCS_CD": this.selectedprcs,
//         "V_SRVC_CD": 'START',
//         "V_SRC_CD": this.V_SRC_CD,
//         "V_USR_NM": this.V_USR_NM

//       };

//       this.https.post("https://" + this.domain_name + "/rest/Process/Execute", body).subscribe(
//         res => {

//           // (res.json());
//           ("Check this");
//           this.Execute_res_data = res.json();
//           this.ID_DATA = this.Execute_res_data;
//           (res.json());
//         }
//       );
//     }
//   }

//   chart_JSON_call(res_, elem) {
//     this.showCanvas = true;
//     this.http.get(this.apiUrlGet + "V_SRC_ID=" + res_['V_SRC_ID'][0] + "&V_APP_ID=" + res_['V_APP_ID'][0] + "&V_PRCS_ID=" + res_['V_PRCS_ID'][0] + "&V_PRCS_TXN_ID=" + elem.PTXN_ID + "&REST_Service=ProcessStatus&Verb=GET").subscribe(res => {
//       (res);
//       var start_time = [], end_time = [], Process = [];

//       for (let i = 0; i < res['INS_DT_TM'].length; i++) {
//         start_time[i] = res['INS_DT_TM'][i].substring(11);
//         end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
//         Process[i] = res['PRDCR_SRVC_CD'][i];
//       }
//       this.show_gantt_chart(Process, start_time, end_time);
//       this.show_pie(Process, start_time, end_time);
//       this.show_bar_chart(Process, start_time, end_time);
//       //delay
//     });
//   }

//   show_gantt_chart(Process, start_time, end_time) {
//     var count = 0, flag = false, val1;
//     var mydataset = [];
//     for (let i = 0; i < Process.length; i++) {
//       var R = Math.floor(Math.random() * 200);
//       var G = Math.floor(Math.random() * 200);
//       var B = Math.floor(Math.random() * 200);
//       //((this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])));
//       //((this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])));
//       mydataset[Process.length - i - 1] = {
//         backgroundColor: "rgba(" + R + ',' + G + ',' + B + ")",
//         borderColor: "rgba(" + R + ',' + G + ',' + B + ")",
//         fill: false,
//         borderWidth: 20,
//         pointRadius: 0,
//         data: [
//           {
//             x: (this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])),
//             y: Process.length - i - 1
//           }, {
//             x: (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])),
//             y: Process.length - i - 1
//           }
//         ]
//       }
//     }

//     const ctx = (<HTMLCanvasElement>document.getElementById("myGanttchart")).getContext('2d');
//     var scatterChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         datasets: mydataset
//       },
//       options: {
//         animation: {
//           duration: 0
//         },
//         legend: {
//           display: false
//         },
//         scales: {
//           yAxes: [{
//             scaleLabel: {
//               display: true,
//               labelString: 'Processes',
//               fontStyle: 'bold'
//             },
//             gridLines: {
//               display: false,
//             },
//             ticks: {
//               beginAtZero: true,
//               callback: function (value, index, values) {
//                 return Process[Process.length - value - 1];
//               }
//             }
//           }],
//           xAxes: [{
//             type: 'linear',
//             position: 'top',
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: 'Time',
//               fontStyle: 'bold'
//             },
//             ticks: {
//               //beginAtZero :true,
//               callback: function (value, index, values) {
//                 if (value == Math.floor(value)) {
//                   var beg_str = start_time[0].substring(0, 2);
//                   var begstr = parseInt(beg_str);
//                   var mid_str = (start_time[0][3] + start_time[0][4]);
//                   var midstr = parseInt(mid_str);
//                   var end_str = start_time[0].substring(6);
//                   var endstr = parseInt(end_str);
//                   endstr += value;
//                   midstr += Math.floor(endstr / 60);
//                   endstr = endstr - 60 * Math.floor(endstr / 60);
//                   begstr += Math.floor(midstr / 60);
//                   midstr = midstr - 60 * Math.floor(midstr / 60);
//                   //(index);

//                   if (midstr < 10)
//                     mid_str = '0' + midstr;
//                   if (endstr < 10)
//                     end_str = '0' + endstr;
//                   if (begstr < 10)
//                     beg_str = '0' + begstr;
//                   //(count);
//                   return beg_str + ':' + mid_str + ':' + end_str;
//                 }
//                 //return value/val1;
//                 //return index;
//               },
//             }

//           }],
//         }
//       }
//     });
//   }

//   show_pie(Process, start_time, end_time) {

//     var total_time = this.time_to_num(end_time[Process.length - 1]) + this.time_to_num(start_time[0]);
//     var mydata = [];
//     var color = [], bcolor = [];
//     var borderwidth_ = [];
//     for (let i = 0; i < Process.length; i++) {
//       var R = Math.floor(Math.random() * 200);
//       var G = Math.floor(Math.random() * 200);
//       var B = Math.floor(Math.random() * 200);
//       var temp = (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]));
//       mydata[i] = temp;
//       color[i] = 'rgb(' + R + ',' + G + ',' + B + ',0.8)';
//       bcolor[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
//       borderwidth_[i] = 1;
//     }
//     var data2 = {
//       labels: Process,
//       datasets: [
//         {
//           data: mydata,
//           backgroundColor: color,
//           borderColor: bcolor,
//           borderWidth: borderwidth_
//         }
//       ]
//     };
//     const ctx = (<HTMLCanvasElement>document.getElementById("myPie")).getContext('2d');
//     var chart1 = new Chart(ctx, {
//       type: "pie",
//       data: data2,
//       options: {
//         animation: {
//           duration: 0
//         },
//         responsive: true,
//         tooltips: {
//           callbacks: {
//             title: function (tooltipItem, data) {
//               return data['labels'][tooltipItem[0]['index']];
//             },
//             label: function (tooltipItem, data) {
//               //(tooltipItem);
//               //(data['datasets'][0]['data'][tooltipItem['index']]);
//               var ret = mydata[tooltipItem['index']];
//               ret = Math.floor(ret * 100) / 100;
//               return ret + ' sec';
//             }
//           },
//           backgroundColor: '#FFF',
//           titleFontSize: 16,
//           titleFontColor: '#0066ff',
//           bodyFontColor: '#000',
//           bodyFontSize: 14,
//           displayColors: false
//         },
//         title: {
//           display: true,
//           position: "top",
//           text: "Current Processes",
//           fontSize: 12,
//           fontColor: "#111"
//         },
//         legend: {
//           display: true,
//           position: "right",
//           labels: {
//             fontColor: "#333",
//             fontSize: 10
//           }
//         }
//       },
//     });
//   }

//   show_bar_chart(Process, start_time, end_time) {
//     var val1, flag = false;
//     var duration = [];
//     var color = [];
//     var bcolor = [];
//     var temp_HH, temp_MM, temp_SS;
//     for (let i = 0; i < Process.length; i++) {
//       let len_temp = Process[i].length;
//       Process[i] = Process[i].substring(0, 11);
//       if (len_temp > Process[i].length)
//         Process[i] = Process[i] + '...';
//       var temp = this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]);
//       duration[i] = temp;
//       //(duration);
//       var R = Math.floor(Math.random() * 200);
//       var G = Math.floor(Math.random() * 200);
//       var B = Math.floor(Math.random() * 200);
//       color[i] = 'rgba(' + R + ',' + G + ',' + B + ',0.6)';
//       bcolor[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
//     }
//     const ctx = (<HTMLCanvasElement>document.getElementById("myBarchart")).getContext('2d');
//     var myBarChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: Process,
//         datasets: [
//           {
//             data: duration,
//             backgroundColor: color,
//             borderColor: bcolor,
//             borderWidth: 1
//           }]
//       },
//       options: {
//         animation: {
//           duration: 0
//         },
//         responsive: true,
//         legend: {
//           display: false,
//           position: "bottom",
//           labels: {
//             fontColor: "#333",
//             fontSize: 16
//           }
//         },
//         tooltips: {
//           callbacks: {
//             title: function (tooltipItem, data) {
//               return data['labels'][tooltipItem[0]['index']];
//             },
//             label: function (tooltipItem, data) {
//               //(tooltipItem);
//               //(data['datasets'][0]['data'][tooltipItem['index']]);
//               var ret = duration[tooltipItem['index']];
//               ret = Math.floor(ret * 100) / 100;
//               return ret + ' sec';
//             }
//           },
//           backgroundColor: '#FFF',
//           titleFontSize: 16,
//           titleFontColor: '#0066ff',
//           bodyFontColor: '#000',
//           bodyFontSize: 14,
//           displayColors: false
//         },
//         scales: {
//           yAxes: [{
//             display: true,
//             scaleLabel: {
//               display: true,
//               labelString: 'Duration',
//               fontStyle: 'bold'
//             },
//             ticks: {
//               min: 0,
//               callback: function (value, index, values) {
//                 if (value == Math.floor(value)) {
//                   var begstr = 0;
//                   var midstr = 0;

//                   var endstr = value;
//                   //(index*value);
//                   midstr += Math.floor(endstr / 60);
//                   endstr = endstr - 60 * Math.floor(endstr / 60);
//                   begstr += Math.floor(midstr / 60);
//                   midstr = midstr - 60 * Math.floor(midstr / 60);
//                   //(index);
//                   let beg_str = begstr.toString(), mid_str = midstr.toString(), end_str = endstr.toString();
//                   if (midstr < 10)
//                     mid_str = '0' + midstr;
//                   if (endstr < 10)
//                     end_str = '0' + endstr;
//                   if (begstr < 10)
//                     beg_str = '0' + begstr;
//                   //(min);
//                   return beg_str + ':' + mid_str + ':' + end_str;
//                 }
//                 //return value;
//                 //return index;
//               },
//             }
//           }],
//           xAxes: [{
//             display: true,
//             gridLines: {
//               display: false,
//             },
//             scaleLabel: {
//               display: true,
//               labelString: 'Processes',
//               fontStyle: 'bold'
//             },
//           }]
//         }
//       }
//     });
//   }

//   clickme(u, evt) {
//     if (this.mobileView)
//       u = evt.value;
//     this.selectedapp = u;
//     this.app.selected_APPLICATION = u;
//     //this.hide_showElements(evt.target.parentNode.parentNode.parentNode);
//     if (this.desktopView) {

//     } else {

//     }
//     this.predapp_sl = u;
//     this.selectedsrvc = 'ALL';
//     this.app.selected_SERVICE = 'ALL';
//     this.app.selected_PROCESS = 'ALL';
//     this.selectedprcs = 'ALL';
//     //(this.selectedapp);
//     this.functionprocesslist();
//   }

//   clickme1(u, evt) {
//     if (this.mobileView)
//       u = evt.value;
//     this.selectedprcs = u;
//     this.app.selected_PROCESS = u;
//     if (this.desktopView)
//       (<HTMLElement>document.querySelectorAll("mat-list")[2]).style.display = "block";
//     this.predpro_sl = u;
//     this.selectedsrvc = 'ALL';
//     this.app.selected_SERVICE = 'ALL';
//     this.functionserviceslist();
//   }

//   clickme2(u, evt) {
//     if (this.mobileView)
//       u = evt.value;
//     this.selectedsrvc = u;
//     this.app.selected_SERVICE = u;
//     this.predsvc_sl = u;
//   }

//   clickme3(evt) {
//     this.selectedusrgp = evt.value;
//     if (evt.value == null) {
//       this.selectedusr = null;
//     }
//   }

//   clickme4(evt) {
//     this.selectedusr = evt.value;
//   }

//   clickme5(event: MatSelectChange) {
//     this.V_TXN_STS = event.value;
//   }
//   start_date: any = "";
//   end_date: any = "";
//   seq: number = 0;
//   onRowClick(elem) {
//     if (elem.NO != this.seq) {
//       this.showInput = false;
//       this.showOutput = false;
//       this.showSLA = false;
//       //(elem);
//       this.seq = elem.NO;
//       //elem.STXN_ID='78737';
//       this.data.getID(elem.Application, elem.Process, elem.Service).subscribe(_res_ => {
//         (_res_.json());
//         let res_ = _res_.json();

//         this.http.get<any>(this.apiUrlGet + "V_SRC_ID=" + res_['V_SRC_ID'][0] + "&V_TXN_ID=" + elem.STXN_ID + "&IN_OUT_BOTH=BOTH&REST_Service=ServicePayload&Verb=GET").subscribe(
//           res => {
//             (res);
//             var start = 0;
//             var end = 0;
//             var end_ = 0;
//             var inp_nm = [];
//             var inp_vl = [];
//             let iter = 0;
//             var newdate = new Date();
//             ///(newdate:'dd/MM/yyyy');
//             var inputIndex = -1, outputIndex = -1;
//             if (res.LOG_NM.length > 0) {
//               for (let i = 0; i < res.LOG_NM.length; i++) {
//                 if (res.LOG_NM[i] == "V_SRVC_INPUT") {
//                   inputIndex = i;
//                 }
//                 if (res.LOG_NM[i] == "V_SRVC_OUTPUT") {
//                   outputIndex = i;
//                 }
//               }
//             }
//             if (inputIndex != -1) {
//               var braceOpened = false;
//               for (let i = 0; i < res.LOG_VAL[inputIndex].length; i++) {
//                 if (res.LOG_VAL[inputIndex][i] == '{' || res.LOG_VAL[inputIndex][i] == '}'
//                   || (res.LOG_VAL[inputIndex][i] == ',' && !braceOpened) || res.LOG_VAL[0][i] == ' ') {
//                   start = i;
//                 }
//                 if (res.LOG_VAL[inputIndex][i] == '[') {
//                   braceOpened = true;
//                 }
//                 if (res.LOG_VAL[inputIndex][i] == ']') {
//                   braceOpened = false;
//                 }
//                 if (res.LOG_VAL[inputIndex][i] == '=') {
//                   end = i;
//                   //(res.LOG_VAL[0].substring(start+1,end));
//                   inp_nm[iter] = res.LOG_VAL[inputIndex].substring(start + 1, end);
//                 }
//                 if ((res.LOG_VAL[inputIndex][i] == ',' && !braceOpened) || res.LOG_VAL[inputIndex][i] == "}") {
//                   end_ = i;
//                   //(res.LOG_VAL[0].substring(end+1,end_));
//                   inp_vl[iter] = res.LOG_VAL[inputIndex].substring(end + 1, end_);
//                   iter++;
//                 }
//               }
//               this.showInput = true;
//               this.populate_inp_table(inp_nm, inp_vl);
//               for (let i = 0; i < inp_nm.length; i++) {
//                 if (inp_vl[i].length > 0) {
//                   (inp_nm[i] + ": " + inp_vl[i]);
//                 }
//               }
//             }
//             var oup_nm = [];
//             var oup_vl = [];
//             if (outputIndex != -1) {
//               start = 0, end = 0, end_ = 0, iter = 0;
//               var braceOpened = false;
//               for (let i = 0; i < res.LOG_VAL[outputIndex].length; i++) {
//                 if (res.LOG_VAL[outputIndex][i] == '{' || res.LOG_VAL[outputIndex][i] == '}'
//                   || (res.LOG_VAL[outputIndex][i] == ',' && !braceOpened) || res.LOG_VAL[outputIndex][i] == ' ') {
//                   start = i;
//                 }
//                 if (res.LOG_VAL[outputIndex][i] == '[') {
//                   braceOpened = true;
//                 }
//                 if (res.LOG_VAL[outputIndex][i] == ']') {
//                   braceOpened = false;
//                 }
//                 if (res.LOG_VAL[outputIndex][i] == '=') {
//                   end = i;
//                   //(res.LOG_VAL[0].substring(start+1,end));
//                   oup_nm[iter] = res.LOG_VAL[outputIndex].substring(start + 1, end);
//                 }
//                 if ((res.LOG_VAL[outputIndex][i] == "," && !braceOpened) || res.LOG_VAL[outputIndex][i] == "}") {
//                   end_ = i;
//                   //(res.LOG_VAL[0].substring(end+1,end_));
//                   oup_vl[iter] = res.LOG_VAL[outputIndex].substring(end + 1, end_);
//                   iter++;
//                 }
//               }
//               ("Output______");
//               this.showOutput = true;
//               this.populate_oup_table(oup_nm, oup_vl);
//               for (let i = 0; i < oup_nm.length; i++) {
//                 if (oup_vl[i].length > 0) {
//                   (oup_nm[i] + ": " + oup_vl[i]);
//                 }
//               }
//               this.chart_JSON_call(res_, elem);
//             }
//           }

//         );
//       });
//     }

//   }
//   onFetchClick() {
//     this.showLoading = true;
//     this.showElement = false;
//     this.showNotFound = false;
//     //this.showPayloads=false;
//     this.showInput = false;
//     this.showOutput = false;
//     this.showSLA = false;
//     this.showCanvas = false;
//     this.Order_ID = (<HTMLInputElement>document.querySelector("#order_id")).value;
//     this.PRCS_TXN_ID = (<HTMLInputElement>document.querySelector("#ptxn_id")).value;
//     this.SRVC_TXN_ID = (<HTMLInputElement>document.querySelector("#stxn_id")).value;
//     //var datestr = (<HTMLInputElement>document.querySelector("input[placeholder='From']")).value;
//     var date;
//     var stmonth;
//     var stdate, sthrs, stmin, stsec;
//     var date11, time11;
//     if (this.start_date != null) {
//       date = new Date(this.start_date);

//       //------------------------------------------------------
//       /*Start Date*/
//       stmonth = this.start_date.getMonth() + 1;
//       if (stmonth < 10)
//         stmonth = '0' + stmonth;

//       stdate = this.start_date.getDate();
//       if (stdate < 10)
//         stdate = '0' + stdate;

//       sthrs = this.start_date.getHours();
//       if (sthrs < 10)
//         sthrs = '0' + sthrs;
//       stmin = this.start_date.getMinutes();
//       if (stmin < 10)
//         stmin = '0' + stmin;
//       stsec = this.start_date.getSeconds();
//       if (stsec < 10)
//         stsec = '0' + stsec;

//       date11 = this.start_date.getFullYear() + '-' + stmonth + '-' + stdate;
//       time11 = sthrs + ":" + stmin + ":" + stsec;
//       this.From = date11 + ' ' + time11;

//       (this.From);
//     } else {
//       this.From = '';
//     }
//     if (this.end_date != null) {
//       date = new Date(this.end_date);

//       //------------------------------------------------------
//       /*Start Date*/
//       stmonth = this.end_date.getMonth() + 1;
//       if (stmonth < 10)
//         stmonth = '0' + stmonth;

//       stdate = this.end_date.getDate();
//       if (stdate < 10)
//         stdate = '0' + stdate;

//       sthrs = this.end_date.getHours();
//       if (sthrs < 10)
//         sthrs = '0' + sthrs;
//       stmin = this.end_date.getMinutes();
//       if (stmin < 10)
//         stmin = '0' + stmin;
//       stsec = this.end_date.getSeconds();
//       if (stsec < 10)
//         stsec = '0' + stsec;

//       date11 = this.end_date.getFullYear() + '-' + stmonth + '-' + stdate;
//       time11 = sthrs + ":" + stmin + ":" + stsec;
//       this.To = date11 + ' ' + time11;

//       (this.To);
//     } else {
//       this.To = '';
//     }
//     this.fetchData();
//   }


//   // ----------- get Applications ------------
//   functionapplist() {
//     // this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=SourceApps&Verb=GET").subscribe(
//     //   res => {
//     //     this.APP_CD = this.APP_CD.concat(res.APP_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //     //this.app.APP_CD_GLOBAL['APP_CD']=[].concat(res.APP_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //   }
//     // );
//     this.optionalService.getApplicationOptionalValue();
//   }

//   //-------------Get Processes---------------
//   functionprocesslist() {
//     this.PRCS_CD = ['ALL'];
//     this.SRVC_CD = ['ALL'];
//     if (!this.processValuesObservable.length) {
//       this.optionalService.getProcessOptionalValue(this.selectedapp);
//     } else {
//       let flag = 0;
//       this.processValuesObservable.forEach(ele => {
//         if (ele.app === this.selectedapp) {
//           if (ele.data.CREATE[0] == "Y" && ele.data.DELETE[0] == "Y" && ele.data.UPDATE[0] == "Y") {
//             this.processValues = [];
//             this.PRCS_CD = (ele.process.sort(function (a, b) { return a.localeCompare(b); }));
//             flag = 1;
//           }
//         }
//       });
//       if (!flag) {
//         this.optionalService.getProcessOptionalValue(this.selectedapp);
//       }
//     }
//     // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
//     //   res => {

//     //     if (res.CREATE[0] == "Y" && res.DELETE[0] == "Y" && res.UPDATE[0] == "Y") {
//     //       this.PRCS_CD = this.PRCS_CD.concat(res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //       //this.app.PRC_CD_GLOBAL['PRCS_CD']=[].concat(res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //     } else { }
//     //   }
//     // );
//   }

//   // ----------  get Services ------------
//   functionserviceslist() {
//     this.SRVC_CD = ['ALL'];
//     if (!this.serviceValuesObservable.length) {
//       this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
//     } else {
//       let flag = 0;
//       this.serviceValuesObservable.forEach(ele => {
//         if (ele.app === this.selectedapp && ele.process === this.selectedprcs) {
//           this.serviceValues = [];
//           this.SRVC_CD = (ele.service.sort(function (a, b) { return a.localeCompare(b); }));
//           flag = 1;
//         }
//       });
//       if (!flag) {
//         this.optionalService.getServiceOptionalValue(this.selectedapp, this.selectedprcs);
//       }
//     }
//     // this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + this.selectedprcs + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
//     //   res => {

//     //     this.SRVC_CD = this.SRVC_CD.concat(res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //     //this.app.SRVC_CD_GLOBAL['SRVC_CD']=[].concat(res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b); }));
//     //   }
//     // );
//   }

//   // -------------for getting groups ---------------
//   functiongetgroups() {
//     this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Groups&Verb=GET").subscribe(
//       res => {

//         this.groups = res.USR_GRP_CD.sort(function (a, b) { return a.localeCompare(b); });
//       }
//     );
//   }

//   //_____________Populate dboard_table________________
//   populate_dboard_table() {

//     this.dataSource.data = [{
//       NO: '',
//       Application: '',
//       Process: '',
//       Service: '',
//       Order_ID: '',
//       PTXN_ID: '',
//       STXN_ID: '',
//       TXN_STAT: '',
//       Username: '',
//       Last_updated: ''
//     }];
//   }

//   //_____________Populate Input_table______________
//   populate_inp_table(inp_nm, inp_vl) {
//     this.dataSource_Inp.data = [];
//     for (let i = 0; i < inp_nm.length; i++) {
//       if (inp_vl[i].length > 0) {
//         this.dataSource_Inp.data = this.dataSource_Inp.data.concat({ Input_name: inp_nm[i], Input_value: inp_vl[i] });
//       }
//     }
//     //this.dataSource_Inp.data = [{ Input_name: 'Dummy 1', Input_value: 'Dummy 2' },
//     //{ Input_name: 'Dummy 1', Input_value: 'Dummy 2' }];
//   }

//   //_____________Populate Input_table______________
//   populate_oup_table(oup_nm, oup_vl) {
//     this.dataSource_Oup.data = [];
//     for (let i = 0; i < oup_nm.length; i++) {
//       if (oup_vl[i].length > 0) {
//         this.dataSource_Oup.data = this.dataSource_Oup.data.concat({ Output_name: oup_nm[i], Output_value: oup_vl[i] });
//       }
//     }
//     //this.dataSource_Oup.data = [{ Output_name: 'Dummy 1', Output_value: 'Dummy 2' },
//     //{ Output_name: 'Dummy 1', Output_value: 'Dummy 2' }];
//   }

//   //_____________Fetch Operation________________
//   fetchData() {

//     var jsonurl = this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD;
//     var jsonurl_end = "&REST_Service=Register&Verb=GET";
//     var jsonurl_mid: string = "";
//     var flag = true;
//     var new_PRCS_CD: any[];

//     if (this.selectedapp != "ALL" && this.selectedapp != '') {
//       jsonurl_mid = jsonurl_mid.concat("&V_APP_CD=" + this.selectedapp);
//     }
//     else if (this.selectedapp == "ALL") {
//       jsonurl_mid = jsonurl_mid.concat("&V_APP_CD=" + "All");
//     }
//     //___________jsonurl_mid for All PRCS_CD__________
//     if (this.selectedprcs != "ALL" && this.selectedprcs != '') {
//       jsonurl_mid = jsonurl_mid.concat("&V_PRCS_CD=" + this.selectedprcs);
//     } else if (this.selectedprcs == "ALL") {
//       jsonurl_mid = jsonurl_mid.concat("&V_PRCS_CD=" + "All");
//     }

//     if (this.selectedsrvc != "ALL" && this.selectedsrvc != '') {
//       jsonurl_mid = jsonurl_mid.concat("&V_SRVC_CD=" + this.selectedsrvc);
//     } else if (this.selectedprcs == "ALL") {
//       jsonurl_mid = jsonurl_mid.concat("&V_SRVC_CD=" + "All");
//     }

//     if (this.selectedusrgp.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_USR_GRP_CD=" + this.selectedusrgp);
//     }

//     if (this.selectedusr.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_USR_NM=" + this.selectedusr);
//     }

//     if (this.V_TXN_STS.length > 0 && this.V_TXN_STS != "ALL") {
//       jsonurl_mid = jsonurl_mid.concat("&V_TXN_STS=" + this.V_TXN_STS);
//     } else if (this.V_TXN_STS == "ALL") {
//       jsonurl_mid = jsonurl_mid.concat("&V_TXN_STS=" + "All");
//     }

//     if (this.Order_ID.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_ORD_ID=" + this.Order_ID);
//     }

//     //_______jsonurl_mid for Process Txn_ID_______
//     if (this.PRCS_TXN_ID.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_PRCS_TXN_ID=" + this.PRCS_TXN_ID);
//     }

//     //_______jsonurl_mid for Service Txn_ID________
//     if (this.SRVC_TXN_ID.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_TXN_ID=" + this.SRVC_TXN_ID);
//     }
//     if (this.From.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_FROM=" + this.From);
//     }
//     if (this.To.length > 0) {
//       jsonurl_mid = jsonurl_mid.concat("&V_TO=" + this.To);
//     }

//     var last_ended: number = 0;
//     this.dataSource.data = [];
//     this.get_data_dboard(0, jsonurl, jsonurl_mid, jsonurl_end, last_ended);
//   }

//   get_data_dboard(t, jsonurl, jsonurl_mid, jsonurl_end, last_ended) {

//     this.http.get<any>(jsonurl + jsonurl_mid + jsonurl_end).subscribe(
//       res => {
//         this.showLoading = false;
//         (jsonurl + jsonurl_mid + jsonurl_end);
//         let i: number;
//         if (res.APP_CD.length == 0) {
//           this.showNotFound = true;
//           this.showElement = false;
//         } else {
//           this.showElement = true;
//           this.showNotFound = false;
//         }
//         for (i = 0; i < res.APP_CD.length; i++) {

//           this.dataSource.data = this.dataSource.data.concat([{
//             NO: (last_ended + i + 1).toString(),
//             Application: res.APP_CD[i],
//             Process: res.PRCS_CD[i],
//             Service: res.SRVC_CD[i],
//             Order_ID: res.ORD_ID[i],
//             PTXN_ID: res.PRCS_TXN_ID[i],
//             STXN_ID: res.TXN_ID[i],
//             TXN_STAT: res.TXN_STS[i],
//             Username: res.USR_NM[i],
//             Last_updated: res.LST_UPD_DT_TM[i]
//           }]);
//           this.dataSource.data = this.dataSource.data.sort(function (a, b) { return b.PTXN_ID.localeCompare(a.PTXN_ID); });

//         }

//         last_ended += i + 1;
//         t++;
//       }
//     );
//   }

// }

// export interface data {
//   APP_CD: string[];
//   PRCS_CD: string[];
//   SRVC_CD: string[];
//   CREATE: string[];
//   UPDATE: string[];
//   DELETE: string[];
//   PRDCR_SRVC_CD: string[];
//   TRNSN_CND: string[];
//   CONT_ON_ERR_FLG: string[];
//   AUTO_ID: string[];
//   USR_GRP_CD: string[];
// }
// export interface dboard {
//   NO: string;
//   Application: string;
//   Process: string;
//   Service: string;
//   Order_ID: string;
//   PTXN_ID: string;
//   STXN_ID: string;
//   TXN_STAT: string;
//   Username: string;
//   Last_updated: string;
// }
