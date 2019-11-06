import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from "@angular/core";
import { Globals } from '../../../services/globals';
import { StorageSessionService } from '../../../services/storage-session.service';
import { UseradminService } from '../../../services/useradmin.service2';

@Component({
  selector: 'app-machineconnection',
  templateUrl: './machineconnection.component.html',
  styleUrls: ['./machineconnection.component.scss']
})
export class MachineconnectionComponent implements OnInit {

  V_SRC_CD: string = '';
  V_USR_NM: string = '';
  screenHeight = 0;
  screenWidth = 0;
  mobileView = false;
  desktopView = true;
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.mobileView = true;
      this.desktopView = false;
    } else {
      this.mobileView = false;
      this.desktopView = true;
    }
  }
  constructor(private http: HttpClient,
    private StorageSessionService: StorageSessionService,
    private data: UseradminService, private globals: Globals,
    public toastr: ToastrService) {
    this.onResize();
    this.oncontypeselect = function (index) {
      this.selectedcon = undefined;
      this.selectedcontype = index;

    }
    this.onmselect = function (index) {
      this.selectedmach = index;
    }
    this.onconselect = function (index) {
      this.selectedcon = index;
    }
  }

  domain_name = this.globals.domain_name; private apiUrlGet = "https://" + this.domain_name + "/rest/v1/secured?";
  private apiUrlPost = "https://" + this.domain_name + "/rest/v1/secured";

  con_type: string[];
  machines: string[];
  connections: string[];
  c_desc: string[] = [];
  m_desc: string[] = [];

  contype_sl = "";
  machine_sl = "";
  con_sl = "";

  Label: any[] = [];
  selectedcontype: Number;
  selectedmach: Number;
  selectedcon: Number;
  oncontypeselect: Function;
  onmselect: Function;
  onconselect: Function;

  //function to get connection_types
  getcontypes() {
    this.http.get<data>(this.apiUrlGet + "V_CD_TYP=CXN&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Masters&Verb=GET").subscribe(
      res => {
        this.con_type = res.CXN_TYP;

      });
  }

  //function to get Machines
  getmachines() {

    this.http.get<data>(this.apiUrlGet + "V_SRC_CD=" + this.V_SRC_CD + "&V_USR_NM=" + this.V_USR_NM + "&REST_Service=Users_Machines&Verb=GET").subscribe(
      res => {
        this.machines = res.PLATFORM_CD;
      });
  }

  //function to get Connections
  getconnections(sel_contype) {
    this.c_desc = null;
    this.contype_sl = sel_contype;

    this.http.get<data>(this.apiUrlGet + "V_CXN_TYP=" + sel_contype + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Connection&Verb=GET").subscribe(
      res => {
        this.connections = res.CXN_CD;

      });
  }

  //function to get connection description
  getcondesc(sel_con) {
    this.con_sl = sel_con;

    this.http.get<data>(this.apiUrlGet + "V_CXN_TYP=" + this.contype_sl + "&V_CXN_CD=" + sel_con + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=ConnectionDescription&Verb=GET").subscribe(
      res => {

        this.c_desc = res.CXN_DSC;
      });
  }
  //function to get machine description
  getmachinedesc(sel_machine) {
    this.machine_sl = sel_machine;
    this.http.get<data>(this.apiUrlGet + "V_PLATFORM_CD=" + sel_machine + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Machine&Verb=GET").subscribe(
      res => {

        this.m_desc = res.PLATFORM_DSC;
      });
  }
  //function to add a connection
  attach() {
    let body = {
      "V_PLATFORM_CD": [this.machine_sl],
      "V_SRC_CD": [this.V_SRC_CD],
      "V_CXN_CD": [this.con_sl],
      "V_USR_NM": [this.V_USR_NM],
      "V_CXN_TYP": [this.contype_sl],
      "V_COMMNT": ["Adding a Connection to a machine"],
      "REST_Service": ["Machine_Connection"],
      "Verb": ["PUT"]
    };
    this.http.post(this.apiUrlPost, body).subscribe(
      res => {
        this.toastr.success("Adding a Connection to a machine !");
        (res);
      });
  }

  //function to delete a connection
  detach() {
    this.http.get(this.apiUrlGet + "V_PLATFORM_CD=" + this.machine_sl + "&V_SRC_CD=" + this.V_SRC_CD + "&V_CXN_CD=" + this.con_sl + "&V_CXN_TYP=" + this.contype_sl + "&REST_Service=Machine_Connection&Verb=DELETE").subscribe(
      res => {
        this.toastr.warning("Deleting a Connection from a machine !");
        (res);
        this.selectedcon = undefined;
      });
  }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.getcontypes();
    this.getmachines();
    this.data.getJSON().subscribe(data => {

      this.Label = data.json();
    })
  }
}

export interface data {
  CXN_CD: string[];
  CXN_TYP: string[];
  CXN_DSC: string[];
  PLATFORM_CD: string[];
  PLATFORM_DSC: string[];
}

