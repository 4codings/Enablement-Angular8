import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { HttpClient,HttpEvent,HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from "@angular/core";
import { Globals } from '../../../services/globals';
import { StorageSessionService } from '../../../services/storage-session.service';
import { UseradminService } from '../../../services/useradmin.service2';

@Component({
  selector: 'app-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent implements OnInit {

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
  constructor(private http:HttpClient,private globals:Globals,
    private StorageSessionService:StorageSessionService,
    private data:UseradminService,
    public toastr: ToastrService, ) {

      this.onResize();
      this.onpselect = function(index){
        this.selectedplat = index;

      }
      this.onmselect = function(index){
        this.selectedmach = index;
      }
    }

    domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
    private apiUrlPost = "https://"+this.domain_name+"/rest/v1/secured";

    platforms:string[];
    machines:string[];
    installmachines:string[];
    p_desc:string[]=[];
    m_desc:string[]=[];

    platform_sl="";
    machine_sl="";
    Label:any[]=[];

    selectedplat : Number;
    selectedmach : Number;
    onpselect:Function;
    onmselect: Function;
   //function to get Platforms
   getplatforms(){
     this.http.get<data>(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_CD_TYP=SERVER&REST_Service=Masters&Verb=GET").subscribe(
       res=>{
          this.platforms=res.SERVER_CD;
       });
    }

  //function to get Machines
    getmachines(){

      this.http.get<data>(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=Users_Machines&Verb=GET").subscribe(
        res=>{
           this.machines=res.PLATFORM_CD;
        });
     }

  //function to get Installed Machines
    getinstallmachines(){

      this.http.get<data>(this.apiUrlGet+"V_PLATFORM_CD=&V_SERVER_CD="+this.platform_sl+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Platform_Deployments&Verb=GET").subscribe(
        res=>{
           this.installmachines=res.PLATFORM_CD;
           ("installed on :->"+this.installmachines);
        });
     }

     //function to get platform description
     getplatformdesc(sel_platform){
       this.platform_sl=sel_platform;

      this.http.get<data>(this.apiUrlGet+"V_CD_TYP=SERVER&V_CD="+sel_platform+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Description&Verb=GET").subscribe(
        res=>{

          this.p_desc=res.SERVER_DSC;
        });
     }
     getmachinedesc(sel_machine){
       this.machine_sl=sel_machine;
     this.http.get<data>(this.apiUrlGet+"V_PLATFORM_CD="+sel_machine+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Machine&Verb=GET").subscribe(
      res=>{

        this.m_desc=res.PLATFORM_DSC;
      });
    }
     //function to add a connection
     install(){
             let body={
              "V_PLATFORM_CD":this.machine_sl,
              "V_SRC_CD":this.V_SRC_CD,
              "V_SERVER_CD":this.platform_sl,
              "V_USR_NM":this.V_USR_NM,
              "V_COMMNT":"Deploying Platform",
             "REST_Service":"Platform_Deployment",
             "Verb":"PUT"};
       this.http.post(this.apiUrlPost, body).subscribe(
       res=>{
        this.toastr.success("Installing "+this.platform_sl+" on "+this.machine_sl+" !");
        (res);
       });
     }

     //function to delete a connection
     uninstall(){
      this.http.get(this.apiUrlGet+"V_SERVER_CD="+this.platform_sl+"&V_SRC_CD="+this.V_SRC_CD+"&V_PLATFORM_CD="+this.machine_sl+"&REST_Service=Platform_Deployment&Verb=DELETE").subscribe(
        res=>{
         this.toastr.warning("Uninstalling "+this.platform_sl+" from "+this.machine_sl+" !");
         (res);
        });

     }

    ngOnInit() {

      this.getplatforms();
      this.getmachines();
      this.data.getJSON().subscribe(data => {

        this.Label=data.json();

    })
  }
}

export interface data{
  SERVER_CD:string[];
  PLATFORM_CD:string[];
  SERVER_DSC:string[];
  PLATFORM_DSC:string[];
}

