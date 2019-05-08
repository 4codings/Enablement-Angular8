import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { HttpClient,HttpEvent,HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from "@angular/core";
import { Globals } from 'src/app/services/globals';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { StorageSessionService } from 'src/app/services/storage-session.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.scss']
})
export class DeploymentComponent implements OnInit {
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
  constructor(private http:HttpClient,
    private StorageSessionService:StorageSessionService,
    private data:UseradminService,private globals:Globals,
    public toastr: ToastrService, ) { 
      this.onResize();
      this.onexetypeselect = function(index){
        this.selectedcon=undefined;
        this.selectedexe=undefined;
        this.selectedexetype = index;
        
      }
        this.onmselect = function(index){
          (this.executable_sl);
          this.selectedexe = index;
        }
      this.onconselect = function(index){
        this.selectedcon = index;
      }
    }
showexebox(){  
  if(this.showexe=false ||this.executable_sl===undefined)
  {
    this.executable_sl="";
    this.selectedexe=undefined;
    this.showexe=true;
}
  else
  this.showexe=false;
}
setexecutable_sl(b){
  this.executable_sl=b;
}
    domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
    private apiUrlPost = "https://"+this.domain_name+"/rest/E_DB/SP";
    showexe:boolean=true;
    exe_type:string[];
    executables:string[];
    connections:string[];
    c_desc:string[]=[];
    e_desc:string[]=[];
    exetype_sl="";
    executable_sl="";
    con_sl="";
    
    executablestips={};
    Label:any[]=[];
    selectedexetype : Number;
    selectedexe : Number;
    selectedcon : Number;
    onexetypeselect:Function;
    onmselect: Function;
    onconselect: Function;
 
   //function to Executable_types
   getexetypes(){
     this.http.get<data>(this.apiUrlGet+"V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&SCREEN=PROFILE&REST_Service=Masters&Verb=GET").subscribe(
       res=>{
          this.exe_type=res.EXE_TYP;
          
       });
    }

  //function to get Executables
    getexecutables(a){
   this.executables=[];
      this.http.get<data>(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_EXE_TYP="+a+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=User_Executables&Verb=GET").subscribe(
        res=>{
          for(let b of res.EXE_CD){
               this.executables.push(b);   

          }
          //for getting helper text for executables 
          for(let k=0;k<=this.executables.length;k++) {
            (this.executables[k]);
            this.http.get<data>(this.apiUrlGet+"V_UNIQUE_ID=&V_EXE_TYP="+a+"&V_EXE_CD="+this.executables[k]+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Exe_Detail&Verb=GET")
            .subscribe(res=>{
              (res.EXE_TYP);
              (res.EXE_DSC);
             var name=res.EXE_CD;
             var tip=res.EXE_DSC;
              for (var i = 0; i < tip.length; i++) {
                this.executablestips[name[i]] = tip[i];
              }
            });
          }
        });

        
     }

  //function to get Connections
    getconnections(sel_exetype){
      this.c_desc=null;
      this.exetype_sl=sel_exetype;
      this.connections=[];
      this.http.get<data>(this.apiUrlGet+"V_CXN_TYP="+sel_exetype+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Connection&Verb=GET").subscribe(
        res=>{
           this.connections=res.CXN_CD;
     
        });
        
     }

     //function to get connection description
     getcondesc(sel_con){
       this.con_sl=sel_con;
       
      this.http.get<data>(this.apiUrlGet+"V_CXN_TYP="+this.exetype_sl+"&V_CXN_CD="+sel_con+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=ConnectionDescription&Verb=GET").subscribe(
        res=>{
          
          this.c_desc=res.CXN_DSC;
        });
     } 
     //function to get executable description
     getexedesc(sel_exe){
      this.executable_sl=sel_exe;
      
      this.http.get<data>(this.apiUrlGet+"V_UNIQUE_ID=&V_EXE_TYP="+this.exetype_sl+"&V_EXE_CD="+this.executable_sl+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Exe_Detail&Verb=GET").subscribe(
      res=>{
         
         this.e_desc=res.EXE_DSC;
       });
    }     
     //function to add a connection
     Link(){
              let body={
                "V_CXN_CD":this.con_sl,
                "V_CXN_TYP":this.exetype_sl,
         "V_EXE_TYP":this.exetype_sl,
         "V_EXE_CD":this.executable_sl,
          
          
         "V_SRC_CD":this.V_SRC_CD, 
         "V_USR_NM":this.V_USR_NM, 
         "V_COMMNT":"ADDED EXE TO CXN" ,
         "REST_Service":"Exe_Connection",
         "Verb":"PUT"
        }

        this.http.put(this.apiUrlPost, body).subscribe(
        res=>{
         this.toastr.success("Adding a Connection to Executable !");
         (res);
        });
     }

     //function to delete a connection  
     Delink(){
       (this.exetype_sl+" + "+this.executable_sl+" + "+this.con_sl);
        this.http.get(this.apiUrlGet+"V_EXE_CD="+this.executable_sl+"&V_EXE_TYP="+this.exetype_sl+"&V_CXN_CD="+this.con_sl+"&V_CXN_TYP="+this.exetype_sl+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Executable_Connection&Verb=DELETE").subscribe(
         res=>{
           this.toastr.warning("Deleting a Connection from Executable !");
          (res);
          this.selectedcon=undefined;
         });
     }
  ngOnInit() {
(this.V_SRC_CD);
      this.getexetypes();
(this.executablestips);
      this.data.getJSON().subscribe(data => {
                     
                this.Label=data.json();       
                   })
    }
}

export interface data{
  CXN_CD:string[];
  CXN_DSC:string[];
  EXE_TYP:string[];
  EXE_DSC:string[];
  EXE_CD:string[];
}

