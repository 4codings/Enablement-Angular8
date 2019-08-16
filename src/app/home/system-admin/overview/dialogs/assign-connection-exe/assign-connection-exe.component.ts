import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';
import { Globals } from '../../../../../services/globals';

@Component({
  selector: 'app-assign-connection-exe',
  templateUrl: './assign-connection-exe.component.html',
  styleUrls: ['./assign-connection-exe.component.scss']
})
export class AssignConnectionExeComponent implements OnInit {
  
  public V_SRC_CD:string;
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";

  constructor(public dialogRef: MatDialogRef<AssignConnectionExeComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService, private globals:Globals) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;

    if(this.data.isSelectedEntity == 'EXE') {
      this.getAssignedExe();
    }

    if(this.data.isSelectedEntity == 'CXN') {
      this.getAssignedCnx();
    }
  }

  onBtnSaveClick() {

  }

  getAssignedExe() {
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=EXE&SELECTED_ENTITY_ID='+this.data.selectedId+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.selectedType+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      console.log(res);
    })
  }

  getAssignedCnx() {
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=CXN&SELECTED_ENTITY_ID='+this.data.selectedId+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.selectedType+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      console.log(res);
    })
  }

}