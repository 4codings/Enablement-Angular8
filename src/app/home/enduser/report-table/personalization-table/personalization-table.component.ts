import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportTableComponent } from '../report-table.component';
import { ConfigServiceService } from '../../../../services/config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isFulfilled } from 'q';
import { data } from 'src/app/home/useradmin/authorize/authorize.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'personalization-table',
  templateUrl: './personalization-table.component.html',
  styleUrls: ['./personalization-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalizationTableComponent implements OnInit, AfterViewInit {
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
  annotation = [];
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
    backgroundcolor: "", bordercolor: "", fillbackground: "", linetension: "", pointradius: "", animations: "", chartwidth: "100", chartheight: "100",
    pointstyle: "", linestyle: "", gridborder: "", yaxisautoskip: "", annotation: "", selectedchart: "", chartposition: "",
    xaxisdata: "", yaxisdata: "", UoM_x: "", UoM_y: "", SoM_x: "", SoM_y: "", xaxisstepsize: "", yaxisstepsize: "", personalizationtable: {}
  };
  myobj = { mychartType: "", myxaxisdata: "", myyaxisdata: "", myUoM: "", mySoM: "" }
  preservedPreferences = [];

  constructor(public report: ReportTableComponent,
    public data: ConfigServiceService,
    public _snackBar: MatSnackBar,
    private fbuilder: FormBuilder) {

  }

  ngOnInit() {
    //this.data.deletepreferencerow(this.report.UNIQUE_ID,this.report.SRC_ID,'-1').subscribe((res)=>{});
    //this.data.deletepreferencerow(this.report.UNIQUE_ID,this.report.SRC_ID,'2').subscribe((res)=>{});
    this.xaxis_datasets = this.yaxis_datasets = this.report.columnsToDisplay;
    this.data.chartPreferences = [];
    this.chartPreferences = [];
    this.data.chart_status = "not-rendered";
    this.data.position_status = "not-received";
  }
  ngAfterViewInit() {
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
        var cpref = res.json();
        this.restore_styling(cpref);
      });
  }

  restore_position(cpref) {
    var itm_set = new Set();
    for (let i = 0; i < cpref['ITM_ID'].length; i++) {
      if (cpref['ITM_ID'][i] !== '-1')
        itm_set.add(cpref['ITM_ID'][i]);
    }
    var itm_arr = [];
    if (itm_set.size > 0) {
      itm_arr = Array.from(itm_set);
    }
    for (let i = 0; i < itm_arr.length; i++) {
      if (this.data.chartPreferences[i]['chartposition'].length === 0) {
        this.data.chartposition[i].x = 0;
        this.data.chartposition[i].y = 0;
      } else {
        this.data.chartposition[i] = JSON.parse(this.data.chartPreferences[i]['chartposition']);
      }
      this.data.chart_translate[i] = 'translate3d('+this.data.chartposition[i].x +'px, '+this.data.chartposition[i].y+'px, 0px'+')';
    }
    this.data.position_status = "received";
    this.data.positionstatus_changed.next(this.data.position_status);
  }

  restore_styling(cpref) {
    var itm_set = new Set();
    for (let i = 0; i < cpref['ITM_ID'].length; i++) {
      if (cpref['ITM_ID'][i] !== '-1')
        itm_set.add(cpref['ITM_ID'][i]);
    }
    var itm_arr = [];
    if (itm_set.size > 0) {
      itm_arr = Array.from(itm_set);
    }
    for (let i = 0; i < itm_arr.length; i++) {
      this.addRow_action(itm_arr[i]);
      for (let j = 0; j < cpref['PRF_NM'].length; j++) {
        if (cpref['PRF_NM'][j] !== 'chartno' && cpref['ITM_ID'][j] === itm_arr[i]) {
          this.chartPreferences[i][cpref['PRF_NM'][j]] = cpref['PRF_VAL'][j];
          this.data.chartPreferences[i][cpref['PRF_NM'][j]] = cpref['PRF_VAL'][j];
          this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
          this.data.chartSelection['chartNo'] = i;
          this.data.chartSelection['update'] = true;
          this.data.chartSelection['selection'] = cpref['PRF_NM'][j];
          this.data.chartPreferencesChange.next(this.data.chartPreferences);
        }
      }
      this.populateRow(i, i);
      console.log(this.data.chartPreferences[i]);
    }
    this.restore_position(cpref);
  }

  restore_charts(cpref) {

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

  populateRow(index, foundIndex) {
    console.log('inside populaterow');
    if(this.data.chartPreferences[foundIndex]['chartposition'].length>0){
      this.data.chartposition[index] = this.data.chartPreferences[foundIndex]['chartposition'];
    }
    this.data.width[index] = 6*this.data.chartPreferences[foundIndex]['chartwidth'];
    this.data.height[index] = 4*this.data.chartPreferences[foundIndex]['chartheight'];
    this._selectedchart[index] = this.data.chartPreferences[foundIndex]['selectedchart'];
    this.gridlinewidth[index] = this.data.chartPreferences[foundIndex]['gridlinewidth']
    this.backgroundcolor[index] = this.data.chartPreferences[foundIndex]['backgroundcolor']
    this.bordercolor[index] = this.data.chartPreferences[foundIndex]['bordercolor']
    this.fillbackground[index] = this.data.chartPreferences[foundIndex]['fillbackground']
    this.linetension[index] = this.data.chartPreferences[foundIndex]['linetension']
    this.pointradius[index] = this.data.chartPreferences[foundIndex]['pointradius']
    this.animations[index] = this.data.chartPreferences[foundIndex]['animations']
    this.pointstyle[index] = this.data.chartPreferences[foundIndex]['pointstyle']
    this.linestyle[index] = this.data.chartPreferences[foundIndex]['linestyle']
    this.gridborder[index] = this.data.chartPreferences[foundIndex]['gridborder']
    this.yaxisautoskip[index] = this.data.chartPreferences[foundIndex]['yaxisautoskip']
    this.annotation[index] = this.data.chartPreferences[foundIndex]['annotation']
    this.xaxisdata[index] = this.data.chartPreferences[foundIndex]['xaxisdata']
    this.yaxisdata[index] = this.data.chartPreferences[foundIndex]['yaxisdata']
    this.UoM_x[index] = this.data.chartPreferences[foundIndex]['UoM_x']
    this.UoM_y[index] = this.data.chartPreferences[foundIndex]['UoM_y']
    this.SoM_x[index] = this.data.chartPreferences[foundIndex]['SoM_x']
    this.SoM_y[index] = this.data.chartPreferences[foundIndex]['SoM_y']
    this.xaxisstepSize[index] = this.data.chartPreferences[foundIndex]['xaxisstepsize']
    this.yaxisstepSize[index] = this.data.chartPreferences[foundIndex]['yaxisstepsize']
  }

  set_domProperty(event) {
    console.log(event.source._elementRef.nativeElement);
  }

  setchartpreferences(pref, val, index?) {
    console.log(val);
    this.chartPreferences[index][pref] = val;
    for (let i = 0; i < this.chartPreferences.length; i++) {
      console.log(this.chartPreferences[i]);
    }
    this.data.chartPreferences = this.chartPreferences;
    if (this.chartPreferences[index]['chartno'] !== '' && this.chartPreferences[index]['chartno'] !== null) {
      var chartFound = false;
      var foundIndex = 0;
      console.log(chartFound);
      var checkcno = this.data.chartPreferences[index]['chartno'];
      if (pref === 'chartno')
        checkcno = val;
      for (let i = 0; i < this.chartPreferences.length; i++) {
        if (i !== index && checkcno === this.chartPreferences[i]['chartno']) {
          chartFound = true;
          foundIndex = i;
          break;
        }
      }
      for (let i = 0; i < this.chartPreferences.length; i++) {
        console.log(this.chartPreferences[i]);
      }
      if (chartFound) {
        console.log('match found');

        if (pref === 'chartno') {
          this.chartPreferences[index] = this.chartPreferences[foundIndex];
          this.populateRow(index, foundIndex);
        }
        else {
          this.chartPreferences[foundIndex] = this.chartPreferences[index];
          this.populateRow(foundIndex, index);
        }

      }
      for (let i = 0; i < this.chartPreferences.length; i++) {
        console.log(this.chartPreferences[i]);
      }
    }
    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = index;
    this.data.chartSelection['update'] = true;
    this.data.chartSelection['selection'] = pref;
    this.data.chartPreferencesChange.next(this.data.chartPreferences);

    var checkcno = this.data.chartPreferences[index]['chartno'];

    this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, checkcno, pref, this.chartPreferences[index][pref]).subscribe(
      (res) => {
        console.log(res.json());
      });
  }


  addRow_action(option) {
    if (option === 'init') {
      if (this.chartno.length > 0) {
        this.chartno.push(this.chartno[this.chartno.length - 1] + 1);
      } else {
        this.chartno.push(this.chartno.length + 1);
      }
    } else {
      this.chartno.push(parseInt(option));
    }
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
    this.annotation.push("");
    this.data.width.push(600);
    this.data.height.push(400);
    this.chartPreferences.push({
      gridlinewidth: "", chartno: this.chartno[this.chartno.length - 1],
      backgroundcolor: "", bordercolor: "", fillbackground: false, linetension: "", pointradius: "", animations: "", chartwidth: "100", chartheight: "100",
      pointstyle: "rectRot", linestyle: "", gridborder: "", yaxisautoskip: "", annotation: "", selectedchart: "", chartposition: "",
      xaxisdata: "", yaxisdata: "", UoM_x: "", UoM_y: "", SoM_x: "", SoM_y: "", xaxisstepsize: "", yaxisstepsize: "", personalizationtable: {}
    });
    this.data.chartposition.push({ x: 0, y: 0 });

    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = this.chartno.length;
    this.data.chartSelection['update'] = false;
    this.data.chartPreferencesChange.next(this.data.chartPreferences);

    if (option === 'init')
      this.initializeChartPreferences(this.chartPreferences.length - 1);
  }

  initializeChartPreferences(index) {
    var V_PRF_NM = Object.keys(this.data.chartPreferences[index]);

    for (let i = 0; i < V_PRF_NM.length; i++) {
      this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, this.chartPreferences[index]['chartno'], V_PRF_NM[i], this.chartPreferences[index][V_PRF_NM[i]]).subscribe(
        (res) => {

        });
    }
  }

  deleteRow_action(chartNo) {
    /*for(let i=this.chartPreferences.length-1;i>chartNo;i--){
      this.chartPreferences[i] = this.chartPreferences[i-1];
    }*/
    this.data.deletepreferencerow(this.report.UNIQUE_ID, this.report.SRC_ID, this.chartPreferences[chartNo]['chartno']).subscribe((res) => {
      console.log(res.json());
    });
    this.chartPreferences.splice(chartNo, 1);
    console.log(chartNo);
    this.chartno.splice(chartNo, 1);
    this.gridlinewidth.splice(chartNo, 1);
    this.backgroundcolor.splice(chartNo, 1);
    this.bordercolor.splice(chartNo, 1);
    this.fillbackground.splice(chartNo, 1);
    this.linetension.splice(chartNo, 1);
    this.pointradius.splice(chartNo, 1);
    this.animations.splice(chartNo, 1);
    this.pointstyle.splice(chartNo, 1);
    this.linestyle.splice(chartNo, 1);
    this.gridborder.splice(chartNo, 1);
    this.yaxisautoskip.splice(chartNo, 1);
    this.linexaxis.splice(chartNo, 1);
    this.lineyaxis.splice(chartNo, 1);
    this.barxaxis.splice(chartNo, 1);
    this.baryaxis.splice(chartNo, 1);
    this.piexaxis.splice(chartNo, 1);
    this.pieyaxis.splice(chartNo, 1);
    this.doughnutxaxis.splice(chartNo, 1);
    this.doughnutyaxis.splice(chartNo, 1);
    this._selectedchart.splice(chartNo, 1);
    this._chartposition.splice(chartNo, 1);
    this.charttype.splice(chartNo, 1);
    this.xaxisdata.splice(chartNo, 1);
    this.yaxisdata.splice(chartNo, 1);
    this.UoM_x.splice(chartNo, 1);
    this.UoM_y.splice(chartNo, 1);
    this.SoM_x.splice(chartNo, 1);
    this.SoM_y.splice(chartNo, 1);
    this.annotation.splice(chartNo, 1);
    this.xaxisstepSize.splice(chartNo, 1);
    this.yaxisstepSize.splice(chartNo, 1);

    this.data.chartPreferences = this.chartPreferences;
    this.data.chartSelection['chartPreferences'] = this.data.chartPreferences;
    this.data.chartSelection['chartNo'] = chartNo;
    this.data.chartSelection['update'] = false;

    for (let i = 0; i < this.data.chartPreferences.length; i++) {
      this.populateRow(i, i);
    }

    this.data.chartPreferencesChange.next(this.data.chartPreferences);


  }
}
