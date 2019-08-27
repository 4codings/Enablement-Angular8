import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportTableComponent } from '../report-table.component';
import { ConfigServiceService } from '../../../../services/config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isFulfilled } from 'q';

@Component({
  selector: 'personalization-table',
  templateUrl: './personalization-table.component.html',
  styleUrls: ['./personalization-table.component.scss']
})
export class PersonalizationTableComponent implements OnInit {
  columnsPreferences: string[] = ['chartNo', 'chartType', 'xaxisData', 'yaxisData', 'unit',
    'scale', 'ystepSize', 'gridlineWidth', 'backgroundColor', 'borderColor', 'fillBackground',
    'lineTension', 'pointSize', 'animations', 'pointStyle', 'lineStyle', 'addRow'];
  Element_Preferences = [];

  pref_rowData = {
    chartNo: "1", chartType: "", xaxisData: "", yaxisData: "", unit: "", scale: "", ystepSize: "", gridlineWidth: "",
    backgroundColor: "", borderColor: "", fillBackground: "", lineTension: "", pointSize: "", animations: "",
    pointStyle: "", lineStyle: "", addRow: ""
  };
  dataPreferences = new MatTableDataSource(this.Element_Preferences);
  _yaxisstepSize = null;
  _yaxisAutoskip: boolean = false;
  _xaxis_sel_line = "";
  _yaxis_sel_line = [];
  _yaxisCB_line = '';
  yaxis_data_line = [];
  _xaxis_sel_bar = "";
  _yaxis_sel_bar = [];
  _yaxisCB_bar = '';
  yaxis_data_bar = [];
  _xaxis_sel_pie = "";
  _yaxis_sel_pie = [];
  _yaxisCB_pie = '';
  yaxis_data_pie = [];
  _xaxis_sel_doughnut = "";
  _yaxis_sel_doughnut = [];
  _yaxisCB_doughnut = '';
  yaxis_data_doughnut = [];

  _backgroundColor = "rgba(34,181,306,0.2)";
  _borderColor = "rgba(44,191,206,1)";
  _fill: boolean = false;
  _borderdash = [];
  _gridlinedash = [];
  _pointstyle = "rectRot";
  _linetension = "none";
  _animations = "easeInOutQuad";
  _pointradius = "normal";
  _linestyle = "solid";
  _gridlinedash_ = true;
  lineten: number = 0;
  pointrad: number = 8;
  chartlabels = ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5"];
  _gridborder: boolean = false;
  _gridlinewidth: number = 1;
  selectedchart = [];
  personalizationtable: any = [];
  userprefs = {};
  chartposition: any = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  chartPreferences = [];
  chartno = [];
  gridlinewidth = [];
  backgroundcolor = [];
  bordercolor = [];
  fillbackground = [];
  linetension = [];
  pointradius = [];
  animations = [];
  pointstyle = [];
  linestyle = [];
  gridborder = [];
  yaxisautoskip = [];
  linexaxis = [];
  lineyaxis = [];
  barxaxis = [];
  baryaxis = [];
  piexaxis = [];
  pieyaxis = [];
  doughnutxaxis = [];
  doughnutyaxis = [];
  _selectedchart = [];
  _chartposition = [];
  charttype = [];
  xaxisdata = [];
  yaxisdata = [];
  UoM = [];
  SoM = [];
  yaxisstepSize = [];
  _personalizationtable = [];

  rowPreference = {
    gridlineWidth: "", chartno: "",
    backgroundcolor: "", bordercolor: "", fillbackground: "", linetension: "", pointradius: "", animations: "",
    pointstyle: "", linestyle: "", gridborder: "", yaxisautoskip: "", linexaxis: "", lineyaxis: "", barxaxis: "",
    baryaxis: "", piexaxis: "", pieyaxis: "", doughnutxaxis: "", doughnutyaxis: "", selectedchart: "", chartposition: "",
    charttype: "", xaxisdata: "", yaxisdata: "", UoM: "", SoM: "", personalizationtable: {}
  };
  myobj = { mychartType: "", myxaxisdata: "", myyaxisdata: "", myUoM: "", mySoM: "" }
  preservedPreferences = [];

