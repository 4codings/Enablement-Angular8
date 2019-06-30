import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router'
import { MatTableDataSource, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-dialog-charts',
  templateUrl: './dialog-charts.component.html',
  // styleUrls: ['./dialog-charts.component.css']
})
export class DialogChartsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogChartsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, private globals: Globals,
    private https: Http) { }
  gantt = false;
  bar = false;
  pie = false;
  ngOnInit() {
    if (this.data.type == "gantt") {
      this.gantt = true;
      this.chart_JSON_call("gantt");
    }
    if (this.data.type == "bar") {
      this.bar = true;
      this.chart_JSON_call("bar");
    }
    if (this.data.type == "pie") {
      this.pie = true;
      this.chart_JSON_call("pie");
    }
  }
  close() {
    this.dialogRef.close();
    this.gantt = false;
    this.bar = false;
    this.pie = false;
    (this.data);
  }
  ColorGantt = [];
  Colorpie = [];
  Colorpie_boder = [];
  ColorBar = [];
  ColorBar_border = [];
  domain_name = this.globals.domain_name;
  private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  time_to_sec(time): any {
    return parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(3, 5)) * 60 + (parseInt(time.substring(6)));
  }
  chart_JSON_call(type) {
    this.http.get(this.apiUrlGet + "V_SRC_ID=" + this.data.Execute_res_data['V_SRC_ID'] + "&V_APP_ID="
      + this.data.Execute_res_data['V_APP_ID'] + "&V_PRCS_ID=" + this.data.Execute_res_data['V_PRCS_ID']
      + "&V_PRCS_TXN_ID=" + this.data.Execute_res_data['V_PRCS_TXN_ID'] + "&REST_Service=ProcessStatus&Verb=GET")
      .subscribe(res => {
        (res);

        console.log(res);
        var start_time = [], end_time = [], Process = [];

        for (let i = 0; i < res['INS_DT_TM'].length; i++) {
          start_time[i] = res['INS_DT_TM'][i].substring(11);
          end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
          Process[i] = res['PRDCR_SRVC_CD'][i];
        }
        if (type = "gantt")
          this.show_gantt_chart(Process, start_time, end_time);
        if (type = "pie")
          this.show_pie(Process, start_time, end_time);
        if (type = "bar")
          this.show_bar_chart(Process, start_time, end_time);
        //delay
      });
  }

  show_gantt_chart(Process, start_time, end_time) {
    var count = 0, flag = false, val1;
    var mydataset = [];
    for (let i = 0; i < Process.length; i++) {
      var R = Math.floor(Math.random() * 200);
      var G = Math.floor(Math.random() * 200);
      var B = Math.floor(Math.random() * 200);
      if (this.ColorGantt.length < i + 1)
        this.ColorGantt[i] = "rgba(" + R + ',' + G + ',' + B + ")";
      //((this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])));
      //((this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])));
      mydataset[Process.length - i - 1] = {
        backgroundColor: this.ColorGantt[i],
        borderColor: this.ColorGantt[i],
        fill: false,
        borderWidth: 20,
        pointRadius: 0,
        data: [
          {
            x: (this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }, {
            x: (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }
        ]
      }
    }
    var element = (<HTMLCanvasElement>document.getElementById("myGanttchart"));
    if (element != null) {
      var ctx = element.getContext('2d');
      var scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: mydataset
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  return Process[Process.length - value - 1];
                }
              }
            }],
            xAxes: [{
              type: 'linear',
              position: 'top',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time',
                fontStyle: 'bold'
              },
              ticks: {
                //beginAtZero :true,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    var beg_str = start_time[0].substring(0, 2);
                    var begstr = parseInt(beg_str);
                    var mid_str = (start_time[0][3] + start_time[0][4]);
                    var midstr = parseInt(mid_str);
                    var end_str = start_time[0].substring(6);
                    var endstr = parseInt(end_str);
                    endstr += value;
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);

                    if (midstr < 10)
                      mid_str = '0' + midstr;
                    if (endstr < 10)
                      end_str = '0' + endstr;
                    if (begstr < 10)
                      beg_str = '0' + begstr;
                    //(count);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value/val1;
                  //return index;
                },
              }

            }],
          }
        }
      });
    }
  }

  show_pie(Process, start_time, end_time) {
    var mydata = [];
    var color = [], bcolor = [];
    var borderwidth_ = [];
    for (let i = 0; i < Process.length; i++) {
      var R = Math.floor(Math.random() * 200);
      var G = Math.floor(Math.random() * 200);
      var B = Math.floor(Math.random() * 200);
      if (this.Colorpie.length < i + 1) {
        this.Colorpie[i] = 'rgb(' + R + ',' + G + ',' + B + ',0.8)';
        this.Colorpie_boder[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      var temp = (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]));
      mydata[i] = temp;
      color[i] = this.Colorpie[i];
      bcolor[i] = this.Colorpie_boder[i];
      borderwidth_[i] = 1;
    }
    var data2 = {
      labels: Process,
      datasets: [
        {
          data: mydata,
          backgroundColor: color,
          borderColor: bcolor,
          borderWidth: borderwidth_
        }
      ]
    };
    var element = (<HTMLCanvasElement>document.getElementById("myPie"));
    if (element != null) {
      var ctx = element.getContext('2d');
      var chart1 = new Chart(ctx, {
        type: "pie",
        data: data2,
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                var ret = mydata[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          title: {
            display: true,
            position: "top",
            text: "Current Processes",
            fontSize: 12,
            fontColor: "#111"
          },
          legend: {
            display: true,
            position: "right",
            labels: {
              fontColor: "#333",
              fontSize: 10
            }
          }
        },
      });
    }
  }

  show_bar_chart(Process, start_time, end_time) {
    var val1, flag = false;
    var duration = [];
    var color = [];
    var bcolor = [];
    var temp_HH, temp_MM, temp_SS;
    for (let i = 0; i < Process.length; i++) {
      let len_temp = Process[i].length;
      Process[i] = Process[i].substring(0, 11);
      if (len_temp > Process[i].length)
        Process[i] = Process[i] + '...';
      var temp = this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]);
      duration[i] = temp;
      //(duration);
      var R = Math.floor(Math.random() * 200);
      var G = Math.floor(Math.random() * 200);
      var B = Math.floor(Math.random() * 200);
      if (this.ColorBar.length < i + 1) {
        this.ColorBar[i] = 'rgba(' + R + ',' + G + ',' + B + ',0.6)';
        this.ColorBar_border[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      color[i] = this.ColorBar[i];
      bcolor[i] = this.ColorBar_border[i];
    }
    var element = (<HTMLCanvasElement>document.getElementById("myBarchart"));
    if (element != null) {
      var ctx = element.getContext('2d');
      var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Process,
          datasets: [
            {
              data: duration,
              backgroundColor: color,
              borderColor: bcolor,
              borderWidth: 1
            }]
        },
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          legend: {
            display: false,
            position: "bottom",
            labels: {
              fontColor: "#333",
              fontSize: 16
            }
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                var ret = duration[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          scales: {
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Duration',
                fontStyle: 'bold'
              },
              ticks: {
                min: 0,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    var begstr = 0;
                    var midstr = 0;

                    var endstr = value;
                    //(index*value);
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);
                    let beg_str = begstr.toString(), mid_str = midstr.toString(), end_str = endstr.toString();
                    if (midstr < 10)
                      mid_str = '0' + midstr;
                    if (endstr < 10)
                      end_str = '0' + endstr;
                    if (begstr < 10)
                      beg_str = '0' + begstr;
                    //(min);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value;
                  //return index;
                },
              }
            }],
            xAxes: [{
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
            }]
          }
        }
      });
    }
  }
}
