import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material';
import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef, MatCell, MatCellDef
} from '@angular/material';
import { HostListener } from "@angular/core";
import { Globals } from 'src/app/services/globals';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';


@Component({
  selector: 'app-deploy-status',
  templateUrl: './deploy-status.component.html',
  styleUrls: ['./deploy-status.component.scss']
})
export class DeployStatusComponent implements OnInit {
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
  constructor(
    private http: HttpClient,
    private https: Http,private globals:Globals,
    private data2:UseradminService,
    private StorageSessionService: StorageSessionService,
    private data: ConfigServiceService ){ 
      this.onResize();
    }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/";

  APP_CD=[];
  APP_DATA=[];
  SL_APP_CD="";
  PRCS_DATA=[];
  PRCS_CD=[];
  SL_PRCS_CD="";
  SRVC_DATA=[];
  SRVC_CD=[];
  SL_SRVC_CD="";
  deployTableDT: any[]=[];
  deployData:any[];
  ID_DATA=[];
  APP_ID=[];
  PRCS_ID=[];
  SRVC_ID=[];
  SRC_ID=[];
  SL_APP_ID="";
  SL_PRCS_ID="";
  SL_SRVC_ID="";
  SL_SRC_ID="";
   
  Label:any[]=[];


  displayedNames = ['Service', 'Platform', 'Machine', 'Limited Job', 'Instances', 'Limited', 'Capacity', 'Rating', 'Used Capacity', 'Limited Machine Use', 'Dummy', 'Status', 'State', 'Cxn Type'];

  displayedColumns = ['Service', 'Platform', 'Machine', 'Lim_Job', 'Instances', 'Limited', 'Capacity', 'Rating', 'Used_Cap', 'Lim_Mach_Use', 'Dummy', 'Status', 'State','Cxn_Type'];
  dataSource = new MatTableDataSource();



  getApplicationCode(){
    this.data.applicationCode().subscribe(res=>{
      (res.json());
      this.APP_DATA=res.json();
      this.APP_CD=this.APP_DATA['APP_CD'];

    });
  }
  selectedapp='';
  getProcessCode(app){
    this.selectedapp=app;
    this.SL_APP_CD=app;
    this.data.processCode(this.SL_APP_CD).subscribe(res=>{
      (res.json());
      this.PRCS_DATA=res.json();
       this.PRCS_CD=this.PRCS_DATA['PRCS_CD'];
      //  this.getServiceCode();
      
    });
  }

  UNIQUE_ID=[];

 c: number ;
  b:number;
  selectedprcs='';
  getServiceCode(prcs) {
    this.selectedprcs=prcs;
    this.SL_PRCS_CD=prcs;
    this.data.serviceCode(this.SL_APP_CD,this.SL_PRCS_CD).subscribe(res => {
      (res.json());
      this.SRVC_DATA = res.json();
      this.SRVC_CD = this.SRVC_DATA['SRVC_CD'];
      (this.SRVC_CD);
      
      this.getIdCode();
    });
  }
getIdCode(){
    this.b=0;
    this.c=0;
    for(let j = 0; j < this.SRVC_CD.length; j++)
    {
      this.SL_SRVC_CD = this.SRVC_CD[j];
      this.data.getID(this.SL_APP_CD, this.SL_PRCS_CD, this.SL_SRVC_CD).subscribe(res => {
        (res.json());

        
        
        this.ID_DATA = res.json();
        this.APP_ID = this.ID_DATA['V_APP_ID'];
        // this.SL_APP_ID = this.APP_ID[0];

        this.PRCS_ID = this.ID_DATA['V_PRCS_ID'];
        // this.SL_PRCS_ID = this.PRCS_ID[0];

        this.SRC_ID = this.ID_DATA['V_SRC_ID'];
        // this.SL_SRC_ID = this.SRC_ID[0];

        this.SRVC_ID = this.ID_DATA['V_SRVC_ID'];
        this.UNIQUE_ID = this.ID_DATA['V_UNIQUE_ID'];

        // (this.SRVC_ID);
        // (this.SL_APP_ID);
        // (this.SL_PRCS_ID);
        // (this.SL_SRVC_ID);
        // (this.SL_SRC_ID);

         this.getDeployment();
        // this.dataSource.data = this.deployTableDT;

      });

    }
  }


  getDeployment(){
    // (this.SL_APP_CD);
    // (this.SL_PRCS_CD);

  
    // this.data.getDeployStatus(this.SL_SRC_ID,this.SL_APP_ID, this.SL_PRCS_ID, this.SRVC_ID).subscribe(res => {
    //   (res.json());

    //   // this.dataSource.data = this.deployTableDT;

    // });

   
    //for (let i = 0; i < this.SRVC_ID.length; i++) {
      //this.SL_SRVC_ID = this.SRVC_ID[i];

      // (this.SL_SRVC_ID);
      this.data.getDeployStatus(this.UNIQUE_ID, this.SRC_ID, this.APP_ID, this.PRCS_ID, this.SRVC_ID).subscribe(res => {
        (res.json());
        this.deployData=res.json();
        // this.deployTableDT[j]=this.deployData;
        // (this.deployData['CXN_ID']);
        // this.checkifempty = this.deployData['CXN_ID'];
        // (this.checkifempty);
        if (this.deployData['CXN_ID'].length === 1){
          ("inside if");
          this.deployTableDT[this.b] = {
            Service: this.deployData['SRVC_CD'],
            Platform: this.deployData['SERVER_CD'],
            Machine: this.deployData['PLATFORM_CD'],
            Lim_Job: this.deployData['SRVC_JOB_LMT'],
            Instances: this.deployData['SRVC_INST_COUNT'],
            Limited: this.deployData['SRVC_LMT_FLG'],
            Capacity: this.deployData['PLATFORM_CAP'],
            Rating: this.deployData['RATING'],
            Used_Cap: this.deployData['CAP_UTLZD'],
            Lim_Mach_Use: this.deployData['PLATFORM_LMT_FLG'],
            Dummy: this.deployData['VRTL_FLG'],
            Status: this.deployData['MODESTATUS'],
            State: this.deployData['STATE_FLG'],
            Cxn_Type: this.deployData['CXN_TYP']
            


          }
          this.b++;
        }

        // this.c++;
        this.dataSource.data = this.deployTableDT;
        

      });
      
      
      
    //}
           

    ("DEPLOY TABLE HERE!!!");
    (this.deployTableDT);
    // (this.deployTableDT['CXN_ID']);

    // for (let index = 0; index < this.deployTableDT.length; index++) {
    //   (this.deployTableDT[index]);
    //   ("Hellloooo");
      
    // }
    
    

    
  }

  ngOnInit() {
    this.getApplicationCode();
    this.data2.getJSON().subscribe(data2 => {  
              
            this.Label=data2.json();      
            
             })
    // this.getServiceCode();

  }

}
