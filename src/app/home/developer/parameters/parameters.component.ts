import { Component, OnInit } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { ConfigServiceService } from 'src/app/services/config-service.service';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { HttpClient } from '@angular/common/http';
// import { DefineDialogComponent} from './define-dialog/define-dialog.component';


@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  // styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {
  Label: any[] = [];
  constructor(private router:Router,
    private StorageSessionService:StorageSessionService,
    public dialog: MatDialog,
    private http:Http,private data:ConfigServiceService, 
    public noAuthData: NoAuthDataService,
    private userAdminService:UseradminService,
    private https:HttpClient) { }

  selectedEmoji: string;

  // openDialog() {
  //   let dialog = this.dialog.open(DefineDialogComponent, {
  //     height: '500px',
  //     width: '600px',
  //     data: this.ROLE_CD,

  //   });
    
    
  //   dialog.afterClosed().subscribe(res => {
  //       // (res.json());
  //       if (res) {

  //         ('DONE');
  //       } else {
  //         ("CANCEL");
  //         // User clicked 'Cancel' or clicked outside the dialog
  //       }
  //     });
  // }
V_USR_NM="";
V_SRC_CD="";

EXE_TYPE=[];
EXE_TYPE_R="";
EXE_CD=[];
EXE_CD_R="";
EXE_ALL=[];
//-----------form
F_EXE_CD="";
F_EXE_DSC="";
F_EXE_ID="";
F_EXE_IN_ART="";
F_EXE_OUT_ART="";
F_EXE_OUT_PARAM="";
F_EXE_SIGN="";
F_EXE_TYP = "";
F_EXE_VRSN = "";
F_EXE_E_DLMTR = "";
F_EXE_S_DLMTR = "";
F_SRC_ID = "";
F_SYNC_FLG = "";
PLF_CD = "";
PLF_DSC = "";

DUP_F_EXE_CD="";
DUP_F_EXE_DSC="";
DUP_F_EXE_ID="";
DUP_F_EXE_IN_ART="";
DUP_F_EXE_OUT_ART="";
DUP_F_EXE_OUT_PARAM="";
DUP_F_EXE_SIGN="";
DUP_F_EXE_TYP = "";
DUP_F_EXE_VRSN = "";
DUP_F_EXE_E_DLMTR = "";
DUP_F_EXE_S_DLMTR = "";
DUP_F_SRC_ID = "";
DUP_F_SYNC_FLG = "";
DUP_PLF_CD = "";
DUP_PLF_DSC = "";

showAddBtn = false;
showUpdateBtn = false;

PLF_TYPE=[];
PLF="";
ROLE_TYPE=[];
ROLE="";
ROLE_CD="";
ACCESS_RIGHT=[];
ROLE_DSC="";
DorA="Define"
execshow:boolean = true;
roleshow:boolean = false;
cr:boolean=false;
del:boolean = false;
rd:boolean = false;
up:boolean = false;
ex: boolean = false;
ipart: boolean = false;
opart: boolean = false;
public selectedExecutableType;
public selectedexecutable;

  // ROLE_DATA:any;
// this.ROLE_DATA = {
//   RL_CD: this.ROLE_CD,
//   RL: this.ROLE,
//   RL_DSC: this.ROLE_DSC,

// };
getExecutableTypeCode(){
  this.data.getExecutableType().subscribe(res=>{this.EXE_TYPE=res.json()});}
//  _____________________________________
getExecutableCode(EXE_TYPE_R){
  this.EXE_TYPE_R = EXE_TYPE_R;
  (this.EXE_TYPE_R);
            this.data.getExecutableCode(this.EXE_TYPE_R).subscribe(
              res=>{this.EXE_CD=res.json();
                (res.json());
              });
            }

