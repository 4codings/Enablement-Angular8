import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.scss']
})
export class AddConnectionDialogComponent implements OnInit {
  
  public connectionTypes;
  public V_SRC_CD:string;
  public V_CXN_CD;
  public V_CXN_DSC;
  public V_CXN_TYP;
  public DATA; 
  public tableshow = false;

  constructor(public dialogRef: MatDialogRef<AddConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.http.get("https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=EXE&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Masters&Verb=GET").subscribe(res => {
      this.connectionTypes = res;
    })
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick(connectionData) {
    console.log(connectionData);
  }

  getParams() {
    this.http.get('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD='+ this.V_SRC_CD +'&V_CXN_TYP='+ this.V_CXN_TYP +'&REST_Service=Params_of_CXN_Type&Verb=GET').subscribe(res => {
      this.DATA = res;
      this.tableshow = true;
    })
  }

}
