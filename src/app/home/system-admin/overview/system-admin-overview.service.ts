import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from '../../../services/rollservice.service';
import { Globals } from '../../../services/globals';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminOverviewService {
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  public selectedExe$: Subject<any> = new Subject();
  public selectedCxn$: Subject<any> = new Subject();
  public getExe$: Subject<any> = new Subject();
  public exes;
  public exesData;
  public connectionData;
  public plat;
  public getMachineConnection$: Subject<any> = new Subject();
  public machines;
  ctrl_variables: any;
  role_status:boolean=false;
  role_install:boolean=false;
  role_machineConnection:boolean=false;
  role_deployment:boolean=false;
  role_connection:boolean=false;
  role_machine:boolean=false;
  role_machineSpec:boolean=false;
  role_platform:boolean=false;
  role_overview:boolean = false;
  exeTypeOptions;
  public typeOptions$: Subject<any> = new Subject();
  public platformOptions$: Subject<any> = new Subject();
  public machineOptions$: Subject<any> = new Subject();
  domain_name=this.globals.domain_name;

  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(private http:HttpClient, private rollserviceService: RollserviceService, private globals:Globals) { }

  public selectExe(exe) {
    this.selectedExe$.next(exe);
    this.selectedCxn$.next(null);
  }

  public selectCxn(cxn) {
    this.selectedCxn$.next(cxn);
    this.selectedExe$.next(null);
  }

  public getExe() {
    this.getPlatforms();
    this.getMachine();
    this.http.get(this.apiUrlGet + "V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res) => {
      //console.log("exe", res);
      this.exes = res;
      this.getAllExes();
      this.getAllMachineConnections();
      this.exeTypeOptions = res;
      //this.exeTypeOptions.push({EXE_TYP:"All"});
      this.exeTypeOptions = this.exeTypeOptions.sort((a,b) => {
        if (a.EXE_TYP < b.EXE_TYP) //sort string ascending
          return -1;
        if (a.EXE_TYP > b.EXE_TYP)
          return 1;
        return 0; 
      });
      this.typeOptions$.next(this.exeTypeOptions);
    })
  }

  getAllExes() {
    var sortedAllExes = [];
    var allExes = [];
    this.http.get(this.apiUrlGet + "V_CD_TYP=EXES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      // this.exes.forEach(item => {
      //   let arr = res.filter(data => {
      //     return item.EXE_TYP == data.V_EXE_TYP
      //   })
      //   allExes.push({EXE_TYP: item.EXE_TYP, EXES:arr})
      // });
      this.exesData = res;
      this.plat.forEach(item => {
        let arr = [];
        res.filter(data => {
          data.V_SERVER_CD.forEach(data1 => { 
            if(item.SERVER_CD == data1) {
              arr.push(data);
            }
          })
        })
        allExes.push({SERVER_TYP: item, EXES:arr})
      });
      sortedAllExes = allExes.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
      this.getExe$.next(sortedAllExes);
      //console.log("sortedAllExes", sortedAllExes);
    }, err => {
       console.log(err);
    })
  }
   
  getMachine() {
    let arr = [];
    this.http.get(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_USR_NM="+this.V_USR_NM+"&REST_Service=Users_Machines&Verb=GET").subscribe((res:any)=>{
      this.machines=res;
      
      res.forEach((item) => {
        arr.push(Object.assign({}, item));
      });
    
      arr.push({CREATE: "", DELETE: "", EXECUTE: "", PLATFORM_CD: "All", PLATFORM_ID: '', READ: "", UPDATE: ""});
      arr = arr.sort((a,b) => {
        if (a.PLATFORM_CD < b.PLATFORM_CD) //sort string ascending
          return -1;
        if (a.PLATFORM_CD > b.PLATFORM_CD)
          return 1;
        return 0; 
      });
      
      this.machineOptions$.next(arr);
    });
  }

  getAllMachineConnections() {
    let connections=[];
    let sortedAllConnections = [];
    this.http.get(this.apiUrlGet + "V_CD_TYP=CXNS&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      // this.exes.forEach(item => {
      //   let arr = res.filter(data => {
      //     return item.EXE_TYP == data.V_CXN_TYP
      //   })
      //   connections.push({V_PLATFORM_CD: item.EXE_TYP, V_CXN:arr});
      // });
      this.connectionData = res;
      this.machines.forEach(item => {
        let arr = []
        res.filter(data => {
          data.V_PLATFORM_CD.forEach(data1 => {
            if(item.PLATFORM_CD == data1) {
              arr.push(data);
            }
          })
        })
        connections.push({PLATFORM_TYP: item, V_CXN:arr})
      });
      sortedAllConnections = connections.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
      this.getMachineConnection$.next(sortedAllConnections);
      //console.log("connections", sortedAllConnections);
    }, err => {
       console.log(err);
    })
  }
  
  getTypes() {
    this.http.get(this.apiUrlGet + "V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.exeTypeOptions = res;
      this.exeTypeOptions.push({EXE_TYP:"All"});
      this.exeTypeOptions = this.exeTypeOptions.sort((a,b) => {
        if (a.EXE_TYP < b.EXE_TYP) //sort string ascending
          return -1;
        if (a.EXE_TYP > b.EXE_TYP)
          return 1;
        return 0; 
      });
      this.typeOptions$.next(this.exeTypeOptions);
    }, err => {
      console.log(err);
    });
  }

  getPlatforms(){
    let arr = [];
    this.http.get(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_CD_TYP=SERVER&REST_Service=Masters&Verb=GET").subscribe(
      (res:any)=>{
        this.plat=res;
        res.forEach((item) => {
          arr.push(Object.assign({}, item));
        });
        arr.push({SERVER_CD:"All", SERVER_DSC:'', SERVER_Id:''});
        arr = arr.sort((a,b) => {
          if (a.SERVER_CD < b.SERVER_CD) //sort string ascending
            return -1;
          if (a.SERVER_CD > b.SERVER_CD)
            return 1;
          return 0; 
        });
        
        this.platformOptions$.next(arr);
      });
  }
  
  getRollAccess() {
    this.rollserviceService.getRollCd().then((res) => {
      this.http.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        res.map((role) => {
          switch (role) {
            case 'Enablement System Admin Status Role':
              if (this.ctrl_variables.show_SystemAdminStatusTab) {
                this.role_status = true;
              }
              break;
            case 'Enablement System Admin Install Role':
              if (this.ctrl_variables.show_SystemAdminInstallTab) {
                this.role_install = true;
              }
              break;
            case 'Enablement System Admin Machine Connection Role':
              if (this.ctrl_variables.show_SystemAdminMachineConnectionTab) {
                this.role_machineConnection = true;
              }
              break;
            case 'Enablement System Admin Deployment Role':
              if (this.ctrl_variables.show_SystemAdminDeploymentTab) {
                this.role_deployment = true;
              }
              break;
            case 'Enablement System Admin Connection Role':
              if (this.ctrl_variables.show_SystemAdminConnectionTab) {
                this.role_connection = true;
              }
              break;
            case 'Enablement System Admin Machine Role':
              if (this.ctrl_variables.show_SystemAdminMachineTab) {
                this.role_machine = true;
              }
              break;
            case 'Enablement System Admin Machine Specs Role':
              if (this.ctrl_variables.show_SystemAdminMachineSpecTab) {
                this.role_machineSpec = true;
              }
              break;
            case 'Enablement System Admin Platform Role':
              if (this.ctrl_variables.show_SystemAdminPlatformTab) {
                this.role_platform = true;
              }
              break;
            case 'Enablement System Admin Overview Role':
              if (this.ctrl_variables.show_SystemAdminOverViewTab) {
                this.role_overview = true;
              }
              break;  
            default:
              break;
          }
        });
      });
    });
  }

  addExe(body) {
    return this.http.put(this.apiUrlPut, body)
  }

  addCxn(body) {
    return this.http.put(this.apiUrlPut, body)
  }
}
