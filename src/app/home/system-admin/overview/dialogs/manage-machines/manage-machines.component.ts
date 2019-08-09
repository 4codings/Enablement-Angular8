import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { Globals } from 'src/app/services/globals';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';

@Component({
  selector: 'app-manage-machines',
  templateUrl: './manage-machines.component.html',
  styleUrls: ['./manage-machines.component.scss']
})
export class ManageMachinesComponent implements OnInit {

  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  V_BASE_ID: string[] = null;

  constructor(private http: HttpClient, 
    public dialogRef: MatDialogRef<ManageMachinesComponent>,  @Inject(MAT_DIALOG_DATA) public data: any,
    private data2:UseradminService,private globals:Globals,
    private StorageSessionService: StorageSessionService,
    private data3: ConfigServiceService) { }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrl = "https://"+this.domain_name+"/rest/v1/secured";


  PLF_DATA = [];
  PLF_DETAILS = [];
  PLATFORM_CD = "";
  Selected;
  PLATFORM_DSC = "";
  PLATFORM_CAP = "";
  RATING = "";
  VRTL_FLG = "";
  EFF_END_DT_TM = "";
  EFF_STRT_DT_TM = "";
  MODESTATUS = "";
  STATE_FLG = "";
  PLATFORM_CD_DUP = "";
  PLATFORM_DSC_DUP = "";
  PLATFORM_CAP_DUP = "";
  RATING_DUP = "";
  VRTL_FLG_DUP = "";
  EFF_END_DT_TM_DUP = "";
  EFF_STRT_DT_TM_DUP = "";
  MODESTATUS_DUP = "";
  STATE_FLG_DUP = "";
  // virtual: boolean = false;
  isMachineChange:boolean = false;
  isMachineDesChange:boolean = false;


  PLF = "";

  Label:any[]=[];
  MachineCode() {
    ("Machine List!");
    this.data3.getMachineCode().subscribe(res => {
      ("Machine List!");
      this.PLF_DATA = res.json();
      (this.PLF_DATA);

    });
  }
  machineDetails() {
    ("Hello");
    ("Machine DETAILS");
    this.Selected = this.PLATFORM_CD;
    this.PLATFORM_CD_DUP = this.PLATFORM_CD;
    this.isMachineChange = false;
    this.isMachineDesChange =false;
    this.data3.getMachineDetails(this.PLATFORM_CD).subscribe(res => {
      // ("Machine List!");
      this.PLF_DETAILS = res.json();
      (this.PLF_DETAILS);
      this.PLATFORM_DSC = this.PLF_DETAILS['PLATFORM_DSC'].toString();
      this.PLATFORM_CAP = this.PLF_DETAILS['PLATFORM_CAP'];
      this.RATING = this.PLF_DETAILS['RATING'];
      this.EFF_STRT_DT_TM = this.PLF_DETAILS['EFF_STRT_DT_TM'];
      this.EFF_END_DT_TM = this.PLF_DETAILS['EFF_END_DT_TM'];
      this.VRTL_FLG = this.PLF_DETAILS['VRTL_FLG'].toString();
      this.MODESTATUS = this.PLF_DETAILS['MODESTATUS'].toString();

      this.STATE_FLG = this.PLF_DETAILS['STATE_FLG'].toString();

      this.PLATFORM_DSC_DUP = this.PLF_DETAILS['PLATFORM_DSC'].toString();
      this.PLATFORM_CAP_DUP = this.PLF_DETAILS['PLATFORM_CAP'];
      this.RATING_DUP = this.PLF_DETAILS['RATING'];
      this.EFF_STRT_DT_TM_DUP = this.PLF_DETAILS['EFF_STRT_DT_TM'];
      this.EFF_END_DT_TM_DUP = this.PLF_DETAILS['EFF_END_DT_TM'];
      this.VRTL_FLG_DUP = this.PLF_DETAILS['VRTL_FLG'].toString();
      this.MODESTATUS_DUP = this.PLF_DETAILS['MODESTATUS'].toString();

      this.STATE_FLG_DUP = this.PLF_DETAILS['STATE_FLG'].toString();

      // if (this.VRTL_FLG == "Y") {
      //   this.virtual = true;
      // }

    });
  }
  ngOnInit() {
    this.MachineCode();
    this.data2.getJSON().subscribe(data2 => { 
    this.Label=data2.json();    
        })
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  addMachine() {
    let body={
      "V_PLATFORM_CD":this.PLATFORM_CD,
      "V_SRC_CD":this.V_SRC_CD,
      "V_PLATFORM_CAP":this.PLATFORM_CAP,
      "V_RATING":this.RATING,
      "V_EFF_STRT_DT_TM":this.EFF_STRT_DT_TM,
      "V_EFF_END_DT_TM":this.EFF_END_DT_TM,
      "V_USR_NM":this.V_USR_NM,
      "V_PLATFORM_DSC":this.PLATFORM_DSC,
      "VRTL_FLG":this.VRTL_FLG,
      "MODESTATUS": this.MODESTATUS,
      "STATE_FLG": this.STATE_FLG,
      "REST_Service":["Machine_Auths"],
      "Verb":["PUT"]
    };
  
    this.http.put(this.apiUrl,body).subscribe(
      res=>{
        (res);
        (body);
        this.dialogRef.close();
    });
  }

  updateMachine() {
    let body={
      "V_PLATFORM_CD":this.PLATFORM_CD,
      "V_SRC_CD":this.V_SRC_CD,
      "V_PLATFORM_CAP":this.PLATFORM_CAP,
      "V_RATING":this.RATING,
      "V_EFF_STRT_DT_TM":this.EFF_STRT_DT_TM,
      "V_EFF_END_DT_TM":this.EFF_END_DT_TM,
      "V_USR_NM":this.V_USR_NM,
      "V_PLATFORM_DSC":this.PLATFORM_DSC,
      "VRTL_FLG":this.VRTL_FLG,
      "MODESTATUS": this.MODESTATUS,
      "STATE_FLG": this.STATE_FLG,
      "REST_Service":["Machine_Auths"],
      "Verb":["PUT"]
    };
  
    this.http.put(this.apiUrl,body).subscribe(
      res=>{
        (res);
        (body);
        this.dialogRef.close();
    });
  }

  deleteMachine() {
    this.http.delete(this.apiUrl+"/V_PLATFORM_CD="+this.PLATFORM_CD+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Machine&Verb=DELETE").subscribe(
    res=>{
      (res);
      this.dialogRef.close();
    });
  }

  machineChange() {
    if(this.PLATFORM_CD.toLowerCase() != this.PLATFORM_CD_DUP.toLowerCase()) {
      this.isMachineChange = true;
    } else {
      this.isMachineChange = false;
    }
  }
  
  machineDesChange() {
    if(this.PLATFORM_DSC.toLowerCase() != this.PLATFORM_DSC_DUP.toLowerCase()) {
      this.isMachineDesChange = true;
    } else {
      this.isMachineDesChange = false;
    }
  }

  isValid() {
    if(this.PLATFORM_CD == '') {
      return true;
    } else if(this.PLATFORM_DSC == '') {
      return true;
    } else if(this.PLATFORM_CAP == '') {
      return true;
    } else if(this.RATING == '') {
      return true;
    } else if(this.EFF_STRT_DT_TM == '') {
      return true;
    } else if(this.EFF_END_DT_TM == '') {
      return true;
    } else if(this.VRTL_FLG == '') {
      return true;
    } else if(this.MODESTATUS == '') {
      return true;
    } else if(this.STATE_FLG == '') {
      return true;
    } else {
      return false;
    }
  }

}