//____________________________________________________            
getAllExecutable(EXE_CD_R){
  this.EXE_CD_R = EXE_CD_R;
  this.DorA = "Authorize";    //change define to authorize
  this.data.getExecutableAll(this.EXE_TYPE_R,this.EXE_CD_R).subscribe(
    (res:any)=>{
      this.EXE_ALL=JSON.parse(res._body)
      //(this.EXE_ALL);
      //console.log(this.EXE_ALL['SYNC_FLG']);
      this.F_EXE_CD=this.EXE_ALL['EXE_CD'];
      this.F_EXE_SIGN=this.EXE_ALL['EXE_SIGN'];
      this.F_EXE_OUT_PARAM=this.EXE_ALL['EXE_OUT_PARAMS'];
      this.F_EXE_DSC=this.EXE_ALL['EXE_DSC'];
      this.F_EXE_VRSN=this.EXE_ALL['EXE_VRSN'];
      this.F_EXE_S_DLMTR=this.EXE_ALL['PARAM_DLMTR_STRT'];
      this.F_EXE_E_DLMTR=this.EXE_ALL['PARAM_DLMTR_END'];
      this.F_EXE_ID = this.EXE_ALL['EXE_ID'];
      this.F_EXE_IN_ART = this.EXE_ALL['EXE_IN_ARTFCTS'];
      this.F_EXE_OUT_ART = this.EXE_ALL['EXE_OUT_ARTFCTS'];
      this.F_SRC_ID = this.EXE_ALL['SRC_ID'];
      this.F_SYNC_FLG = this.EXE_ALL['SYNC_FLG'].toString();
      this.F_EXE_TYP = this.EXE_ALL['EXE_TYP'];
      this.PLF_CD = this.EXE_ALL['SERVER_CD'].toString();
      this.PLF_DSC = this.EXE_ALL['SERVER_DSC'];

      this.DUP_F_EXE_CD=this.EXE_ALL['EXE_CD'];
      this.DUP_F_EXE_SIGN=this.EXE_ALL['EXE_SIGN'];
      this.DUP_F_EXE_OUT_PARAM=this.EXE_ALL['EXE_OUT_PARAMS'];
      this.DUP_F_EXE_DSC=this.EXE_ALL['EXE_DSC'];
      this.DUP_F_EXE_VRSN=this.EXE_ALL['EXE_VRSN'];
      this.DUP_F_EXE_S_DLMTR=this.EXE_ALL['PARAM_DLMTR_STRT'];
      this.DUP_F_EXE_E_DLMTR=this.EXE_ALL['PARAM_DLMTR_END'];
      this.DUP_F_EXE_ID = this.EXE_ALL['EXE_ID'];
      this.DUP_F_EXE_IN_ART = this.EXE_ALL['EXE_IN_ARTFCTS'];
      this.DUP_F_EXE_OUT_ART = this.EXE_ALL['EXE_OUT_ARTFCTS'];
      this.DUP_F_SRC_ID = this.EXE_ALL['SRC_ID'];
      this.DUP_F_SYNC_FLG = this.EXE_ALL['SYNC_FLG'].toString();
      this.DUP_F_EXE_TYP = this.EXE_ALL['EXE_TYP'];
      this.DUP_PLF_CD = this.EXE_ALL['SERVER_CD'].toString();
      this.DUP_PLF_DSC = this.EXE_ALL['SERVER_DSC'];
 
      if(this.F_EXE_IN_ART=="Y")
      {
        this.ipart=true;
      }
      
      if (this.F_EXE_OUT_ART == "Y") {
        this.opart = true;
      }

    }
  );
}

