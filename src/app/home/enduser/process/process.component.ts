import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource, MatSelectChange } from '@angular/material';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

import { EVENT_MANAGER_PLUGINS } from '../../../../../node_modules/@angular/platform-browser';
import { Globals } from 'src/app/services/globals';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { GetMessageService } from 'src/app/services/get-message.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  // styleUrls: ['../../../../assets/css/threepage.css']
})
export class ProcessComponent implements OnInit {

  constructor(private Router: Router,
    private http: HttpClient,
    private https: Http,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService,
    private roll: RollserviceService,
    public resp: GetMessageService,
    public deviceService: DeviceDetectorService,
    private webSocket: WebSocketService,
    private globals:Globals
  ) {
  }


  ngOnInit() {
    // console.log('process');
    /*this.resp.getresponse.subscribe(res =>{
      (res);
      ("Response Received");
      clearInterval(timer);
    })
    var i=0;
    var timer= setInterval(function myfunc(){i++; (i+" seconds passed");},1000);*/
  this.functionapplist()


  }
  flag=true;

  sendMessage(){
    //this.resp.sendResponse("Hi There....");
    /*this.webSocket.listenOn="102";
    this.webSocket.sendOnKey="102";
    this.resp.getMessage.subscribe(res =>{
      //res.text.PRCS_TXN_ID

        clearInterval(this.timer);
        this.webSocket.socket.removeAllListeners(this.webSocket.listenOn);
        //this.webSocket.reconnectSocket();

    });


    var i=0;

    this.timer= setInterval(function(){i++; (i+" seconds passed");},1000);
    this.http.get<any>("https://enablement.us/rest/E_DB/SP?V_SRC_ID=205&V_APP_ID=143&V_PRCS_ID=311&V_PRCS_TXN_ID=8752&REST_Service=ProcessStatus&Verb=GET").subscribe(
      res=>{
        var proc=this;

        setTimeout(function(){proc.resp.sendMessage(res);

       //   proc.flag=false;

        },5000);
      }
    )
    //this.resp.sendMessage("Hello");
      */
  }
  timer:any;
  recr_(){
    this.http.get<any>("https://enablement.us/rest/E_DB/SP?V_SRC_ID=205&V_APP_ID=143&V_PRCS_ID=311&V_PRCS_TXN_ID=8752&REST_Service=ProcessStatus&Verb=GET").subscribe(
      res=>{

        if(this.flag)
          this.recr_();
      }
    );
  }
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
  private apiUrlAdd = "https://"+this.domain_name+"/rest/E_DB/SP";
  V_SRC_CD: string = this.StorageSessionService.getSession("agency");
  V_USR_NM: string = this.StorageSessionService.getSession("email");
  APP_CD = [];
  PRCS_CD = [];
  SRVC_CD = [];
  APP_SEL_PRCS ;
  APP_SEL_PRCS_ARR;
  APP_SEL_PRCS_ARR_final ;
  selectedapp: string=null;
  selectedprcs: string=null;
  selectedsrvc: string=null;
  modifing;
  clickme(app ,i, evt) {
    this.APP_SEL_PRCS_ARR_final =  [];
    this.selectedapp = app;
    let index = this.APP_CD.indexOf(this.selectedapp);
    (<HTMLElement>document.querySelectorAll("mat-list")[1]).style.display = "block";
    (<HTMLElement>document.querySelectorAll("mat-list")[2]).style.display = "none";
    this.selectedsrvc=null;
    this.APP_SEL_PRCS = this.PRCS_CD[index];
    this.APP_SEL_PRCS_ARR =  this.APP_SEL_PRCS.split(',')
   for(let i = 0 ; i < this.APP_SEL_PRCS_ARR.length ; i++)
    {
      this.modifing = this.APP_SEL_PRCS_ARR[i].split('\'')
      this.modifing.shift()
      this.modifing.pop();
      this.modifing.join();
      this.APP_SEL_PRCS_ARR_final.push(this.modifing[0]);

    }




    //this.functionprocesslist();
  }
  clickme1(u, evt) {
    this.selectedprcs = u;
    (<HTMLElement>document.querySelectorAll("mat-list")[2]).style.display = "block";
    this.functionserviceslist();
  }
  clickme2(u, evt) {
    this.selectedsrvc = u;
  }
  // ----------- get Applications ------------
  functionapplist() {

    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ApplicationProcesses&Verb=GET").subscribe(
      res => {

        this.APP_CD=this.APP_CD.concat(res.APP_CD.sort(function (a, b) { return a.localeCompare(b); }));
        this.PRCS_CD =this.PRCS_CD.concat(res.PRCS_CD.sort(function(a , b ) { return a.localeCompare(b);}) )

      }
    );
  }

  //-------------Get Processes---------------
  /*functionprocesslist() {
    this.PRCS_CD = ['ALL'];
    this.SRVC_CD = ['ALL'];
    this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET").subscribe(
      res => {
        //(this.apiUrlGet + "V_APP_CD=" + this.predapp_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=AppProcesses&Verb=GET");
        if(res.CREATE[0]=="Y" && res.DELETE[0]=="Y" && res.UPDATE[0]=="Y")
        {
          this.PRCS_CD=this.PRCS_CD.concat(res.PRCS_CD.sort(function (a, b) { return a.localeCompare(b);}));
        }else{}
        //("Processes");
        //(this.PRCS_CD);
      }
    );
  }*/
  // ----------  get Services ------------
  functionserviceslist() {
    this.SRVC_CD = ['ALL'];

    this.http.get<data>(this.apiUrlGet + "V_APP_CD=" + this.selectedapp + "&V_SRC_CD=" + this.V_SRC_CD + "&V_PRCS_CD=" + this.selectedprcs + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=ProcessServices&Verb=GET").subscribe(
      res => {

        this.SRVC_CD=this.SRVC_CD.concat(res.SRVC_CD.sort(function (a, b) { return a.localeCompare(b);}));
      }
    );
  }
}
export interface data {
  APP_CD: string[];
  PRCS_CD: string[];
  SRVC_CD: string[];
  CREATE: string[];
  UPDATE: string[];
  DELETE: string[];
  PRDCR_SRVC_CD: string[];
  TRNSN_CND: string[];
  CONT_ON_ERR_FLG: string[];
  AUTO_ID: string[];
  USR_GRP_CD: string[];
}
