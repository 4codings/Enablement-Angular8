import { Component, OnInit } from '@angular/core';
import { PersonalizationTableComponent } from '../personalization-table/personalization-table.component';
import { ReportTableComponent } from '../report-table.component';
import { ConfigServiceService } from '../../../../services/config-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor(public report: ReportTableComponent,
    public data: ConfigServiceService,
    public _snackBar: MatSnackBar) {

  }

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
  chartcolors = [{
    backgroundColor: this._backgroundColor,
    borderColor: this._borderColor,
    pointBackgroundColor: this._borderColor,
    pointBorderColor: '#fff',
    pointHoverBorderColor: this._borderColor,
    pointHoverBackgroundColor: '#fff',
  },
  {
    backgroundColor: "rgba(154,67,208,0.48)",
    borderColor: "violet",
    pointBackgroundColor: "rgba(154,67,208,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "violet",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,0,0,0.48)",
    borderColor: "red",
    pointBackgroundColor: "rgba(255,0,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "red",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,255,0,0.48)",
    borderColor: "yellow",
    pointBackgroundColor: "rgba(255,255,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "yellow",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(0,128,0,0.48)",
    borderColor: "green",
    pointBackgroundColor: "rgba(0,128,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "green",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,165,0,0.48)",
    borderColor: "orange",
    pointBackgroundColor: "rgba(255,165,0,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "orange",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(255,127,80,0.48)",
    borderColor: "coral",
    pointBackgroundColor: "rgba(255,127,80,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "coral",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(112, 128, 144,0.48)",
    borderColor: "slategrey",
    pointBackgroundColor: "rgba(112, 128, 144,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "slategrey",
    pointHoverBackgroundColor: '#fff'
  },
  {
    backgroundColor: "rgba(106,90,205,0.48)",
    borderColor: "slateblue",
    pointBackgroundColor: "rgba(106,90,205,0.48)",
    pointBorderColor: '#fff',
    pointHoverBorderColor: "slateblue",
    pointHoverBackgroundColor: '#fff'
  }];
  linedata = [{
    data: [10, 25, 31, 19, 42],
    label: ["Sample Dataset"],
    fill: false,
    borderDash: [],
    pointRadius: 6,
    pointStyle: 'rectRot',
    yAxisID: "y-1"
  }];
  bardata = [{ data: [10, 20, 30, 40, 50], label: ["Sample Dataset"] }];
  piedata = [{ data: [10, 20, 30, 40, 50], labels: ["Sample Dataset"] }];
  doughnutdata = [{ data: [10, 20, 30, 40, 50], labels: ["Sample Dataset"] }];
  // Line Chart Configuration
  public lineChartColors = this.chartcolors;
  public lineChartData: Array<any> = this.linedata;
  public lineChartLabels: Array<any> = this.chartlabels;
  public lineChartType: string = 'line';
  public lineChartOptions: any;
  public lineChartPlugins = [pluginAnnotations];
  // Bar Chart Configuration
  public barChartOptions: any;
  public barChartLabels: string[] = this.chartlabels;
  public barChartType: string = 'bar';
  public barChartData: Array<any> = this.bardata;
  public barChartColors = this.chartcolors;

  // Pie Chart Configuration
  public pieChartLabels: string[] = this.chartlabels;
  public pieChartData: Array<any> = this.piedata;
  public pieChartType: string = 'pie';
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)',
        'rgba(255,255,0,0.3)', 'rgba(0,255,255,0.3)', 'rgba(255,0,255,0.3)',
        'rgba(155,0,155,0.3)', 'rgba(155,155,0,0.3)']
    },
  ];

  // Doughnut Chart Configuration
  public doughnutChartLabels: string[] = this.chartlabels;
  public doughnutChartData: Array<any> = this.doughnutdata;
  public doughnutChartType: string = 'doughnut';
  chartPreferences = [];
  personalizationtable: any = [];
  UNIQUE_ID = "";
  SRC_ID = "";
  V_PRF_NM = [];
  V_PRF_VAL = [];
  userprefs = {};
  columnsToDisplay = [];
  hiddencols: string[] = [];
  show_choice = "Table";
  dispchart: boolean;
  disptable: boolean;
  _xaxis_sel_doughnut = "";
  _yaxisAutoskip: boolean = false;
  _yaxisstepSize = null;
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
  _yaxis_sel_doughnut = [];
  _yaxisCB_doughnut = '';
  yaxis_data_doughnut = [];
  yaxis_data = [];
  xaxis_data = [];
  myobj = { mychartType: "", myxaxisdata: "", myyaxisdata: "", myUoM: "", mySoM: "" }
  linearray: any = [];
  bararray: any = [];
  piearray: any = [];
  doughnutarray: any = [];
  chartarray: any = [];
  subscription: any;
  chartData: any = [];
  chartLabels: any = [];
  chartOptions: any = [];
  lastPrefernce: any = [];
  ngOnInit() {
    this.subscription = this.data.chartPreferencesChange
      .subscribe(value => {
        console.log(value);
        if (this.lastPrefernce.length < this.data.chartPreferences.length) {
          this.chartData.push([]);
          this.chartLabels.push([]);
          this.chartOptions.push(null);
        } else {

        }
        if (value != [] && this.data.chartSelection['update'] === true && this.data.chartSelection['chartNo'] !== '')
          this.updatechart(this.data.chartSelection['chartNo'], this.data.chartPreferences[this.data.chartSelection['chartNo']]['selectedchart']);
        this.lastPrefernce = this.data.chartPreferences;
      });
    console.log(this.chartPreferences);
    this.UNIQUE_ID = this.report.UNIQUE_ID;
    this.SRC_ID = this.report.SRC_ID;
    this.columnsToDisplay = this.report.columnsToDisplay;
    console.log(this.data.ReportTable_data);
  }

  printcpref() {
    console.log(this.data.chartPreferences);
  }

  dragEndChart(event, i) {
    var offset = { ...(<any>event.source._dragRef)._passiveTransform };
    this.data.chartposition[i] = offset;
    //console.log(this.data.chartposition[i]);
    this.data.chartPreferences[i]['chartposition'] = JSON.stringify(this.data.chartposition[i]);
    console.log(this.data.chartPreferences);
    /*this.data.setchartstyling(this.report.UNIQUE_ID, this.report.SRC_ID, 'chartposition'+'_'+i, this.data.chartPreferences[i]['chartposition']).subscribe(
      (res) => {
        console.log(res.json());
      });*/
  }

  updateLineChart(chartNo) {
    this.updatecustoms(chartNo);
    var unit = this.data.chartPreferences[chartNo]['UoM_y'];
    var scale = this.data.chartPreferences[chartNo]['SoM_y'];

    var yaxis_data_line = [];
    var lineten = 0;
    var yaxisdata = ['Not provided'];
    if (this.yaxis_data[chartNo] !== undefined) {
      yaxisdata[0] = this.yaxis_data[chartNo][0];
    }
    var xaxisdata = 'Not Provided';
    if (this.xaxis_data[chartNo] !== undefined) {
      xaxisdata = this.xaxis_data[chartNo];
    }
    switch (this.data.chartPreferences[chartNo]['linetension']) {
      case 'none': lineten = 0;
        break;
      case 'mild': lineten = 0.2;
        break;
      case 'full': lineten = 0.5;
        break;
      default: lineten = 0;
        break;
    }
    var pointrad = 6;
    switch (this.data.chartPreferences[chartNo]['pointradius']) {
      case 'small': pointrad = 6;
        break;
      case 'normal': pointrad = 8;
        break;
      case 'large': pointrad = 10;
        break;
      default: pointrad = 6;
        break;
    }
    var borderdash = [];
    var gridlinedash = [];
    this.data.chartPreferences[chartNo]['linestyle'] == "dashed" ? borderdash = [5, 5] : borderdash = [];
    this.data.chartPreferences[chartNo]['gridborder'] == true ? gridlinedash = [10, 10] : gridlinedash = [];

    this.xaxis_data[chartNo] != "" ? this.chartLabels[chartNo] = this.data.ReportTable_data[this.xaxis_data[chartNo]]
      : this.chartLabels[chartNo] = this.chartlabels;

    if (this.yaxis_data[chartNo] != [] && this.yaxis_data[chartNo] != undefined && this.data.chartSelection['selection'] !== 'selectedchart') {
      for (let i = 0; i < this.yaxis_data[chartNo].length; i++) {
        yaxis_data_line[i] = this.data.ReportTable_data[this.yaxis_data[chartNo][i]].map(Number);
        this.chartData[chartNo][i] = {
          label: [this.yaxis_data[chartNo][i]],
          fill: this.data.chartPreferences[chartNo]['fillbackground'],
          borderDash: borderdash,
          pointRadius: pointrad,
          pointStyle: this.data.chartPreferences[chartNo]['pointstyle'],
          data: yaxis_data_line[i],
          yAxisID: "y-".concat((i + 1).toString())
        }
      }
      console.log(this.chartData[chartNo]);
    }
    else {
      this.chartData[chartNo] = this.linedata;
    }
    console.log(this.chartData[chartNo]);
    this.chartOptions[chartNo] = {
      responsive: true,
      stacked: false,
      hoverMode: 'index',
      // plugins:{
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: [{
          type: 'line',
          drawTime: 'afterDraw',
          mode: 'vertical',
          scaleID: 'x-1',
          value: '10',
          borderColor: 'green',
          borderWidth: 1,
          label: {
            enabled: true,
            position: "center",
            content: "Hey"
          }
        }]
      }
      // }
      ,
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      elements:
      {
        point: {
          pointStyle: this.data.chartPreferences[chartNo]['pointstyle']
        },
        line: { tension: lineten },
        animation: {
          duration: 4000,
          easing: this.data.chartPreferences[chartNo]['animations']
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            if (unit == "₹" || unit == "$" || unit == "€" || unit == "£")
              return (unit + " " + tooltipItems.yLabel.toString());
            else
              return (tooltipItems.yLabel.toString() + " " + unit);
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
          id: 'x-1',
          scaleLabel: {
            display: true,
            labelString: xaxisdata
          },
          display: true
        }],
        yAxes: Array<any>()
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        enabled: true,
        mode: 'xy',
        speed: 0.1
      }
    };
    //for (let i = 0; i < this.chartData[chartNo].length; i++) {
    //if (i == 0) {
    this.chartOptions[chartNo].scales.yAxes[0] = {
      position: 'left',
      type: 'linear',
      display: true,
      id: 'y-1',
      scaleLabel: {
        display: true,
        labelString: yaxisdata[0],
        fontColor: this.lineChartColors[0].borderColor
      },
      gridLines: {
        drawOnChartAdrawBorder: false,
        borderDash: gridlinedash,
        lineWidth: this.data.chartPreferences[chartNo]['gridlinewidth']
      },
      ticks: {
        fontColor: this.lineChartColors[0].borderColor,
        stepSize: this.data.chartPreferences[chartNo]['yaxisstepsize'],
        autoSkip: this.data.chartPreferences[chartNo]['yaxisautoskip'],
        beginAtZero: true,
        callback: function (label) {
          return unit + " " + label / scale;
        }
      }
    };
    //}
    /*if (i > 0) {
      this.chartOptions[chartNo].scales.yAxes.push({
        position: 'right',
        type: 'linear',
        display: true,
        id: "y-".concat((i + 1).toString()),
        scaleLabel: {
          display: true,
          labelString: this.yaxis_data[chartNo][i],
          fontColor: this.lineChartColors[i].borderColor
        },
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          fontColor: this.lineChartColors[i].borderColor,
          stepSize: this.data.chartPreferences[chartNo]['yaxisstepsize'],
          autoSkip: this.data.chartPreferences[chartNo]['yaxisautoskip'],
          beginAtZero: true,
          callback: function (label) {
            if (label > 1000) {
              return unit + " " + label / 1000 + " k";
            }
            else {
              return unit + " " + label;
            }
          }
        }
      });
    }*/
    //}
  }
  updateBarChart(chartNo) {
    //var unit = this._yaxisCB_bar;
    this.updatecustoms(chartNo);
    var unit = this.data.chartPreferences[chartNo]['UoM_y']
    var yaxis_data_bar = [];
    console.log('inside bar chart update');
    if (this.yaxis_data[chartNo] != [] && this.yaxis_data[chartNo] != undefined && this.data.chartSelection['selection'] !== 'selectedchart') {
      for (let i = 0; i < this.yaxis_data[chartNo].length; i++) {
        yaxis_data_bar[i] = this.data.ReportTable_data[this.yaxis_data[chartNo][i]].map(Number);
        this.chartData[chartNo][i] = {
          label: "",
          data: Array<any>()
        }
        this.chartData[chartNo][i].data = yaxis_data_bar[i];
        this.chartData[chartNo][i].label = this.yaxis_data[chartNo][i];
      }
      console.log(this.yaxis_data[chartNo]);
    }
    else {
      this.chartData[chartNo] = this.bardata;
    }
    var gridlinedashed = [];
    var yaxisdata = 'Not provided';
    if (this.yaxis_data[chartNo] !== undefined) {
      yaxisdata = this.yaxis_data[chartNo][0];
    }
    var xaxisdata = 'Not Provided';
    if (this.xaxis_data[chartNo] !== undefined) {
      xaxisdata = this.xaxis_data[chartNo];
    }

    this.data.chartPreferences['gridborder'] == true ? gridlinedashed = [10, 10] : gridlinedashed = [];
    this.chartOptions[chartNo] = {
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
          easing: this.data.chartPreferences['animations']
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItems) {
            if (unit == "₹" || unit == "$" || unit == "€" || unit == "£")
              return (unit + " " + tooltipItems.yLabel.toString());
            else
              return (tooltipItems.yLabel.toString() + " " + unit);
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
            labelString: xaxisdata
          },
          display: true
        }],
        yAxes: Array<any>()
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        enabled: true,
        mode: 'xy',
      }
    };
    for (let i = 0; i < this.chartData[chartNo].length; i++) {
      if (i == 0) {
        this.chartOptions[chartNo].scales.yAxes[0] = {
          position: 'left',
          type: 'linear',
          display: true,
          id: 'y-1',
          gridLines: {
            drawOnChartAdrawBorder: false,
            borderDash: gridlinedashed,
            lineWidth: this.data.chartPreferences['gridlinewidth']
          },
          ticks: {
            // min: this._yaxismin,
            // max: this._yaxismax,
            stepSize: this.data.chartPreferences['yaxisstepsize'],
            autoSkip: this.data.chartPreferences['yaxisautoskip'],
            fontColor: this.barChartColors[0].borderColor,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label / 1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: yaxisdata,
            fontColor: this.barChartColors[0].borderColor
          }
        };
      }
      if (i > 0) {
        this.chartOptions[chartNo].scales.yAxes[i] = {
          position: 'right',
          type: 'linear',
          display: true,
          id: "y-".concat((i + 1).toString()),
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          ticks: {
            // min: this._yaxismin,
            // max: this._yaxismax,
            // stepSize: this._yaxisstepSize,
            // autoSkip: this._yaxisAutoskip,
            fontColor: this.barChartColors[i].borderColor,
            beginAtZero: true,
            callback: function (label) {
              if (label > 1000) {
                return unit + " " + label / 1000 + " k";
              }
              else {
                return unit + " " + label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: this.yaxis_data[chartNo][i],
            fontColor: this.barChartColors[i].borderColor
          }
        };
      }
    }
    this.xaxis_data[chartNo] != "" ? this.chartLabels[chartNo] = this.data.ReportTable_data[this.xaxis_data[chartNo]]
      : this.chartLabels[chartNo] = this.chartlabels;

  }

  updatePieChart(chartNo) {
    this.updatecustoms(chartNo);
    this.chartData[chartNo] = [];
    this.chartLabels[chartNo] = [];
    var yaxis_data_pie = [];
    var xaxis_data_pie = [];
    if (this.yaxis_data[chartNo] != [] && this.yaxis_data[chartNo] != undefined && this.data.chartSelection['selection'] !== 'selectedchart') {
      for (let i = 0; i < this.yaxis_data[chartNo].length; i++) {
        yaxis_data_pie[i] = this.data.ReportTable_data[this.yaxis_data[chartNo][i]].map(Number);
        if (this.xaxis_data != undefined || this.xaxis_data.length > 0) {
          console.log(this.data.ReportTable_data[this.yaxis_data[chartNo][i]]);
          console.log(this.data.ReportTable_data[this.xaxis_data[chartNo]]);
          xaxis_data_pie = this.data.ReportTable_data[this.xaxis_data[chartNo]];
        } else {
          xaxis_data_pie[i] = 'Not provided';
        }
        this.chartData[chartNo].push({
          labels: xaxis_data_pie,
          data: yaxis_data_pie[i]
        });
      }
    } else {
      this.chartData[chartNo].push({
        labels: ['Not provided'],
        data: [100]
      })
    }
    console.log(this.chartData);
    this.xaxis_data[chartNo] != "" ? this.chartLabels[chartNo] = this.data.ReportTable_data[this.xaxis_data[chartNo]]
      : this.chartLabels[chartNo] = this.chartlabels;
  }

  updateDoughnutChart(chartNo) {
    this.updatecustoms(chartNo);
    this.chartData[chartNo] = [];
    this.chartLabels[chartNo] = [];
    var yaxis_data_doughnut = [];
    var xaxis_data_doughnut = [];
    if (this.yaxis_data[chartNo] != [] && this.yaxis_data[chartNo] != undefined && this.data.chartSelection['selection'] !== 'selectedchart') {
      for (let i = 0; i < this.yaxis_data[chartNo].length; i++) {
        yaxis_data_doughnut[i] = this.data.ReportTable_data[this.yaxis_data[chartNo][i]].map(Number);
        if (this.xaxis_data != undefined || this.xaxis_data.length > 0) {
          console.log(this.data.ReportTable_data[this.yaxis_data[chartNo][i]]);
          console.log(this.data.ReportTable_data[this.xaxis_data[chartNo]]);
          xaxis_data_doughnut = this.data.ReportTable_data[this.xaxis_data[chartNo]];
        } else {
          xaxis_data_doughnut[i] = 'Not provided';
        }
        this.chartData[chartNo].push({
          labels: xaxis_data_doughnut,
          data: yaxis_data_doughnut[i]
        })
      }
    } else {
      this.chartData[chartNo].push({
        labels: ['Not provided'],
        data: [100]
      })
    }
    console.log(this.chartData);
    this.xaxis_data[chartNo] != "" ? this.chartLabels[chartNo] = this.data.ReportTable_data[this.xaxis_data[chartNo]]
      : this.chartLabels[chartNo] = this.chartlabels;
  }

  updatechart(chartNo, chart_type) {
    console.log(chartNo);
    console.log(chart_type);
    if (chart_type === 'linechart_sel') {
      this.updateLineChart(chartNo);
    }
    if (chart_type === 'barchart_sel')
      this.updateBarChart(chartNo);
    if (chart_type === 'piechart_sel')
      this.updatePieChart(chartNo);
    if (chart_type === 'doughnutchart_sel')
      this.updateDoughnutChart(chartNo);
  }

  updatecustoms(chartNo) {
    var test = 0;

    /*if (this.personalizationtable != undefined && (this.myobj.mychartType != "" || this.myobj.myxaxisdata != "" || this.myobj.myyaxisdata != "")) {
      for (let i = 0; i < this.personalizationtable.length; i++) {
        if ((this.data.chartPreferences[chartNo]['selectedchart'] != this.personalizationtable[i].chartType ||
          this.data.chartPreferences[chartNo]['xaxisdata'] != this.personalizationtable[i].xaxisdata ||
          this.data.chartPreferences[chartNo]['yaxisdata'] != this.personalizationtable[i].yaxisdata)) {
          test = 0;
        }
        else {
          test = 1;
        }
      }
    }
    else {
      test = 1;
    }*/
    if (test == 0 && this.data.chartSelection['update'] && (this.data.chartSelection['selection'] === 'xaxisdata'
      || this.data.chartSelection['selection'] === 'yaxisdata' || this.data.chartSelection['selection'] === 'UoM_y'
      || this.data.chartSelection['selection'] === 'SoM_y')) {
      var obj = {
        chartType: this.data.chartPreferences[chartNo]['selectedchart'],
        xaxisdata: this.data.chartPreferences[chartNo]['xaxisdata'],
        yaxisdata: this.data.chartPreferences[chartNo]['yaxisdata'],
        UoM: this.data.chartPreferences[chartNo]['UoM_y'],
        SoM: this.data.chartPreferences[chartNo]['SoM_y'],
      }
      this.personalizationtable.push(obj);
      this.data.chartPreferences[chartNo]['personalizationtable'] = obj;
      if (this.data.chartSelection['selection'] === 'yaxisdata') {
        this.yaxis_data[chartNo] = [];
        this.yaxis_data[chartNo].push(obj.yaxisdata);
      }
      if (this.data.chartSelection['selection'] === 'xaxisdata') {
        this.xaxis_data[chartNo] = obj.xaxisdata;
      }
      this.chartarray[chartNo] = [];
      this.chartarray[chartNo].push(obj);
      //this.updatechart(chartNo, obj.chartType);

      console.log(this.yaxis_data);
      console.log(this.xaxis_data);
      //this.setchartpreferences('all');
    }
    else {
      this._snackBar.open("Data already exist in table", 'Ok', {
        duration: 2000
      });
    }
  }

  getchartpreferences() {
    var cp = [];
    if (this.userprefs['backgroundcolor'] != undefined)
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

    /*if (this.userprefs['selectedchart'] != undefined && this.userprefs['selectedchart'] != "")
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

  /*getpreferences() {
    console.log("getpref");
    this.data.getchartstyling(this.UNIQUE_ID, this.SRC_ID).subscribe(
      res => {
        console.log(res.json());
        var result = res.json();

        var name = result.PRF_NM;
        var value = result.PRF_VAL;
        this.V_PRF_NM = name;
        this.V_PRF_VAL = value;
        for (let i = 0; i < name.length; i++) {
          this.userprefs[name[i]] = value[i];
        }
        if (name.length) {
          console.log(this.userprefs);
          this.gettablepreferences();
          this.getchartpreferences();
        } else {
          this.showhide(this.show_choice);
        }
      });
  }*/

}