//_________________________________________________________________
getPlatformTypeCode(){
  ("Platform");
  this.data.getPlatformType().subscribe(res=>{this.PLF_TYPE=res.json();
    (this.PLF_TYPE);
    this.PLF_CD=this.PLF_TYPE['SERVER_CD'];
  });
  // (this.PLF_TYPE);
}
  
  platformDescription(){
    this.data.getPlatformDescription(this.PLF_CD).subscribe(
      res=>{
        this.PLF=res.json();
        (this.PLF);
        this.PLF_DSC=this.PLF['SERVER_DSC'];
      });
 }

 roleCode(){
   this.data.getRoleCode().subscribe(res=>{
     this.ROLE_TYPE=res.json();
     (this.ROLE_TYPE);
     this.ROLE_CD=this.ROLE_TYPE['ROLE_CD'];
     (this.ROLE_CD);
   }

   );
 }

  roleDescription() {
    this.data.getRoleDescription(this.ROLE_CD).subscribe(
      res => {
        (res.json());
        this.ROLE = res.json();
        this.ROLE_DSC = this.ROLE['ROLE_DSC'];
        this.accessRights();
      }
    );
  }
  accessRights(){
    this.data.getAccessRights(this.ROLE_CD, this.EXE_CD_R,this.EXE_TYPE_R).subscribe(
      res=>{
        ("Access Rights here");
        (res.json());
        this.ACCESS_RIGHT=res.json();
        if(this.ACCESS_RIGHT['CREATE']=="Y")
        {
          this.cr=true;
        }
        if (this.ACCESS_RIGHT['READ'] == "Y") {
          this.rd = true;
        }
        if (this.ACCESS_RIGHT['UPDATE'] == "Y") {
          this.up = true;
        }
        if (this.ACCESS_RIGHT['DELETE'] == "Y") {
          this.del = true;
        }
        if (this.ACCESS_RIGHT['EXECUTE'] == "Y") {
          this.ex = true;
        }
      }
    );

  }

  selectedExecutabletype(index) {
    if(this.selectedexecutable != undefined) {
      this.clearSelectedexecutable();
    }
    this.selectedExecutableType = index;
  }
  
  clearSelectedexecutable() {
    this.selectedexecutable = null;

    this.F_EXE_CD='';
    this.F_EXE_SIGN='';
    this.F_EXE_OUT_PARAM='';
    this.F_EXE_DSC='';
    this.F_EXE_VRSN='';
    this.F_EXE_S_DLMTR='';
    this.F_EXE_E_DLMTR='';
    this.F_EXE_ID = '';
    this.F_EXE_IN_ART = '';
    this.F_EXE_OUT_ART = '';
    this.F_SRC_ID = '';
    this.F_SYNC_FLG = '';
    this.F_EXE_TYP = '';
    this.PLF_CD = '';
    this.PLF_DSC = '';

    this.DUP_F_EXE_CD= '';
    this.DUP_F_EXE_SIGN= '';
    this.DUP_F_EXE_OUT_PARAM= '';
    this.DUP_F_EXE_DSC= '';
    this.DUP_F_EXE_VRSN= '';
    this.DUP_F_EXE_S_DLMTR= '';
    this.DUP_F_EXE_E_DLMTR= '';
    this.DUP_F_EXE_ID = '';
    this.DUP_F_EXE_IN_ART = '';
    this.DUP_F_EXE_OUT_ART = '';
    this.DUP_F_SRC_ID = '';
    this.DUP_F_SYNC_FLG = '';
    this.DUP_F_EXE_TYP = '';
    this.DUP_PLF_CD = '';
    this.DUP_PLF_DSC = '';
  }

  selectedExecutable(index) {
    this.selectedexecutable = index;
  }

  onDefine(){
    this.roleshow=true;
    this.execshow=false;
  }
  onDone() {
    this.roleshow = false;
    this.execshow = true;
    // this.data.sendParams().subscribe(res=>{
    //   (res.json());
    // });
  }

 
makeDefine(){
  this.DorA="Define";
}



 delExec(){
   this.data.doDelete(this.EXE_TYPE_R, this.EXE_CD_R).subscribe(res=>{
     (res.json());
   });
 }

 downloadFile() {
  this.userAdminService.downloadFile('ExeDL.xlsx');
}

fileChangeEvent(event: any, file: any) {
  const fileList: FileList = event.target.files;
  ('====================');
  (fileList.item(0));
  this.userAdminService.fileUpload(fileList.item(0), 'ExeDL.xlsx ', 'developer').subscribe(
    res => {
      (res);
      setTimeout(() => {
        //this.getUser();
        this.getAllExecutable(this.EXE_CD_R);
        //this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
      }, 3000);
  },
    error => {
      console.error(error);

    }
  );
}

uploadData() {
  document.getElementById('Document_File').click();
}

delete() {
  if(this.selectedExecutableType != undefined && this.selectedexecutable != undefined) {
    this.https.get('https://enablement.us/Enablement/rest/v1/securedJSON?V_EXE_TYP='+ this.F_EXE_TYP + '&V_EXE_CD='+ this.F_EXE_CD + '&V_SRC_CD='+ this.V_SRC_CD +'&REST_Service=Exe&Verb=DELETE').subscribe(res => {
      console.log("res",res);
      this.getExecutableTypeCode();
      this.clearSelectedexecutable();
    }, err => {
      console.log("err", err)
    }); 
  }
}

