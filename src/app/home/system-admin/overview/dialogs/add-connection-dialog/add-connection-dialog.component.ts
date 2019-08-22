import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.scss']
})
export class AddConnectionDialogComponent implements OnInit {
  
  public connectionTypes;
  public V_SRC_CD:string;
  public V_USR_NM:string;
  public V_CXN_CD;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA; 
  public tableshow = false;
  PLF_CD:string = "Amazon";
  PLF_DSC:string = 'Apache Tomcat Web Server';
  PLF_TYPE=[];
  PLF_DATA;

  constructor(public dialogRef: MatDialogRef<AddConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService) { }

  ngOnInit() {
    this.config.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.connectionTypes = res;
    })
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
      "V_CXN_TYP":connectionData.V_CXN_TYP,
      "V_SRC_CD":this.V_SRC_CD,
      "V_USR_NM":this.V_USR_NM,
      "V_PARAM_N":V_PARAM_N,
      "V_PARAM_V":V_PARAM_V,
      "V_PLATFORM_CD":this.PLF_CD,
      "V_PLATFORM_DCS":this.PLF_DSC,
      "REST_Service":["CXN"],
      "Verb":["PUT"]
    }
  
    this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON', data).subscribe(res => {
      console.log("res",res);
      this.dialogRef.close(true);
    }, err => {
  
    })
  }

  getParams() {
    this.http.get('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.V_CXN_TYP +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
      this.tableshow = true;
      //console.log(this.DATA);
    })
  }

}
