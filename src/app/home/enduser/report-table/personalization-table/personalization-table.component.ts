import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportTableComponent } from '../report-table.component';
import { ConfigServiceService } from '../../../../services/config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isFulfilled } from 'q';
import { data } from 'src/app/home/useradmin/authorize/authorize.component';

@Component({
  selector: 'personalization-table',
  templateUrl: './personalization-table.component.html',
  styleUrls: ['./personalization-table.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  UoM_x = [];
  SoM_x = [];
  UoM_y = [];
  SoM_y = [];
  xaxisstepSize = [];
  yaxisstepSize = [];
  _personalizationtable = [];
  yaxiscallbacks = ['$', '£', '€', '₹', 'm', 'km', 'k', 'gm', 'kg', 's'];
  xaxis_datasets = [];
  yaxis_datasets = [];

  rowPreference = {
    gridlinewidth: "", chartno: "",
    backgroundcolor: "", bordercolor: "", fillbackground: "", linetension: "", pointradius: "", animations: "",
    pointstyle: "", linestyle: "", gridborder: "", yaxisautoskip: "", selectedchart: "", chartposition: "",
    xaxisdata: "", yaxisdata: "", UoM_x: "", UoM_y: "", SoM_x: "", SoM_y: "", xaxisstepsize: "", yaxisstepsize: "", personalizationtable: {}
  };
  myobj = { mychartType: "", myxaxisdata: "", myyaxisdata: "", myUoM: "", mySoM: "" }
  preservedPreferences = [];

  constructor(public report: ReportTableComponent,
    public data: ConfigServiceService,
    public _snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.getChartPreferences();
  }

  indexTracker(index: number, value: any) {
    return index;
  }

  getChartPreferences() {
    this.data.getchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID).subscribe(
      res => {
        console.log('chartpreferences = >');
        console.log(res.json());
      });
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
    if (pref === 'UoM_x')
      this.chartPreferences[i]['UoM_x'] = this.UoM_x[i];
    if (pref === 'UoM_y')
      this.chartPreferences[i]['UoM_y'] = this.UoM_y[i];
    if (pref === 'SoM_x')
      this.chartPreferences[i]['SoM_x'] = this.SoM_x[i];
    if (pref === 'SoM_y')
      this.chartPreferences[i]['SoM_y'] = this.SoM_y[i];
    if (pref === 'xaxisstepSize')
      this.chartPreferences[i]['xaxisstepSize'] = this.xaxisstepSize[i];
    if (pref === 'yaxisstepSize')
      this.chartPreferences[i]['yaxisstepSize'] = this.yaxisstepSize[i];
    if (pref === 'personalizationtable')
      this.chartPreferences[i]['personalizationtable'] = this._personalizationtable[i];
  }

  populateRow(index) {
    var fieldKeys = Object.keys(this.data.chartPreferences[index]);
    for (let i = 0; i < fieldKeys.length; i++) {
      var field = fieldKeys[i];
      console.log((<HTMLElement>document.querySelectorAll('#' + field + ' ' + '.table-cell')[index]));
    }
    (<HTMLElement>document.querySelectorAll("mat-list")[2])
  }

  setchartpreferences(pref, val, index?) {

    /*var cp = [];
    for (let i = 0; i < this.chartposition.length; i++) {
      cp.push(Object.values(this.chartposition[i]));
    }
    cp = [].concat.apply([], cp);
    console.log(cp);*/

    console.log(val);
    this.chartPreferences[index][pref] = val;
    console.log(this.chartPreferences);
    if (pref === "chartno") {
      var chartFound = false;
      var foundIndex;
      console.log(chartFound);
      for (let i = 0; i < this.chartPreferences.length; i++) {
        if (i !== index && val === this.chartPreferences[i]['chartno']) {
          chartFound = true;
          foundIndex = i;
          break;
        }
      }
      if (chartFound) {
        this.chartPreferences[index] = this.chartPreferences[foundIndex];
        //console.log(foundIndex);
        //console.log(this.chartPreferences[foundIndex]);
        this.populateRow(index);
        //update the values in the row
      }
    }
    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = index;
    this.data.chartSelection['update'] = true;
    this.data.chartSelection['selection'] = pref;
    this.data.chartPreferencesChange.next(this.data.chartPreferences);

    /*this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, pref+'_'+index, this.chartPreferences[index][pref]).subscribe(
      (res) => {
        console.log(res.json());
      });*/


    /*this.userprefs['backgroundcolor'] = this._backgroundColor;
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
    this.report.V_PRF_VAL = Object.values(this.userprefs);*/
  }

  addRow_action() {
    this.chartno.push(this.chartno.length + 1);
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
    this.UoM_x.push("");
    this.UoM_y.push("");
    this.SoM_x.push("");
    this.SoM_y.push("");
    this.xaxisstepSize.push("");
    this.yaxisstepSize.push("");
    this.chartPreferences.push({
      gridlinewidth: "", chartno: this.chartno.length,
      backgroundcolor: "", bordercolor: "", fillbackground: false, linetension: "", pointradius: "", animations: "",
      pointstyle: "rectRot", linestyle: "", gridborder: "", yaxisautoskip: "", selectedchart: "", chartposition: "",
      xaxisdata: "", yaxisdata: "", UoM_x: "", UoM_y: "", SoM_x: "", SoM_y: "", xaxisstepsize: "", yaxisstepsize: "", personalizationtable: {}
    });
    this.data.chartposition.push({ x: 0, y: 0 });

    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = this.chartno.length;
    this.data.chartSelection['update'] = false;
    this.data.chartPreferencesChange.next(this.data.chartPreferences);

    /*this.data.deletepreferencerow(this.report.UNIQUE_ID, this.report.SRC_ID, '0').subscribe(
      (res) => {
        console.log(res.json());
      });*/
    //this.initializeChartPreferences(this.data.chartPreferences.length - 1);
  }

  initializeChartPreferences(index) {
    var V_PRF_NM = Object.keys(this.data.chartPreferences[index]);
    
    for (let i = 0; i < V_PRF_NM.length; i++) {
      this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, V_PRF_NM[i]+'_'+index, this.chartPreferences[index][V_PRF_NM[i]]).subscribe(
        (res) => {
          console.log(res.json());
        });
    }
  }

  deleteRow_action(chartNo) {
    this.Element_Preferences.pop();
    console.log(chartNo);
    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = chartNo;
    this.data.chartSelection['update'] = false;
    this.data.chartPreferencesChange.next(this.data.chartPreferences);
    //this.chartPreferences.splice(chartNo,1);
    //---data move up
    this.dataPreferences = new MatTableDataSource(this.Element_Preferences);
  }
}
