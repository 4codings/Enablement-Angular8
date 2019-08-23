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
  public clone_lists;
  public addList = [];
  public deleteList = [];
  controlVariables;
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured?";

  constructor(public dialogRef: MatDialogRef<AssignConnectionExeComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService, private globals:Globals) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;

    this.http.get('../../../../../../assets/control-variable.json').subscribe(data => {
      this.controlVariables = data;
    })

    if(this.data.isSelectedEntity == 'EXE') {
      this.getAssignedExe();
    }

    if(this.data.isSelectedEntity == 'CXN') {
      this.getAssignedCnx();
    }
  }

  getAssignedExe() {
    console.log(this.data);
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=EXE&SELECTED_ENTITY_ID='+this.data.exe.exeData.V_EXE_ID+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.exe.EXE_TYP+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      this.lists = res;
      this.clone_lists = this.deepClone(this.lists);
    })
  }

  getAssignedCnx() {
    console.log(this.data);
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=CXN&SELECTED_ENTITY_ID='+this.data.cxn.cnxData.V_CXN_ID+'&V_SRC_CD='+this.V_SRC_CD+'&V_TYP='+this.data.cxn.cnxData.V_CXN_TYP+'&REST_Service=EXE_CXN&Verb=GET').subscribe(res => {
      this.lists = res;
      this.clone_lists = this.deepClone(this.lists);
    })
  }

  deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  changeAssignItem(list, i) {
    if(this.data.isSelectedEntity == 'CXN') {
      if(!list.is_selected) {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      } else {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }
    }

    if(this.data.isSelectedEntity == 'EXE') {
      if(!list.is_selected) {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      } else {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }
    }

  }

  onBtnSaveClick(): void {
    let selctedEntityId ;
    let type;
    
    if(this.data.isSelectedEntity == 'EXE') {
      selctedEntityId = this.data.exe.exeData.V_EXE_ID;
      type = this.data.exe.EXE_TYP;
      this.deleteList = [];
      this.addList = [];
      
      this.clone_lists.forEach(data => {
        this.lists.forEach(val => {
          if(data.V_CXN_ID == val.V_CXN_ID && data.is_selected != val.is_selected) {
            if(data.is_selected) {
              this.deleteList.push(val.V_CXN_ID);
            }
            if(!data.is_selected) {
              this.addList.push(val.V_CXN_ID);
            }
          }
        })
      })
    }

    if(this.data.isSelectedEntity == 'CXN') {
      this.deleteList = [];
      this.addList = [];
      selctedEntityId = this.data.cxn.cnxData.V_CXN_ID;
      type = this.data.cxn.cnxData.V_CXN_TYP;

      this.clone_lists.forEach(data => {
        this.lists.forEach(val => {
          if(data.V_EXE_ID == val.V_EXE_ID && data.is_selected != val.is_selected) {
            if(data.is_selected) {
              this.deleteList.push(val.V_EXE_ID);
            }
            if(!data.is_selected) {
              this.addList.push(val.V_EXE_ID);
            }
          }
        })
      })
    }
    //console.log(this.deleteList, this.addList);
    
    let json = {
      'V_DELETED_ID_ARRAY': this.deleteList.toString(),
      'V_ADDED_ID_ARRAY': this.addList.toString(),
      'SELECTED_ENTITY': this.data.isSelectedEntity,
      'SELECTED_ENTITY_ID': selctedEntityId,
      "V_TYP": type,
      "V_SRC_CD": this.V_SRC_CD,
      'V_EFF_STRT_DT_TM': new Date(Date.now()),
      'V_EFF_END_DT_TM': new Date(Date.now() + this.controlVariables.effectiveEndDate),
      'REST_Service': 'EXE_CXN',
      'Verb': 'PUT'
    };

    this.http.post(this.apiUrlGet, json).subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    }, error => {
    });
    
  }

}