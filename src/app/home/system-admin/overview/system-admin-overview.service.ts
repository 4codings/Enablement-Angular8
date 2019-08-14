import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RollserviceService } from '../../../services/rollservice.service';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminOverviewService {
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  public selectedExe$: Subject<any> = new Subject();
  public selectedCxn$: Subject<any> = new Subject();
  public getExe$: Subject<any> = new Subject();
  public exes;
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

  constructor(private http:HttpClient, private rollserviceService: RollserviceService) { }

  public selectExe(exe) {
    this.selectedExe$.next(exe);
  }

  public selectCxn(cxn) {
    this.selectedCxn$.next(cxn);
  }

  public getExe() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&V_ICN_TYP=&REST_Service=Masters&Verb=GET").subscribe((res) => {
      this.exes = res;
      this.getAllExes();
    })
  }

  getAllExes() {
    var sortedAllExes = [];
    var allExes = [];
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.exes.forEach(item => {
        let arr = res.filter(data => {
          return item.EXE_TYP == data.V_EXE_TYP
        })
        allExes.push({EXE_TYP: item.EXE_TYP, EXES:arr})
      });
      sortedAllExes = allExes.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
      this.getExe$.next(sortedAllExes);
    }, err => {
    })
  }

  getMachine() {
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=MACHINES&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.machines = res;
      this.getAllMachineConnections();
    }, err => {
    })
  }

  getAllMachineConnections() {
    let connections=[];
    let sortedAllConnections = [];
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=CXNS&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe((res:any) => {
      this.exes.forEach(item => {
        let arr = res.filter(data => {
          return item.EXE_TYP == data.V_CXN_TYP
        })
        connections.push({V_PLATFORM_CD: item.EXE_TYP, V_CXN:arr});
      });
      sortedAllConnections = connections.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
      this.getMachineConnection$.next(sortedAllConnections);
    }, err => {
    })
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
}
