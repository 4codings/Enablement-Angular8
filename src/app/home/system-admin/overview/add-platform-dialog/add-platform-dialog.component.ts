import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../../../services/globals';

@Component({
  selector: 'app-add-platform-dialog',
  templateUrl: './add-platform-dialog.component.html',
  styleUrls: ['./add-platform-dialog.component.scss']
})
export class AddPlatformDialogComponent implements OnInit {
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  screenHeight=0;
  screenWidth=0;
  mobileView=false;
  desktopView=true;
  isPlatformChange:boolean = false;
  isPlatformDesChange:boolean = false;
  EFF_END_DT_TM;
  EFF_STRT_DT_TM;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if(this.screenWidth<=767)
      {
        this.mobileView=true;
        this.desktopView=false;
      }else{
        this.mobileView=false;
        this.desktopView=true;
      }
  }
  constructor(public dialogRef: MatDialogRef<AddPlatformDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,private globals:Globals,
  private StorageSessionService: StorageSessionService) {
    this.onResize();
    this.onpselect = function(index){
      this.selectedplat = index;
    }
  }

  domain_name=this.globals.domain_name; private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPost = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrlPut = "https://"+this.domain_name+"/rest/v1/secured";
  private apiUrldelete = "https://"+this.domain_name+"/rest/v1/secured";

  plat:string[]=[];
  p_plat:string[]=[];
  p_desc:string[]=[];
  p_plat_dup:string[]=[];
  p_desc_dup:string[]=[];
  onpselect:Function;
  selectedplat:Number;
  progress:boolean;

  platFormChange() {
    if(this.p_plat != this.p_plat_dup) {
      this.isPlatformChange = true;
    } else {
      this.isPlatformChange = false;
    }
  }
  
  platFormDesChange() {
    if(this.p_desc.length != this.p_desc_dup[0].length) {
      this.isPlatformDesChange = true;
    } else {
      this.isPlatformDesChange = false;
    }
  }

  getPlatforms(){
    this.http.get<data>(this.apiUrlGet+"V_SRC_CD="+this.V_SRC_CD+"&V_CD_TYP=SERVER&REST_Service=Masters&Verb=GET").subscribe(
      res=>{
        this.plat=res.SERVER_CD;
      });
  }
  dataplat(){

  }
 
  getplatformdesc(p){
    this.http.get<data>(this.apiUrlGet+"V_CD_TYP=SERVER&V_CD="+p+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Description&Verb=GET").subscribe(
      res=>{
        this.p_plat=res.SERVER_CD;
        this.p_desc=res.SERVER_DSC;
        this.p_plat_dup=res.SERVER_CD;
        this.p_desc_dup=res.SERVER_DSC;
      });
  }
  addplat(){
    let body={
      "V_SERVER_CD":this.p_plat,
      "V_SRC_CD":this.V_SRC_CD,
      "V_SERVER_DSC":this.p_desc,
      "V_EFF_STRT_DT_TM":this.EFF_STRT_DT_TM,
      "V_EFF_END_DT_TM":this.EFF_END_DT_TM,
      "REST_Service":"Platform_Master",
      "Verb":"PUT"
    };

    this.http.put(this.apiUrlPut,body).subscribe(
      res=>{
        (res);
        (body);
        this.dialogRef.close();
      });
  }
  
  updateplat() {
    
  }
 
  deleteplat(){
  this.http.delete(this.apiUrlGet+"V_SERVER_CD="+this.p_plat+"&V_SRC_CD="+this.V_SRC_CD+"&REST_Service=Platform_Master&Verb=DELETE").subscribe(
    res=>{
      (res);
      this.dialogRef.close();
    });
  }

  ngOnInit() {
    this.getPlatforms();
    this.p_plat=this.data.SERVER_CD;
    this.p_desc=this.data.SERVER_DSC;
    this.p_plat_dup=this.data.SERVER_CD;
    this.p_desc_dup=this.data.SERVER_DSC;
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick() {

  }
}
export interface data{
  SERVER_CD:string[];
  SERVER_DSC:string[];
}

