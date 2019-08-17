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
  public lists;
  public addList = [];
  public deleteList = [];
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
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
    console.log(this.data);
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=EXE&SELECTED_ENTITY_ID='+this.data.exe.exeData.V_EXE_ID+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.exe.EXE_TYP+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      this.lists = res;
    })
  }

  getAssignedCnx() {
    console.log(this.data);
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=CXN&SELECTED_ENTITY_ID='+this.data.cxn.cnxData.V_CXN_ID+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.cxn.cnxData.V_CXN_TYP+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      this.lists = res;
    })
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  changeAssignItem(list, i) {
    console.log("list", list);
    if(this.data.isSelectedEntity == 'CXN') {
      if(list.is_selected = "FALSE") {
        this.addList.push(list.V_EXE_ID);
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }

      if(list.is_selected = "TRUE") {
        this.deleteList.push(list.V_EXE_ID);
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }
    }

    if(this.data.isSelectedEntity == 'EXE') {
      console.log("list", list);
      if(list.is_selected == "FALSE") {
        this.addList.push(list.V_CXE_ID);
        this.lists[i].is_selected = !this.lists[i].is_selected;
        console.log(this.addList);
      }

      if(list.is_selected == "TRUE") {
        this.deleteList.push(list.V_CXE_ID); 
        this.lists[i].is_selected = !this.lists[i].is_selected;
        console.log(this.addList);
      }
    }

  }

}