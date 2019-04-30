import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import {HttpClientModule,HttpClient, HttpHeaders} from '@angular/common/http';
import { Globals } from 'src/app/services/globals';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.scss']
})
export class UsernavbarComponent implements OnInit {
 
  constructor(private router:Router,private http:HttpClient, private globals:Globals)
  { }
  roll_execute:boolean=false;
  roll_schedule:boolean=false;
  roll_orchestrate:boolean=false;
  roll_myTask:boolean=false;
  roll_exeption:boolean=false;
  roll_dashboard:boolean=false;
  roll_process:boolean=false;
  Roll_cd:any[]=[];
  domain_name=this.globals.domain_name;;
  agency;
  V_USR_NM;

  ngOnInit() {
    const data = {
      agency : JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM
    };
    this.agency = data.agency,
    this.V_USR_NM = data.V_USR_NM
    this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_SRC_CD="+this.agency+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=UserRoles&Verb=GET").subscribe(
     res=>{   this.Roll_cd=res['ROLE_CD'];
        (this.Roll_cd);
        let l =this.Roll_cd.length;
        for(let i=0;i<l;i++){
              // switch(this.Roll_cd[i]){
              //       case this.Roll_cd[i]=='Enablement Workflow Execute Role':
              //       this.roll_execute=true;
              //       break;
              //       case this.Roll_cd[i]=='Enablement Workflow Schedule Role':
              //       this.roll_schedule=true;
              //       break;
              //       case this.Roll_cd[i]=='Enablement Workflow Orchestrate Role':
              //       this.roll_orchestrate=true;
              //       break;
              //       case this.Roll_cd[i]=='Enablement Workflow MyTask Role':
              //       this.roll_myTask=true;
              //       break;
              //       case this.Roll_cd[i]=='Enablement Workflow Exception Role':
              //       this.roll_exeption=true;
              //       break;
              // }
        if(this.Roll_cd[i]=='Enablement Workflow Execute Role'){ this.roll_execute=true;}
        else if(this.Roll_cd[i]=='Enablement Workflow Schedule Role'){this.roll_schedule=true;}
        else if(this.Roll_cd[i]=='Enablement Workflow Orchestrate Role'){this.roll_orchestrate=true;}
        else if(this.Roll_cd[i]=='Enablement Workflow MyTask Role'){this.roll_myTask=true;}
        else if(this.Roll_cd[i]=='Enablement Workflow Exception Role'){this.roll_exeption=true;}
        else if(this.Roll_cd[i]=='Enablement Workflow Dashboard Role'){this.roll_dashboard=true;}    
        else if(this.Roll_cd[i]=='Enablement Workflow Process Role'){this.roll_process=true;}    
        }
  }
   );
  }

}

