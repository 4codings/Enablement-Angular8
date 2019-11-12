import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../services/globals';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

// import { MatTableDataSource } from '@angular/material';
import { HostListener } from "@angular/core";
import { HomeComponent } from '../../home.component';
import { UserAdminService } from '../../../services/user-admin.service';
import { NoAuthDataService } from '../../../services/no-auth-data.service';
import { StorageSessionService } from '../../../services/storage-session.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  // styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit {
  ngOnInit() {

  }
  // innerTableDT: any[] = [];
  // F1: any[];
  // rowData={};
  // displayedColumns = ['Name', 'Values'];
  // dataSource = new MatTableDataSource();
  // private selectedLink: string = "Replay";
  // V_SRC_CD: string = '';
  // V_USR_NM: string = '';
  // V_BASE_ID: string[] = null;
  // screenHeight = 0;
  // screenWidth = 0;
  // mobileView = false;
  // desktopView = true;
  // @HostListener('window:resize', ['$event'])
  // onResize(event?) {
  //   this.screenHeight = window.innerHeight;
  //   this.screenWidth = window.innerWidth;
  //   if (this.screenWidth <= 767) {
  //     this.mobileView = true;
  //     this.desktopView = false;
  //   } else {
  //     this.mobileView = false;
  //     this.desktopView = true;
  //   }
  // }

  // constructor(private http: HttpClient, private router: Router,
  //   private data: UserAdminService, private globals: Globals,
  //   private StorageSessionService: StorageSessionService,
  //   private app: HomeComponent, private noAuthData: NoAuthDataService) {
  //   this.onResize();
  //   this.onpselect = function (index) {
  //     this.selectedplat = index;
  //     this.app.selected_SERVICE = this.srvcd[index];
  //     this.selectedot = null;
  //     this.selectedat = null;
  //   }
  //   this.onqselect = function (index) {
  //     this.selectedot = index;
  //     this.selectedat = null;
  //   }
  //   this.onrselect = function (index) {
  //     this.selectedat = index;
  //     this.selectedot = null;
  //   }
  // }

  // domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  // private apiUrlPost = "https://" + this.domain_name + "/rest/Hold/Exception/";
  // atxnid: string[];
  // srvcd: string[];
  // otxnid: string[];
  // excepmessage: string[];
  // servicedetails: string[];
  // notes: string[];
  // grp: string[];
  // servs: string;
  // array: string[];
  // array1: string[];
  // array2: string[][] = [];
  // paramarr: string[] = [];
  // searchResult: any[];
  // selectedradiobtn: string = "Replay";
  // onpselect: Function;
  // onqselect: Function;
  // onrselect: Function;
  // selectedservc: Number;
  // selectedat: Number;
  // selectedot: Number;
  // agency_sl = "";
  // excepmessageedit: string;
  // notesedit: string;
  // parashow: boolean = true;
  // selectedoption = "debug";
  // disabled: boolean;
  // txn_id: string;
  // //Label:any[]=[];
  // Label: string[] = [];

  // //for getting list of services

  // functionsrvcGetData() {
  //   this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&SCREEN=Exception%20Sceen&REST_Service=HeldService&Verb=GET").subscribe(
  //     res => {
  //       //(res.SRVC_CD);
  //       ("DATA.....................")
  //       this.srvcd = res.SRVC_CD;
  //       var get_index = -1;
  //       for (let i = 0; i < this.srvcd.length; i++) {
  //         if (this.srvcd[i] == this.app.selected_SERVICE) { get_index = i; break; }
  //       }
  //       if (get_index != -1)
  //         this.onpselect(get_index);
  //       this.functionATIDGetData(this.srvcd[get_index]);
  //       this.functionOTIDGetData(this.srvcd[get_index]);
  //     }
  //   );
  // }

  // //=>for getting acquired transaction ids


  // functionATIDGetData(exc_sl) {

  //   ("GET..............")
  //   if (exc_sl == "") {
  //     this.grp = null;
  //     this.otxnid = null;
  //     this.atxnid = null;

  //     this.agency_sl = "";
  //   }
  //   this.txn_id = "";
  //   this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=FailedServiceTxnID&Verb=GET").subscribe(
  //     res => {
  //       //(res.TXN_ID);
  //       this.atxnid = res.TXN_ID;
  //     }
  //   );
  // }

  // //=>for getting open transaction ids
  // functionOTIDGetData(exc_sl) {

  //   ("GET1................")
  //   if (exc_sl == "") {
  //     this.grp = null;
  //     this.otxnid = null;
  //     this.atxnid = null;

  //     this.agency_sl = "";
  //   }
  //   this.http.get<data>(this.apiUrlGet + "V_SRVC_CD=" + exc_sl + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=FailedTransaction&Verb=GET").subscribe(
  //     res => {
  //       // (res.TXN_ID);
  //       this.otxnid = res.TXN_ID;
  //     }
  //   );
  // }

  // functiongetgroups() {

  //   ("GET2..................")
  //   this.http.get<data>(this.apiUrlGet + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Groups&Verb=GET").subscribe(
  //     res => {
  //       this.grp = res.USR_GRP_CD.sort(function (a, b) { return a.localeCompare(b); });
  //       //(this.grp);
  //     }
  //   );
  // }

  // // For getting Open Txn detail
  // functionservicedetails(txn_id) {

  //   ("GET3....................")
  //   this.disabled = true;
  //   this.array1 = null;
  //   this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txn_id + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=FailedTxnDetail&Verb=GET").subscribe(
  //     res => {
  //       this.servicedetails = res.PVP;
  //       this.excepmessage = res.EXCPN_MSG;
  //       this.notes = res.RSLTN_NOTE;
  //       this.V_BASE_ID = res.BASE_ID;
  //       this.servs = this.servicedetails[0];
  //       this.array = this.servs.split(',');
  //       this.array[0] = this.array[0].substr(1);
  //       let l = this.array.length;
  //       l = l - 1;
  //       this.array[l] = this.array[l].slice(0, -1);
  //       for (let i in this.array) {
  //         this.array1 = this.array[i].split('=');
  //         this.array2.push(this.array1);
  //         this.array1 = [];
  //       }
  //     });
  // }

  // // For getting owned failed Txn detail
  // functionownedservicedetails(txn_id) {

  //   ("GET4....................")
  //   this.array1 = null;
  //   this.disabled = false;
  //   this.http.get<data>(this.apiUrlGet + "V_TXN_ID=" + txn_id + "&V_USR_NM=" + this.V_USR_NM + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=FailedTxnOwner&Verb=GET").subscribe(
  //     res => {
  //       this.servicedetails = res.PVP;
  //       this.excepmessage = res.EXCPN_MSG;
  //       this.notes = res.RSLTN_NOTE;
  //       this.V_BASE_ID = res.BASE_ID;
  //       this.servs = this.servicedetails[0];
  //       this.array = this.servs.split(",");
  //       this.array[0] = this.array[0].substr(1);
  //       let l = this.array.length;
  //       l = l - 1;
  //       this.array[l] = this.array[l].slice(0, -1);
  //       for (let i in this.array) {
  //         this.array1 = this.array[i].split("=");
  //         this.array2.push(this.array1);
  //         this.array1 = [];
  //       }
  //       //      for (let i in this.array2) {
  //       //       this.innerTableDT[i]={
  //       //         Name: this.array2[i][0],
  //       //         Values:this.array2[i][1]
  //       //       }
  //       //       this.dataSource.data=this.innerTableDT;
  //       //          (this.array2);

  //       // }
  //     });
  // }

  // // -------------for getting dropdown values of parameter -----------

  // getDropDownListValue(e) {

  //   ("GET5.....................")
  //   this.app.loading = true;
  //   this.searchResult = [];
  //   this.http.get("https://" + this.domain_name + "/rest/v1/secured?V_SRC_CD=AWS1&V_APP_CD=Federal%20Contracts&V_PRCS_CD=Federal%20Opportunities&V_PARAM_NM=Type%20of%20Set%20Aside&V_SRVC_CD=Pull%20FPDS%20Contracts&REST_Service=ProcessParametersOptions&Verb=GET")
  //     .subscribe(
  //       res => {
  //         (res[e]);
  //         this.searchResult = res[e];
  //         this.app.loading = false;
  //       }
  //     );

  // }


  // functiontoAcquire() {

  //   let body = {
  //     "V_USR_NM": this.V_USR_NM,
  //     "V_BASE_ID": this.V_BASE_ID,
  //     "V_SRC_CD": this.V_SRC_CD,
  //     "V_PVP": "{NAICSCode=,Cc=,File Name to build=,NAICS=,TypeofSetAside=,Zip Code=,MaxUltimateContractValue=,MaxEstUltimateCompletionDate=,Type of Set Aside=,File Name=,To=,Email Message=,PSC=,Build File Path=,Agency=,ZipCode=,City=,MinUltimateContractValue=,Subject=,DescriptionofRequirement=,Requirement Description=,State=,Country=,File Path=,Period Expiring=,Contract Value=,MinEstUltimateCompletionDate=}",
  //     "V_RELEASE_RSN": this.notes,
  //     "RESULT": "@RESULT",
  //     "V_OPERATION": "ACQUIRED"
  //   };
  //   this.http.post(this.apiUrlPost, body).subscribe(
  //     res => {
  //       (res);
  //       // (body);
  //     }
  //   );
  //   this.functionclear();

  // }
  // functionclear() {
  //   this.detailshow = false;
  //   this.atxnid = null;

  //   //this.txnid_sl = null;
  //   this.operationshow = false;

  // }
  // functiontoRelease() {
  //   let body = {
  //     "V_USR_NM": this.V_USR_NM,
  //     "V_BASE_ID": this.V_BASE_ID,
  //     "V_SRC_CD": this.V_SRC_CD,
  //     "V_PVP": "{NAICSCode=,Cc=,File Name to build=,NAICS=,TypeofSetAside=,Zip Code=,MaxUltimateContractValue=,MaxEstUltimateCompletionDate=,Type of Set Aside=,File Name=,To=,Email Message=,PSC=,Build File Path=,Agency=,ZipCode=,City=,MinUltimateContractValue=,Subject=,DescriptionofRequirement=,Requirement Description=,State=,Country=,File Path=,Period Expiring=,Contract Value=,MinEstUltimateCompletionDate=}",
  //     "V_RELEASE_RSN": "null",
  //     "RESULT": "@RESULT",
  //     "V_OPERATION": "RELEASED"
  //   };
  //   this.http.post(this.apiUrlPost, body).subscribe(
  //     res => {
  //       (res);
  //     }
  //   );
  // }
  // agcygrpbox: boolean = false;
  // detailshow: boolean = false;
  // acquirebtnshow: boolean = false;
  // operationshow: boolean = false;
  // functiondetailshow() {
  //   this.detailshow = true;
  // }
  // functionoperations() {
  //   this.operationshow = true;
  //   this.acquirebtnshow = false;
  // }
  // functionparashow() {
  //   this.parashow = true;
  // }
  // hideparashow() {
  //   this.parashow = false;
  // }
  // functionacqire() {
  //   this.acquirebtnshow = true;
  //   this.agcygrpbox = false;
  //   this.operationshow = false;
  //   this.parashow = false;

  // }
  // showagcygrpbox() {
  //   this.agcygrpbox = true;
  // }

  // hideagcygrpbox() {
  //   this.agcygrpbox = false;
  // }

  // ngOnInit() {
  //   this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  //   this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  //   ("Data fetch..........")
  //   this.functionsrvcGetData();
  //   // this.data.getJSON().subscribe(data => {
  //   //    (data.json());
  //   //    this.Label=data.json();
  //   //    (this.Label);
  //   //   })
  //   this.noAuthData.getJSON().subscribe(data => {
  //     this.Label = data;
  //   });

  // }

  // // setradio(e: string): void{
  // //  this.selectedLink = e;
  // // }

  // // isSelected(name: string): boolean {
  // //   if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown
  // //           return false;
  // // }

  // //  return (this.selectedLink === name); // if current radio button is selected, return true, else return false
  // // }
  // // showLogout(){
  // //   if(this.isSelected('release') || this.isSelected('ignore'))
  // //       return true;
  // //   else
  // //       return false;
  // // }
}
export interface data {
  SRVC_CD: string[];
  TXN_ID: string[];
  PVP: string[];
  EXCPN_MSG: string[];
  RSLTN_NOTE: string[];
  USR_GRP_CD: string[];
  BASE_ID: string[];
}
