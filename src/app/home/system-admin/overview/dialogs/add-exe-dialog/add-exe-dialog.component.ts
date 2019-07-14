import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-exe-dialog',
  templateUrl: './add-exe-dialog.component.html',
  styleUrls: ['./add-exe-dialog.component.scss']
})
export class AddExeDialogComponent implements OnInit {
  F_EXE_CD:string;
  F_EXE_DSC:string;
  F_EXE_SIGN:string;
  V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  F_EXE_OUT_PARAM:string;
  F_EXE_VRSN:string = "1.0";
  F_SYNC_FLG:string = "Y";
  F_EXE_S_DLMTR:string;
  F_EXE_E_DLMTR:string;
  PLF_DSC:string;
  ipart: boolean = false;
  opart: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddExeDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient) { }

  ngOnInit() {
  }
  
  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick() {
    let data = {
    "V_EXE_CD": this.F_EXE_CD,
    "V_SRC_CD": this.V_SRC_CD,
    "V_EXE_SIGN": this.F_EXE_SIGN,
    "V_PARAM_DLMTR": this.F_EXE_S_DLMTR,
    "V_PARAM_DLMTR_END":this.F_EXE_E_DLMTR,
    "V_EXE_VRSN": this.F_EXE_VRSN,
    "V_EXE_TYP": this.data.EXE_TYP,
    "V_SYNC_FLG": this.F_SYNC_FLG,
    "V_EXE_DSC": this.F_EXE_DSC,
    "V_EXE_OUT_PARAMS": this.F_EXE_OUT_PARAM,
    "V_USR_NM": this.V_USR_NM,
    "V_EXE_IN_ARTFCTS": this.ipart,
    "V_EXE_OUT_ARTFCTS":this.opart,
    "V_COMMNT": '',
    "REST_Service":["Exe"],
    "Verb":["PUT"]
  }
    this.http.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
      console.log("res",res);
    }, err => {
  
    })
  }
}
