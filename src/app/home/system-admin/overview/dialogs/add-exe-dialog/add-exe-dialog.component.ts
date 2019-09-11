import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';

@Component({
  selector: 'app-add-exe-dialog',
  templateUrl: './add-exe-dialog.component.html',
  styleUrls: ['./add-exe-dialog.component.scss']
})
export class AddExeDialogComponent implements OnInit {
  F_EXE_CD:string = '';
  F_EXE_DSC:string = '';
  F_EXE_SIGN:string = '';
  V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  F_EXE_OUT_PARAM:string;
  F_EXE_VRSN:string = "1.0";
  F_SYNC_FLG:string = "Y";
  F_EXE_S_DLMTR:string = '';
  F_EXE_E_DLMTR:string = '';
  PLF_DSC:string = 'Apache Tomcat Web Server';
  ipart: boolean = false;
  opart: boolean = false;
  PLF_TYPE=[];
  PLF_CD:string = "Amazon";
  V_ICN_TYP;
  ICN_TYP;
  PLF_DATA;

  constructor(public dialogRef: MatDialogRef<AddExeDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService) { }

  ngOnInit() {
    this.config.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });

    this.config.getICN().subscribe(res => {
      this.V_ICN_TYP=res;
    });

    this.PLF_CD = this.data.platformData.SERVER_CD;
    this.PLF_DSC = this.data.platformData.SERVER_DSC;
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

  onBtnAddClick() {
    let Input = '';
    let Output = '';
    if(this.ipart) {
      Input = "Y"
    } else {
      Input = "N"
    }

    if(this.opart) {
      Output = "Y"
    } else {
      Output = "N"
    }
    let data = {
    "V_EXE_CD": this.F_EXE_CD,
    "V_SRC_CD": this.V_SRC_CD,
    "V_EXE_SIGN": this.F_EXE_SIGN,
    "V_PARAM_DLMTR_STRT": this.F_EXE_S_DLMTR,
    "V_PARAM_DLMTR_END":this.F_EXE_E_DLMTR,
    "V_EXE_VRSN": this.F_EXE_VRSN,
    "V_EXE_TYP": this.data.EXE_TYP,
    "V_SYNC_FLG": this.F_SYNC_FLG,
    "V_EXE_DSC": this.F_EXE_DSC,
    "V_EXE_OUT_PARAMS": this.F_EXE_OUT_PARAM,
    "V_USR_NM": this.V_USR_NM,
    "V_EXE_IN_ARTFCTS": Input,
    "V_EXE_OUT_ARTFCTS":Output,
    "V_SERVER_CD":this.PLF_CD,
    "V_COMMNT": '',
    "V_ICN_TYP":this.ICN_TYP,
    "REST_Service":["Exe"],
    "Verb":["PUT"]
  }
    this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
      console.log("res",res);
      this.dialogRef.close(true);
    }, err => {
  
    })
  }
}
