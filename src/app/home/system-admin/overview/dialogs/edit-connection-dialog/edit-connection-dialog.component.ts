import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-connection-dialog',
  templateUrl: './edit-connection-dialog.component.html',
  styleUrls: ['./edit-connection-dialog.component.scss']
})
export class EditConnectionDialogComponent implements OnInit {
  public connectionTypes;
  public V_SRC_CD:string;
  public V_CXN_CD;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA; 
  constructor(public dialogRef: MatDialogRef<EditConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.http.get('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.data.cnxData.V_CXN_TYP +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
      console.log(this.DATA)
    })
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnEditClick(data) {
    console.log(data);
  }

}