  constructor(public report: ReportTableComponent,
    private data: ConfigServiceService,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit() {

  }
  indexTracker(index: number, value: any) {
    return index;
  }

  set_chartPreferences_arr(pref, i) {
    if (pref === 'chartno')
      this.chartPreferences[i]['chartno'] = this.chartno[i];
    if (pref === 'gridlinewidth')
      this.chartPreferences[i]['gridlinewidth'] = this.gridlinewidth[i];
    if (pref === 'backgroundcolor')
      this.chartPreferences[i]['backgroundcolor'] = this.backgroundcolor[i];
    if (pref === 'bordercolor')
      this.chartPreferences[i]['bordercolor'] = this.bordercolor[i];
    if (pref === 'fillbackground')
      this.chartPreferences[i]['fillbackground'] = this.fillbackground[i];
    if (pref === 'linetension')
      this.chartPreferences[i]['linetension'] = this.linetension[i];
    if (pref === 'pointradius')
      this.chartPreferences[i]['pointradius'] = this.pointradius[i];
    if (pref === 'animations')
      this.chartPreferences[i]['animations'] = this.animations[i];
    if (pref === 'pointstyle')
      this.chartPreferences[i]['pointstyle'] = this.pointstyle[i];
    if (pref === 'linestyle')
      this.chartPreferences[i]['linestyle'] = this.linestyle[i];
    if (pref === 'gridborder')
      this.chartPreferences[i]['gridborder'] = this.gridborder[i];
    if (pref === 'yaxisautoskip')
      this.chartPreferences[i]['yaxisautoskip'] = this.yaxisautoskip[i];
    if (pref === 'linexaxis')
      this.chartPreferences[i]['linexaxis'] = this.linexaxis[i];
    if (pref === 'lineyaxis')
      this.chartPreferences[i]['lineyaxis'] = this.lineyaxis[i];
    if (pref === 'barxaxis')
      this.chartPreferences[i]['barxaxis'] = this.barxaxis[i];
    if (pref === 'baryaxis')
      this.chartPreferences[i]['baryaxis'] = this.baryaxis[i];
    if (pref === 'piexaxis')
      this.chartPreferences[i]['piexaxis'] = this.piexaxis[i];
    if (pref === 'pieyaxis')
      this.chartPreferences[i]['pieyaxis'] = this.pieyaxis[i];
    if (pref === 'doughnutxaxis')
      this.chartPreferences[i]['doughnutxaxis'] = this.doughnutxaxis[i];
    if (pref === 'doughnutyaxis')
      this.chartPreferences[i]['doughnutyaxis'] = this.doughnutyaxis[i];
    if (pref === 'selectedchart')
      this.chartPreferences[i]['selectedchart'] = this._selectedchart[i];
    if (pref === 'chartposition')
      this.chartPreferences[i]['chartposition'] = this._chartposition[i];
    if (pref === 'charttype')
      this.chartPreferences[i]['charttype'] = this.charttype[i];
    if (pref === 'xaxisdata')
      this.chartPreferences[i]['xaxisdata'] = this.xaxisdata[i];
    if (pref === 'yaxisdata')
      this.chartPreferences[i]['yaxisdata'] = this.yaxisdata[i];
    if (pref === 'UoM')
      this.chartPreferences[i]['UoM'] = this.UoM[i];
    if (pref === 'SoM')
      this.chartPreferences[i]['SoM'] = this.SoM[i];
    if (pref === 'yaxisstepSize')
      this.chartPreferences[i]['yaxisstepSize'] = this.yaxisstepSize[i];
    if (pref === 'personalizationtable')
      this.chartPreferences[i]['personalizationtable'] = this._personalizationtable[i];
  }

  setchartpreferences(pref, val, index?) {
    var cp = [];
    for (let i = 0; i < this.chartposition.length; i++) {
      cp.push(Object.values(this.chartposition[i]));
    }
    cp = [].concat.apply([], cp);
    console.log(cp);
    if (pref === 'all') {
      this.userprefs['backgroundcolor'] = this._backgroundColor;
      this.userprefs['bordercolor'] = this._borderColor;
      this.userprefs['fill'] = this._fill.toString().toLocaleUpperCase();
      this.userprefs['pointstyle'] = this._pointstyle;
      this.userprefs['linetension'] = this._linetension;
      this.userprefs['animations'] = this._animations;
      this.userprefs['pointradius'] = this._pointradius;
      this.userprefs['linestyle'] = this._linestyle;
      this.userprefs['gridlinedashed'] = this._gridborder.toString().toLocaleUpperCase();
      this.userprefs['linewidth'] = this._gridlinewidth;
      this.userprefs['yautoskip'] = this._yaxisAutoskip.toString().toLocaleUpperCase();
      this.userprefs['linexaxis'] = this._xaxis_sel_line;
      this.userprefs['lineyaxis'] = this._yaxis_sel_line;
      this.userprefs['barxaxis'] = this._xaxis_sel_bar;
      this.userprefs['baryaxis'] = this._yaxis_sel_bar;
      this.userprefs['piexaxis'] = this._xaxis_sel_pie;
      this.userprefs['pieyaxis'] = this._yaxis_sel_pie;
      this.userprefs['doughnutxaxis'] = this._xaxis_sel_doughnut;
      this.userprefs['doughnutyaxis'] = this._yaxis_sel_doughnut;
      this.userprefs['selectedchart'] = this.selectedchart;
      this.userprefs['personalizationtable'] = this.personalizationtable;
      this.userprefs['chartposition'] = cp;
      console.log(this.userprefs);
      this.report.V_PRF_NM = Object.keys(this.userprefs);
      this.report.V_PRF_VAL = Object.values(this.userprefs);
      for (let j = 0; j < this.report.V_PRF_NM.length; j++) {
        this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, this.report.V_PRF_NM[j], this.report.V_PRF_VAL[j]).subscribe(
          () => {

          });
      }
    }
    else {
      /*for(let i = 0; i < this.chartPreferences.length; i++){
        if(i!==index){
          this.chartPreferences[i] = this.preservedPreferences[i];
        }
      }*/
      //console.log(this.preservedPreferences);

      //this.preservedPreferences = this.chartPreferences;
      
      if (pref === "personalizationtable") {
        this.set_chartPreferences_arr('charttype',index);
        this.set_chartPreferences_arr('xaxisdata',index);
        this.set_chartPreferences_arr('yaxisdata',index);
        this.set_chartPreferences_arr('UoM',index);
        this.set_chartPreferences_arr('SoM',index);
        this.chartPreferences[index][pref]['charttype'] = this.chartPreferences[index]['charttype'];
        this.chartPreferences[index][pref]['xaxisdata'] = this.chartPreferences[index]['xaxisdata'];
        this.chartPreferences[index][pref]['yaxisdata'] = this.chartPreferences[index]['yaxisdata'];
        this.chartPreferences[index][pref]['UoM'] = this.chartPreferences[index]['UoM'];
        this.chartPreferences[index][pref]['SoM'] = this.chartPreferences[index]['SoM'];
      } else{
        this.set_chartPreferences_arr(pref,index);
        console.log(pref+":"+index);
      }
      console.log(val);
      this.chartPreferences[index][pref]=val;
      console.log(this.chartPreferences);
      /*this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, pref, val).subscribe(
        () => {

        });*/
    }

  }
  updateBarChart() {
    this.report.updateBarChart();
  }
  updateLineChart() {
    this.report.updateLineChart();
  }
  updateDoughnutChart() {
    this.report.updateDoughnutChart();
  }
  updatePieChart() {
    this.report.updatePieChart();
  }
  updateChart() {
    this.report.updatechart();
  }

