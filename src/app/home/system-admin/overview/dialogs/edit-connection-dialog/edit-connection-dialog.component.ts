import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';
import { Globals } from '../../../../../services/globals';

@Component({
  selector: 'app-edit-connection-dialog',
  templateUrl: './edit-connection-dialog.component.html',
  styleUrls: ['./edit-connection-dialog.component.scss']
})
export class EditConnectionDialogComponent implements OnInit {
  public connectionTypes;
  public V_SRC_CD:string;
  public V_USR_NM:string;
  public V_CXN_CD;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA; 
  PLF_CD:string = "Amazon";
  PLF_DSC:string = 'Apache Tomcat Web Server';
  PLF_TYPE=[];
  PLF_DATA;
  V_CXN_CD_DUP='';
  iscnxChange:boolean = false;
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(public dialogRef: MatDialogRef<EditConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService, private globals:Globals) { }

  ngOnInit() {
    this.config.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM; 
    this.http.get('https://enablement.us/Enablement/rest/v1/securedJSON?V_CXN_TYP='+ this.data.cnxData.V_CXN_TYP +'&V_CXN_CD='+ this.data.cnxData.V_CXN_CD +'&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=ConnectionMachine&Verb=GET').subscribe(res => {
      this.DATA = res;
    });

    this.V_CXN_CD_DUP = this.data.cnxData.V_CXN_CD;
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  platformDescription(){
    
    this.config.getPlatformDescription(this.PLF_CD).subscribe(
      res=>{
        this.PLF_DATA=res.json();
        (this.PLF_DATA);
        this.PLF_DSC=this.PLF_DATA['SERVER_DSC'];
      });
  }

  onBtnEditClick(connectionData) {
    console.log(connectionData);
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
      "V_CXN_DSC":connectionData.V_CXN_DSC,
      "V_CXN_TYP":this.data.cnxData.V_CXN_TYP,
      "V_SRC_CD":this.V_SRC_CD,
      "V_USR_NM":this.V_USR_NM,
      "V_PARAM_N":V_PARAM_N,
      "V_PARAM_V":V_PARAM_V,
      "V_PLATFORM_CD":this.PLF_CD,
      "V_PLATFORM_DCS":this.PLF_DSC,
      "REST_Service":["CXN"],
      "Verb":["PUT"]
    }
    this.http.put(this.apiUrlGet, data).subscribe(res => {
      console.log("res",res);
      this.dialogRef.close(true);
    }, err => {
  
    })
  }

  isCnxChange() {
    if(this.data.cnxData.V_CXN_CD.toLowerCase() != this.V_CXN_CD_DUP.toLocaleLowerCase()) {
      this.iscnxChange = true;
    } else {
      this.iscnxChange = false;
    }
  }

}