add() {
  let data = {
    "V_EXE_CD": this.F_EXE_CD,
    "V_SRC_CD": this.V_SRC_CD,
    "V_EXE_SIGN": this.F_EXE_SIGN,
    "V_PARAM_DLMTR": this.F_EXE_S_DLMTR,
    "V_PARAM_DLMTR_END":this.F_EXE_E_DLMTR,
    "V_EXE_VRSN": this.F_EXE_VRSN,
    "V_EXE_TYP": this.F_EXE_TYP,
    "V_SYNC_FLG": this.F_SYNC_FLG,
    "V_EXE_DSC": this.F_EXE_DSC,
    "V_EXE_OUT_PARAMS": this.F_EXE_OUT_PARAM,
    "V_EXE_IN_ARTFCTS": this.F_EXE_IN_ART,
    "V_EXE_OUT_ARTFCTS":this.F_EXE_OUT_ART,
    "V_USR_NM": this.V_USR_NM,
    "V_COMMNT": '',
    "V_SERVER_CD":this.PLF_CD,
    "REST_Service":["Exe"],
    "Verb":["PUT"]
  } 
  this.https.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
    console.log("res",res);
    this.getExecutableTypeCode();
    this.clearSelectedexecutable();
    this.showUpdateBtn = false;
    this.showAddBtn = false;
  }, err => {

  })
}

update() {
  let data = {
    "V_EXE_CD": this.F_EXE_CD,
    "V_SRC_CD": this.V_SRC_CD,
    "V_EXE_SIGN": this.F_EXE_SIGN,
    "V_PARAM_DLMTR": this.F_EXE_S_DLMTR,
    "V_PARAM_DLMTR_END":this.F_EXE_E_DLMTR,
    "V_EXE_VRSN": this.F_EXE_VRSN,
    "V_EXE_TYP": this.F_EXE_TYP,
    "V_SYNC_FLG": this.F_SYNC_FLG,
    "V_EXE_DSC": this.F_EXE_DSC,
    "V_EXE_OUT_PARAMS": this.F_EXE_OUT_PARAM,
    "V_EXE_IN_ARTFCTS": this.F_EXE_IN_ART,
    "V_EXE_OUT_ARTFCTS":this.F_EXE_OUT_ART,
    "V_USR_NM": this.V_USR_NM,
    "V_COMMNT": '',
    "V_SERVER_CD":this.PLF_CD,
    "REST_Service":["Exe"],
    "Verb":["PUT"]
  }  
  this.https.put('https://enablement.us/Enablement/rest/v1/securedJSON?', data).subscribe(res => {
    console.log("res",res);
    this.getExecutableTypeCode();
    this.clearSelectedexecutable();
    this.showUpdateBtn = false;
    this.showAddBtn = false;
  }, err => {
    
  })

}

executableChange() {
  
  if((this.DUP_F_EXE_CD.toString()).toLowerCase() != this.F_EXE_CD.toLowerCase()) {
    this.showAddBtn = true;
    if(this.showUpdateBtn == true) {
      this.showUpdateBtn = false;
    }
  } else {
    this.showAddBtn = false;
  }
}

executableValChange() {
  if(this.DUP_F_EXE_DSC != this.F_EXE_DSC) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_F_EXE_VRSN != this.F_EXE_VRSN) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_F_SYNC_FLG != this.F_SYNC_FLG) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_F_EXE_SIGN != this.F_EXE_SIGN) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.F_EXE_OUT_PARAM != this.F_EXE_OUT_PARAM) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_F_EXE_S_DLMTR != this.F_EXE_S_DLMTR) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_F_EXE_E_DLMTR != this.F_EXE_E_DLMTR) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else if(this.DUP_PLF_CD != this.PLF_CD) {
    if(this.showAddBtn != true) {
      this.showUpdateBtn = true;
    }
  } else {
    this.showUpdateBtn = false;
  }
}

 
//  openDefineDialog(){
//    this.router.navigateByUrl("defineRole");
//  }
  ngOnInit() {
  this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  this.getExecutableTypeCode();
  this.getPlatformTypeCode();
  this.roleCode();
  this.DorA="Define";
  this.noAuthData.getJSON().subscribe(data => {
    //console.log(data);
    this.Label = data;
  });
  // (this.ROLE_DATA);
  // this.accessRights();
  // this.roleDescription();
  //this.StorageSessionService.session_check();
  
  }

}
