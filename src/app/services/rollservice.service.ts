import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { StorageSessionService } from './storage-session.service';
import {Http} from '@angular/http';
import {Globals} from './globals';

@Injectable({
  providedIn: 'root'
})

export class RollserviceService {

  constructor(
      private http:HttpClient,
      private globals: Globals,
      private StorageSessionService:StorageSessionService,
  ) { }

  domain_name=this.globals.domain_name;
  agency=JSON.parse(sessionStorage.getItem('u')).SRC_CD
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  Roll_cd:any[]=[];
getRollCd(){
   return this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_SRC_CD="+this.agency+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=UserRoles&Verb=GET")
     ;
        
}
getAvailableGroupDetails(V_USR_GRP_CD:any){
	return this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_USR_GRP_CD="+V_USR_GRP_CD+"&V_SRC_CD="+this.agency+"&REST_Service=Group&Verb=GET");
}

}
