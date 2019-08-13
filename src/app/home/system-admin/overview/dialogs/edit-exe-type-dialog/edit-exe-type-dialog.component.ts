import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-exe-type-dialog',
  templateUrl: './edit-exe-type-dialog.component.html',
  styleUrls: ['./edit-exe-type-dialog.component.scss']
})
export class EditExeTypeDialogComponent implements OnInit {
  V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  PLF_TYPE=[];
  PLF_CD;
  PLF_Data;
  V_EXE_CD_DUP='';
  isexeChange:boolean = false;

  constructor(public dialogRef: MatDialogRef<EditExeTypeDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private config:ConfigServiceService, private http:HttpClient) { }

  ngOnInit() {
    this.config.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
      (this.PLF_TYPE);
      // this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
    });
    this.PLF_Data = this.data.exeData.V_SERVER_CD.toString();
    this.V_EXE_CD_DUP = this.data.exeData.V_EXE_CD;
  }
  
  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnUpdateClick() {
    let data = {
      "V_EXE_CD": this.data.exeData.V_EXE_CD,
      "V_SRC_CD": this.V_SRC_CD,
      "V_EXE_SIGN": this.data.exeData.V_EXE_SIGN,
      "V_PARAM_DLMTR": this.data.exeData.V_PARAM_DLMTR_STRT,
      "V_PARAM_DLMTR_END":this.data.exeData.V_PARAM_DLMTR_END,
      "V_EXE_VRSN": this.data.exeData.V_EXE_VRSN,
      "V_EXE_TYP": this.data.EXE_TYP,
      "V_SYNC_FLG": this.data.exeData.V_SYNC_FLG,
      "V_EXE_DSC": this.data.exeData.V_EXE_DSC,
      "V_EXE_OUT_PARAMS": this.data.exeData.V_EXE_OUT_PARAMS,
      "V_EXE_IN_ARTFCTS": "N",
      "V_EXE_OUT_ARTFCTS": "N",
      "V_USR_NM": this.V_USR_NM,
      "V_COMMNT": '',
      "V_SERVER_CD":this.PLF_Data,
      "REST_Service":["Exe"],
      "Verb":["PUT"]
    }  
    this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
      console.log("res",res);
      this.dialogRef.close(true);
    }, err => {
      
    })
  
  }

  platformDescription(){
    
    this.config.getPlatformDescription(this.PLF_Data).subscribe(
      res=>{
        this.PLF_CD=res.json();
        (this.PLF_CD);
        this.data.exeData.V_SERVER_DSC=this.PLF_CD['SERVER_DSC'];
      });
  }

  isExeChange() {
    if(this.data.exeData.V_EXE_CD.toLowerCase() != this.V_EXE_CD_DUP.toLocaleLowerCase()) {
      this.isexeChange = true;
    } else {
      this.isexeChange = false;
    }
  }

}