  addRow_action() {
    this.chartno.push(this.chartno.length);
    this.gridlinewidth.push("");
    this.backgroundcolor.push("");
    this.bordercolor.push("");
    this.fillbackground.push("");
    this.linetension.push("");
    this.pointradius.push("");
    this.animations.push("");
    this.pointstyle.push("");
    this.linestyle.push("");
    this.gridborder.push("");
    this.yaxisautoskip.push("");
    this.linexaxis.push("");
    this.lineyaxis.push("");
    this.barxaxis.push("");
    this.baryaxis.push("");
    this.piexaxis.push("");
    this.pieyaxis.push("");
    this.doughnutxaxis.push("");
    this.doughnutyaxis.push("");
    this._selectedchart.push("");
    this._chartposition.push("");
    this.charttype.push("");
    this.xaxisdata.push("");
    this.yaxisdata.push("");
    this.UoM.push("");
    this.SoM.push("");
    this.yaxisstepSize.push("");
    this.chartPreferences.push({
      gridlineWidth: "", chartno: "",
      backgroundcolor: "", bordercolor: "", fillbackground: "", linetension: "", pointradius: "", animations: "",
      pointstyle: "", linestyle: "", gridborder: "", yaxisautoskip: "", linexaxis: "", lineyaxis: "", barxaxis: "",
      baryaxis: "", piexaxis: "", pieyaxis: "", doughnutxaxis: "", doughnutyaxis: "", selectedchart: "", chartposition: "",
      charttype: "", xaxisdata: "", yaxisdata: "", UoM: "", SoM: "", personalizationtable: {}
    });
    console.log(this.chartPreferences);
  }

