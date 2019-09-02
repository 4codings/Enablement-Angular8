import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ConfigServiceService } from '../../../../../services/config-service.service';
import { Globals } from '../../../../../services/globals';
import { UseradminService } from '../../../../../services/useradmin.service2';

@Component({
  selector: 'app-assign-mcn-plf',
  templateUrl: './assign-mcn-plf.component.html',
  styleUrls: ['./assign-mcn-plf.component.scss']
})
export class AssignMcnPlfComponent implements OnInit {
  
  public V_SRC_CD:string;
  public V_USR_NM:string;
  public selctedEntityId;
  public selectedplat;
  public lists;
  public clone_lists;
  public addList = [];
  public deleteList = [];
  public platforms = [];
  public machines = [];
  public Label:any[]=[];
  controlVariables;
  domain_name=this.globals.domain_name;
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/securedJSON?";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured?";

  constructor(public dialogRef: MatDialogRef<AssignMcnPlfComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http:HttpClient, private config:ConfigServiceService, private globals:Globals, private UseradminService:UseradminService) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;

    this.UseradminService.getJSON().subscribe(data => {
      this.Label=data.json();
    })

    this.http.get('../../../../../../assets/control-variable.json').subscribe(data => {
      this.controlVariables = data;
    })

    if(this.data.isSelectedEntity == 'PLATFORM') {
      this.getAssignedPlatform();
    }

    if(this.data.isSelectedEntity == 'MACHINE') {
      this.getAssignedMachine();
    }
  }

  getAssignedPlatform() {
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=PLATFORM&SELECTED_ENTITY_ID='+this.data.server.SERVER_ID+'&V_SRC_CD='+this.V_SRC_CD+'&REST_Service=Platform_Machine&Verb=GET').subscribe(res => {
      this.lists = res;
      this.clone_lists = this.deepClone(this.lists);
      this.selctedEntityId = this.data.server.SERVER_ID;
    })
  }

  getAssignedMachine() {
    this.http.get(this.apiUrlGet+'SELECTED_ENTITY=MACHINE&SELECTED_ENTITY_ID='+this.data.machine.PLATFORM_ID+'&V_SRC_CD='+this.V_SRC_CD+'&REST_Service=Platform_Machine&Verb=GET').subscribe(res => {
      this.lists = res;
      this.clone_lists = this.deepClone(this.lists);
      this.selctedEntityId = this.data.machine.SERVER_ID;
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
    if(this.data.isSelectedEntity == 'PLATFORM') {
      if(!list.is_selected) {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      } else {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }
    }

    if(this.data.isSelectedEntity == 'MACHINE') {
      if(!list.is_selected) {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      } else {
        this.lists[i].is_selected = !this.lists[i].is_selected;
      }
    }

  }

  onBtnSaveClick(): void {
    
    if(this.data.isSelectedEntity == 'PLATFORM') {
      this.deleteList = [];
      this.addList = [];
      
      this.clone_lists.forEach(data => {
        this.lists.forEach(val => {
          if(data.V_PLATFORM_ID == val.V_PLATFORM_ID && data.is_selected != val.is_selected) {
            if(data.is_selected) {
              this.deleteList.push(val.V_PLATFORM_ID);
            }
            if(!data.is_selected) {
              this.addList.push(val.V_PLATFORM_ID);
            }
          }
        })
      })
    }

    if(this.data.isSelectedEntity == 'MACHINE') {
      this.deleteList = [];
      this.addList = [];

      this.clone_lists.forEach(data => {
        this.lists.forEach(val => {
          if(data.V_SERVER_ID == val.V_SERVER_ID && data.is_selected != val.is_selected) {
            if(data.is_selected) {
              this.deleteList.push(val.V_SERVER_ID);
            }
            if(!data.is_selected) {
              this.addList.push(val.V_SERVER_ID);
            }
          }
        })
      })
    }
    console.log(this.deleteList, this.addList);
    
    let json = {
      'V_DELETED_ID_ARRAY': this.deleteList.toString(),
      'V_ADDED_ID_ARRAY': this.addList.toString(),
      'SELECTED_ENTITY': this.data.isSelectedEntity,
      'SELECTED_ENTITY_ID': this.selctedEntityId.toString(),
      "V_SRC_CD": this.V_SRC_CD,
      'REST_Service': 'Platform_Machine',
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
