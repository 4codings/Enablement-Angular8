import { Component, OnInit ,Inject,Input} from '@angular/core';
import { ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import {HttpClient} from '@angular/common/http';
//import { ExecuteComponent } from '../execute.component';
import { Injectable } from '@angular/core';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-repeat-after',
  templateUrl: './repeat-after.component.html',
  // styleUrls: ['./repeat-after.component.css'],
  inputs:['parentapp','parentpro']
})
export class RepeatAfterComponent implements OnInit {
public start_at_date:any;
public parentapp:string;
public parentpro:string;

constructor(
          private route:Router,
          private store:StorageSessionService,
          private StorageSessionService:StorageSessionService,
          private http:HttpClient,
          private globals:Globals
        

) { }
domain_name=this.globals.domain_name;
private Url="https://"+this.domain_name+"/rest/Process/Schedule"


min_date=new Date();
dateFr;
repeatProcess(){
           // var date=new Date(this.start_at_date);
           //this.dateFr=date.toLocaleDateString()+","+date.toLocaleTimeString();
          //  this.store.setLocatS("pro_start_date",this.dateFr);
            this.route.navigateByUrl("repeat");
}



V_SRC_CD=this.store.getSession("agency");
V_USR_NM=this.store.getSession("email");
Execute(){ 
  let timezone = new Date();
    
  let Intermediatetimezone = timezone;
  let body={
    Schedule:["Y"],
    expression:["38 27 19 15 3 ? 2018"],
    V_APP_CD:[this.parentapp],
    V_PRCS_CD:[this.parentpro],
    V_SRVC_CD:["START"],
    V_SRC_CD:[this.V_SRC_CD],
    V_USR_NM:[this.V_USR_NM],
    ST_DATE:["2018-06-08T02:24:28.755Z"],
    END_DATE:[null],
    TimeZone:[Intermediatetimezone]
          }
        this.http.post(this.Url,body).subscribe(
        res=>{
              (res);
        }
        );			
}
formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
}

  ngOnInit() {
    this.start_at_date=new Date();
  }

}