  deleteRow_action(chartNo) {
    this.Element_Preferences.pop();
    console.log(chartNo);
    //this.chartPreferences.splice(chartNo,1);
    //---data move up
    this.dataPreferences = new MatTableDataSource(this.Element_Preferences);
  }

  updatecustoms() {
    var test = 0;

    if (this.personalizationtable != undefined && (this.myobj.mychartType != "" || this.myobj.myxaxisdata != "" || this.myobj.myyaxisdata != "")) {
      for (let i = 0; i < this.personalizationtable.length; i++) {
        if ((this.myobj.mychartType != this.personalizationtable[i].chartType ||
          this.myobj.myxaxisdata != this.personalizationtable[i].xaxisdata ||
          this.myobj.myyaxisdata != this.personalizationtable[i].yaxisdata)) {
          test = 0;
        }
        else {
          test = 1;
        }
      }
    }
    else {
      test = 1;
    }
    if (test == 0) {
      var obj = {
        chartType: this.myobj.mychartType,
        xaxisdata: this.myobj.myxaxisdata,
        yaxisdata: this.myobj.myyaxisdata,
        UoM: this.myobj.myUoM,
        SoM: this.myobj.mySoM,
      }
      this.personalizationtable.push(obj);
      this.chartPreferences['xaxisdata'] = '';
      this.chartPreferences['yaxisdata'] = [];
      switch (obj.chartType) {
        case "linechart":
          this.report.linearray.push(obj);
          this._yaxis_sel_line.push(obj.yaxisdata);
          this.chartPreferences['yaxisdata'].push(obj.yaxisdata);
          this._xaxis_sel_line = obj.xaxisdata;
          this.updateLineChart();
          break;
        case "barchart":
          this.report.bararray.push(obj);
          this._yaxis_sel_bar.push(obj.yaxisdata);
          this._xaxis_sel_bar = obj.xaxisdata;
          this.updateBarChart();
          break;
        case "piechart":
          this.report.piearray.push(obj);
          this._yaxis_sel_pie.push(obj.yaxisdata);
          this._xaxis_sel_pie = obj.xaxisdata;
          this.updatePieChart();
          break;
        case "doughnutchart":
          this.report.doughnutarray.push(obj);
          this._yaxis_sel_doughnut.push(obj.yaxisdata);
          this._xaxis_sel_doughnut = obj.xaxisdata;
          this.updateDoughnutChart();
          break;
      }
      this.setchartpreferences('all','nothing');
    }
    else {
      this._snackBar.open("Data already exist in table", 'Ok', {
        duration: 2000
      });
    }
  }
}
