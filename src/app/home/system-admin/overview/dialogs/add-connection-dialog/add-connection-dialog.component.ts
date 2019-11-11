import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SystemAdminOverviewService } from '../../system-admin-overview.service';
import { startWith, map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.scss']
})
export class AddConnectionDialogComponent implements OnInit {
  
  public connectionTypes;
  public V_SRC_CD:string;
  public V_USR_NM:string;
  public V_CXN_CD = '';
  domain_name = environment.domainName;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA; 
  public tableshow = false;
  PLF_CD:string = "amazon";
  PLF_DSC:string = 'Apache Tomcat Web Server';
  PLF_TYPE=[];
  PLF_DATA;
  connectionData = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  isConnExist:boolean = true;

  constructor(public dialogRef: MatDialogRef<AddConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService, public SystemAdminOverviewService:SystemAdminOverviewService) { }

  ngOnInit() {
    this.config.getMachineCode().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
    });
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
    
    this.http.get('https://'+this.domain_name+'/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.data.selectedConnectionType +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
      this.tableshow = true;
    });

    this.PLF_CD = this.data.machineData.PLATFORM_CD;
    this.PLF_DSC = this.data.machineData.PLATFORM_DSC;

    this.connectionData = this.SystemAdminOverviewService.connectionData;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.connectionData.filter(option => option.V_CXN_CD.toLowerCase().includes(filterValue));
  }

  connChange() {
    let find = false;
    this.connectionData.filter(option => {
      if(option.V_CXN_CD.toLowerCase() == this.V_CXN_CD.toLowerCase()) {
        find = true;
      }
    });

    if(find) {
      this.isConnExist = true;
    } else {
      this.isConnExist = false;
    }
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  platformDescription(){
    
    this.config.getMachineDetails(this.PLF_CD).subscribe(
      res=>{
        this.PLF_DATA=res.json();
        (this.PLF_DATA);
        this.PLF_DSC=this.PLF_DATA['PLATFORM_DSC'];
      });
  }

  onBtnAddClick(connectionData) {
    let V_PARAM_N = '';
    let V_PARAM_V = '';
    Object.keys(connectionData).forEach((key, index) => {
      if(key == "V_CXN_CD" || key == "V_CXN_DSC" || key == "V_CXN_TYP" || key == "PLF_CD" || key == "PLF_DSC") {

      } else {
        V_PARAM_N += key + "|";
        V_PARAM_V += connectionData[key] + "|"
      }
    })
    
    var data = {
      "V_CXN_CD":connectionData.V_CXN_CD,
      "V_CXN_TYP":this.data.selectedConnectionType,
      "V_SRC_CD":this.V_SRC_CD,
      "V_USR_NM":this.V_USR_NM,
      "V_PARAM_N":V_PARAM_N,
      "V_PARAM_V":V_PARAM_V,
      "V_PLATFORM_CD":this.PLF_CD,
      "V_PLATFORM_DSC":this.PLF_DSC,
      "REST_Service":["CXN"],
      "Verb":["PUT"]
    }
  
    this.http.put('https://'+this.domain_name+'/rest/v1/securedJSON', data).subscribe(res => {
      this.dialogRef.close(true);
    }, err => {
  
    })
  }

  getParams() {
    this.http.get('https://'+this.domain_name+'/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.V_CXN_TYP +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
      this.tableshow = true;
    })
  }

}

//https://'+this.domain_name+'/rest/v1/securedJSON?V_CXN_TYP='+ this.data.selectedConnectionType +'&V_CXN_CD=undefined&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=ConnectionMachine&Verb=GET
