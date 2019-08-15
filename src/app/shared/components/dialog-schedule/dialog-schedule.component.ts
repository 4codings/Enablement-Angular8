import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { StorageSessionService } from '../../../services/storage-session.service';
import { Globals } from '../../../services/globals';

@Component({
	selector: 'app-dialog-schedule',
	templateUrl: './dialog-schedule.component.html',
	// styleUrls: ['./dialog-schedule.component.css'],
	inputs: ['parentapp', 'parentpro']
})

export class DialogScheduleComponent implements OnInit {
	@Input() SL_APP_CD;
	choosenEmoji: string;
	public parentapp: string;
	public parentpro: string;
	tp: any;
	constructor(public dialogRef: MatDialogRef<DialogScheduleComponent>,
		private route: Router,
		private store: StorageSessionService,
		private http: HttpClient, private globals: Globals


	) { }
	start_date: any = "";
	domain_name = this.globals.domain_name;
	private Url = "https://" + this.domain_name + "/rest/Process/Schedule"
	min_start = new Date();
	Exe_data = this.store.getSession("Exe_data");
	V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
	V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
	Execute() {
		var date = new Date(this.start_date);
		var sec: any = date.getSeconds();
		var min: any = date.getMinutes();
		var hrs: any = date.getHours();
		var date_of_month: any = date.getDate();
		var month: any = date.getMonth() + 1;
		var day: any = date.getDay();
		var year: any = date.getFullYear();

		var res_cron = "";
		res_cron = res_cron + sec + " " + min + " " + hrs + " " + date_of_month + " " + month + " " + "?" + " " + year;
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
		let body = {

			"Schedule": "Y",
			"expression": res_cron,
			"V_APP_CD": this.Exe_data['APP_CD'].toString(),
			"V_PRCS_CD": this.Exe_data['PRC_CD'].toString(),
			"V_SRVC_CD": "START",
			"V_SRC_CD": this.V_SRC_CD.toString(),
			"V_USR_NM": this.V_USR_NM.toString(),
			"ST_DATE": dateTime11.toString(),
			"END_DATE": null,
			"TimeZone": Intermediatetimezone
		}
		this.tp = this.store.getCookies("ts");
		//(this.tp);
		Object.assign(body, this.tp);
		(body);
		this.http.post(this.Url, body).subscribe(
			res => {
				(res);
			}
		);

	}

	ngOnInit() {
		this.start_date = new Date();
	}

	onBtnCancelClick(): void {
		this.dialogRef.close();
	}

}
