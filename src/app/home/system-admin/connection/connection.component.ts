import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { HostListener } from "@angular/core";
import { Globals } from 'src/app/services/globals';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { UseradminService } from 'src/app/services/useradmin.service2';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  screenHeight=0;
  screenWidth=0;
  mobileView=false;
  desktopView=true;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if(this.screenWidth<=767)
      {
        this.mobileView=true;
        this.desktopView=false;
      }else{
        this.mobileView=false;
        this.desktopView=true;
      }
  }
  constructor(private http: HttpClient,
    private data:UseradminService,private globals:Globals,
    private StorageSessionService: StorageSessionService) {
      this.onResize();
      this.onpselect = function(index){
        this.selectedcontyp= index;
        this.selectedcon=null;
        }
        this.onmselect = function(index){
          this.selectedcon = index;
          }
     }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/v1/secured";

  conn_type: string[];
  conn: string[];
  c_code: string[] = [];
  c_desc: string[] = [];
  par_nm: string[] = [];
  par_val: string[] = [];
  array: string[] = [];
  array1: string[][] = [];
  Data: any[] = [];
  Data1: any[] = [];
  val = "";
  val1 = "";
  i = 0;
  connectionshow: boolean = false;
  tableshow: boolean = false;
 onpselect:Function;
 onmselect:Function;
  Label:any[]=[];

  //function to get connection types
  getconnectiontype() {
    this.http.get<data>(this.apiUrlGet + "V_CD_TYP=CXN&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Masters&Verb=GET").subscribe(
      res => {
        this.conn_type = res.CXN_TYP;
        //(this.conn_type);
      });
  }

  //function to get connection
  getconnection(sel_con_type) {
    this.val = sel_con_type;
    this.http.get<data>(this.apiUrlGet + "V_CXN_TYP=" + sel_con_type + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Connection&Verb=GET").subscribe(
      res => {
        this.conn = res.CXN_CD;
      });
  }

  //function to get connection code and description
  getcodedesc(sel_con) {
    this.val1 = sel_con;
    this.http.get<data>(this.apiUrlGet + "V_CXN_TYP=" + this.val + "&V_CXN_CD=" + sel_con + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ConnectionDescription&Verb=GET").subscribe(
      res => {
        this.c_code = res.CXN_CD;
        this.c_desc = res.CXN_DSC;
      });
  }

  //function to get table values
  gettable() {
    this.http.get<data>(this.apiUrlGet + "V_CXN_CD=" + this.val1 + "&V_CXN_TYP=" + this.val + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ConnectionDetail&Verb=GET").subscribe(
      res => {
        this.par_nm = res.PARAM_NM;
        this.par_val = res.PARAM_VAL;
        for (let i = 0; i < this.par_nm.length; i++) {
          this.Data[i] = {
            type: 'input',
            name: this.par_nm[i],
            value: this.par_val[i],
          }
         
        }
      });
  }

  //function to show connection,code,description and add,delete buttons
  showfield() {
    this.connectionshow = true;
  }

  //function to show table and update button
  showtab() {
    this.tableshow = true;
  }

  //function to add a connection
  addconn() {
    let body = {
      "V_SRC_CD": this.V_SRC_CD,
      "V_CXN_CD": this.c_code,
      "V_CXN_TYP": this.val,
      "V_CXN_DSC": this.c_desc,
      "REST_Service": "Connection_Para",
      "Verb": "PUT",
    };
    this.http.put(this.apiUrlPost, body).subscribe(
      res => {
        (res);
      });
  }

  //function to delete a connection  
  deleteconn() {

    let body = {
      "V_CXN_CD": this.val1,
      "V_SRC_CD": this.V_SRC_CD,
      "V_CXN_TYP": this.val,
      "REST_Service": "Connection",
      "Verb": "DELETE",
      "RESULT": "@RESULT"
    };
    this.http.put(this.apiUrlPost, body).subscribe(
      res => {
        (res);
      });
  }

  //function to store updated connection parameter
  storeconn(a) {
    this.Data1[this.i] = {
      name: a.name,
      value: a.value,
    }
    this.i++;
  }
  //function to update a connection
  updateconn() {
    for (var y = 0; y < this.i; y++) {
      let body = {
        "V_CXN_CD": this.val1,
        "V_CXN_TYP": this.val,
        "V_SRC_CD": this.V_SRC_CD,
        "V_PARAM_NM": this.Data1[y].name,
        "V_PARAM_VAL": this.Data1[y].value,
        "REST_Service": "Connection",
        "Verb": "PATCH"
      };
      console.log("body",body);
      this.http.patch(this.apiUrlPost, body).subscribe(
        res => {
          (res);
          (body);
        });
    }
    this.Data1.length=0;
  }
  ngOnInit() {
    this.getconnectiontype();
    this.data.getJSON().subscribe(data => {  
           (data.json());     
             this.Label=data.json();      
              (this.Label);   })
  }
}

export interface data {
  CXN_TYP: string[];
  CXN_CD: string[];
  CXN_DSC: string[];
  PARAM_NM: string[];
  PARAM_VAL: string[];
}
