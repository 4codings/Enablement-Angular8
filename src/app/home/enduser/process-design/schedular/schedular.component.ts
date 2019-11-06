import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Globals } from '../../../../services/globals';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.scss'],
  inputs: ['parentapp', 'parentpro', 'changing']
})
export class SchedularComponent implements OnInit {
  parentapp: string;
  parentpro: string;
  changing: Subject<boolean>;
  public addClass: boolean = false;
  constructor(private store: StorageSessionService,
    private route: Router,
    private http: HttpClient, private globals: Globals, private apiService: ApiService
  ) { }
  toppings = new FormControl();
  domain_name = this.globals.domain_name;
  min: any;

  Select_candence_option: any = ["Minute", "Week", "Month", "Year"];
  start_date: any = "";
  End_date: any = "";
  Repeat_after: any;

  week_day_selected: any;
  Month_choice: any = "1";
  Execute_Later: boolean = false;
  candence_choice = "Minute";
  Month_dayth: string;

  Month_timeth: string;
  numberthDayOfEveryMonth: any;
  //______________________BLOCK
  week_block: boolean = false;
  month_block: boolean = false;
  year_block: boolean = false;
  Minute_block: boolean = false;
  //________________________________________

  year_choice_final: any = "1";
  month_select_for_year: any;
  month_select_for_year1: any;
  numberthDayOfMonth: any;
  Year_timeth: any;
  Year_dayth: any;
  fo1: any = "Week";
  tp = {};
  fooo(v) {
    this.fo1 = v;
  }
  changeView(v) {
    let timer_value = this.candence_choice;
    if (timer_value == "Week" || timer_value == "Month" || timer_value == "Year" || timer_value == "Minute") {
      switch (timer_value) {
        case "Minute":
          this.week_block = false;
          this.month_block = false;
          this.year_block = false;
          this.Minute_block = true;
          //_____________________________truncate
          break;
        case "Week":
          this.week_block = true;
          this.month_block = false;
          this.year_block = false;
          this.Minute_block = false;

          break;
        case "Month":
          this.week_block = false;
          this.month_block = true;
          this.year_block = false;
          this.Minute_block = false;
          break;
        case "Year":
          this.week_block = false;
          this.month_block = false;
          this.year_block = true;
          this.Minute_block = false;
          break;
      }
    }
  }
  //----------------------------cron expression
  Exe_data = this.store.getSession("Exe_data");
  V_SRC_CD: string = '';
  V_USR_NM: string = '';
  private Url = this.apiService.endPoints.securedScheduleProcess;
  cronEditForRepeat() {

    this.Execute_Later = true;
    this.tp = this.store.getCookies("ts")

    var date = new Date(this.start_date);
    var sec: any = date.getSeconds();
    var min: any = date.getMinutes();
    var hrs: any = date.getHours();
    var date_of_month: any = date.getDate();
    var month: any = date.getMonth();
    var day: any = date.getDay();
    var year: any = date.getFullYear();
    var switch_data: any = this.candence_choice;
    var repeat_after: any = this.Repeat_after;

    //    alert(this.Month_choice);
    switch (switch_data) {

      case "Minute":
        min = "0/" + repeat_after;
        sec = "0";
        hrs = "*";
        date_of_month = "*";
        month = "*";
        year = "*";
        day = "?";
        break;
      //----------------------------------WEEK
      case "Week":

        day = this.week_day_selected;

        date_of_month = "?";
        month = "*";
        year = "*";

        break;
      //--------------------------------------MONTH
      case "Month":
        if (this.Month_choice == "1") {
          date_of_month = this.numberthDayOfEveryMonth;
          month = "1/1";
          day = "?";
          year = "*";
        } else if (this.Month_choice == "2") {
          date_of_month = "?";
          month = "1/1";
          year = "*";
          let mnt_tim = parseInt(this.Month_timeth) + 1;
          day = this.Month_dayth.substr(0, 3) + "#" + mnt_tim;
          alert(day);
        }
        break;
      case "Year":
        if (this.year_choice_final == "1") {
          month = parseInt(this.month_select_for_year) + 1;
          date_of_month = this.numberthDayOfMonth;
          day = "?";
          year = "*";
        } else if (this.year_choice_final == "2") {
          month = parseInt(this.month_select_for_year1) + 1;
          date_of_month = "?";
          let dttt = parseInt(this.Year_timeth) + 1;
          day = this.Year_dayth.substr(0, 3) + "#" + dttt;
          year = "*";
        } else {
          alert("Please select one option for Year");
          return;
        }
        break;
      default:
        alert("Please Do not manipulate the HTML!");

    }
    var res_cron = "";
    res_cron = res_cron + sec + " " + min + " " + hrs + " " + date_of_month + " " + month + " " + day + " " + year;
    (day);

    //------------------------------------------------------
    var timezone = new Date();

    var Intermediatetimezone = timezone.toString()
    /*Start Date*/
    var stmonth = this.start_date.getMonth() + 1;
    if (stmonth < 10)
      stmonth = '0' + stmonth;

    var stdate = this.start_date.getDate();
    if (stdate < 10)
      stdate = '0' + stdate;

    var sthrs = this.start_date.getHours();
    if (sthrs < 10)
      sthrs = '0' + sthrs;
    var stmin = this.start_date.getMinutes();
    if (stmin < 10)
      stmin = '0' + stmin;
    var stsec = this.start_date.getSeconds();
    if (stsec < 10)
      stsec = '0' + stsec;

    var date11 = this.start_date.getFullYear() + '-' + stmonth + '-' + stdate;
    var time11 = sthrs + ":" + stmin + ":" + stsec;
    var dateTime11 = date11 + ' ' + time11;
    /*End Date*/
    var endmonth = this.End_date.getMonth() + 1;
    if (endmonth < 10)
      endmonth = '0' + endmonth;

    var enddate = this.End_date.getDate();
    if (enddate < 10)
      enddate = '0' + enddate;

    var endhrs = this.End_date.getHours();
    if (endhrs < 10)
      endhrs = '0' + endhrs;
    var endmin = this.End_date.getMinutes();
    if (endmin < 10)
      endmin = '0' + endmin;
    var endsec = this.End_date.getSeconds();
    if (endsec < 10)
      endsec = '0' + endsec;

    var date22 = this.End_date.getFullYear() + '-' + endmonth + '-' + enddate;
    var time22 = endhrs + ":" + endmin + ":" + endsec;
    var dateTime22 = date22 + ' ' + time22;
    let body = {

      "Schedule": "Y",
      "expression": res_cron,
      "V_APP_CD": this.parentapp,
      "V_PRCS_CD": this.parentpro,
      "V_SRVC_CD": "START",
      "V_SRC_CD": this.V_SRC_CD.toString(),
      "V_USR_NM": this.V_USR_NM.toString(),
      "ST_DATE": dateTime11.toString(),
      "END_DATE": dateTime22.toString(),
      "TimeZone": Intermediatetimezone
    }
    Object.assign(body, this.tp);
    this.http.post(this.Url, body).subscribe(
      res => {
        this.Execute_Later = false;
        (res);
      }
    );

  }
  //---------------------date start
  min_start: any;
  getEndYear() {
    var date = new Date();
    var nextD = new Date();
    nextD.setFullYear(date.getFullYear() + 1);
    this.End_date = nextD;

    this.min = new Date(this.End_date);
    this.min_start = new Date(date);
  }
  Redirect_to_user() {
    this.route.navigateByUrl("schd-actn");
  }
  Execute() {
    alert();
  }
  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.start_date = new Date();
    this.Repeat_after = 1;
    this.getEndYear();
    this.changing.subscribe(v => {
      this.addClass = v;
    });
  }
}

