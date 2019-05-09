import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Http, ResponseContentType } from '@angular/http';
import { StorageSessionService } from './storage-session.service';
import { Observable } from 'rxjs';
import { Globals } from './globals';
import { Headers, RequestMethod, RequestOptions } from '@angular/http';
//import { saveAs } from 'file-saver';

@Injectable({
  providedIn:'root'
})

export class UseradminService {
 
 private domain_name : string;
 private  V_SRC_CD: string ;
 private V_USR_NM: string ;
 private columnsToDisplay : string;

  constructor(
    private http: Http,
    private https: HttpClient,
    private globals: Globals,
    private session: StorageSessionService) {

      this.domain_name = this.globals.domain_name;
      this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
      this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
      this.columnsToDisplay = this.session.getCookies("coltodisp");
		
  }


  //-------------TAB GROU
  public getJSON(): Observable<any> {
    return this.http.get("./assets/label/label.json")
  }

  AvaiableGroup() {
    return this.https.get("https://" + this.domain_name + "/rest/E_DB/SP?V_SRC_CD=" + this.V_SRC_CD + "&V_CD_TYP=USR_GRP&REST_Service=Masters&Verb=GET");
  }
  getAvailableGroup(V_USR_GRP_CD: AnalyserNode) {
    return this.https.get("https://" + this.domain_name + "/rest/E_DB/SP?V_USR_GRP_CD=" + V_USR_GRP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Group&Verb=GET");
  }
  Delete(V_USR_GRP_CD: any) {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_USR_GRP_CD=" + V_USR_GRP_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Group&Verb=DELETE");
  }
  AddGroup(endDate: any, stDate: any, V_USR_GRP_DSC: any, V_USR_GRP_CD: any) {
    let body = {
      "V_USR_GRP_CD": [V_USR_GRP_CD],
      "V_USR_GRP_DSC": [V_USR_GRP_DSC],
      "V_SRC_CD": [this.V_SRC_CD],
      "V_EFF_STRT_DT_TM": [stDate],
      "V_EFF_END_DT_TM": [endDate],
      "V_USR_NM": [this.V_USR_NM],
      "REST_Service": ["Group"],
      "Verb": ["PUT"]
    }
    return this.http.put("https://" + this.domain_name + "/rest/E_DB/SP", body);
  }

  //-------------------------------------ROLL

  getRoll() {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_SRC_CD=" + this.V_SRC_CD + "&V_CD_TYP=ROLE&REST_Service=Masters&Verb=GET");
  }
  getRollDSCR(ROLE_CD: any) {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_ROLE_CD=" + ROLE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Role&Verb=GET");
  }
  addRoll(V_ROLE_CD: any, V_ROLE_DSC: any) {
    let body = {
      "V_ROLE_CD": [V_ROLE_CD],
      "V_ROLE_DSC": [V_ROLE_DSC],
      "V_USR_NM": [this.V_USR_NM],
      "V_SRC_CD": [this.V_SRC_CD],
      "REST_Service": ["Role"],
      "Verb": ["PUT"]
    }

    return this.http.put("https://" + this.domain_name + "/rest/E_DB/SP", body);
  }
  DeleteRoll(V_ROLE_CD: any) {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_ROLE_CD=" + V_ROLE_CD + "&V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Role&Verb=DELETE");
  }
  //-------------user
  mapUser = new Map();
  getUser() {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_SRC_CD=" + this.V_SRC_CD + "&V_CD_TYP=USER&REST_Service=Masters&Verb=GET");
  }
  getUserLable() {

  }
  getUSerDetails(USR_NM: any) {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_USR_NM=" + USR_NM + "&REST_Service=User_Detail&Verb=GET");
  }
  AddUser(USR_NM: any, USR_DSC: any, USR_PASS: any, USR_STS: any) {
    let body = {
      "V_USR_NM": [USR_NM],
      "V_SRC_CD": [this.V_SRC_CD],
      "V_USR_DSC": [USR_DSC],
      "V_PSWRD": [USR_PASS],
      "V_STS": [USR_STS. toUpperCase()],
      "REST_Service": ["User_Master"],
      "Verb": ["PUT"]
    }
    return this.http.put("https://" + this.domain_name + "/rest/E_DB/SP", body);
  }

  //-------------------organization
  getOrganization() {
    return this.http.get("https://" + this.domain_name + "/rest/E_DB/SP?V_SRC_CD=" + this.V_SRC_CD + "&REST_Service=Orgnization&Verb=GET");
  }
  UpdateOrganization() {
    let body = {
      "V_SRC_CD": ["User Administrator"],
      "V_MAX_RCD": ["500"],
      "V_ADMIN_EMAIL_ID": ["UserAdmin@adventbusiness.com"],
      "V_LOG_LVL": ["Info"],
      "V_PWD_SFX": ["@123"],
      "V_EMAIL_HOST": ["smtpout.secureserver.net"],
      "V_EMAIL_PORT": ["3535"],
      "V_VALDT_DRTN": ["10"],
      "V_LOGIN_VALIDITY_IN_MONTHS": ["3"],
      "V_PWD_VALIDITY_IN_MONTHS": ["3"],
      "V_LOG_RTN_PRD": ["90"],
      "V_DATA_PRG_PRD": ["90"],
      "V_TBL_PRTN_PRD": ["60"],
      "V_SESSN_EXPY_SEC": ["300"],
      "REST_Service": ["Orgnization"],
      "Verb": ["PATCH"]
    }
  }
  //-------------------------membershi
/*
  replace the white spaces with - and dots
*/
 public reduceFilePath(pathName:string) : any{
	 return pathName.split(" ").join("-").replace(".","");
  }
  /*
  Remove the extra domain sufix 
  */
  private removeSubDomain(domain:string ) : string {
    return domain.split("/Enablement").join("");
  }
 /*
  Upload the file on API 
  */
  public fileUpload(currentFile:File,fileName:any,screen:any)  {
    ("The file name is  :"+fileName);
    ("The current screen is :"+screen);
  let formData: FormData = new FormData();
  
	let file:any={};
	file['File_Path']="/opt/tomcat/webapps/"+this.reduceFilePath(this.V_SRC_CD)+"/BulkDataLoad/";
	file['File_Name']=fileName;
	formData.append('Source_File', currentFile);
  formData.append("FileInfo", JSON.stringify(file));
  
    let obj=this.https.post("https://"+ this.removeSubDomain(this.domain_name) +"/FileAPIs/api/file/v1/upload", formData);
	this.uploadFileSendInfo(fileName,screen);
		return obj;
  }
  /*
	Send File Information at time of file upload
  */
 public uploadFileSendInfo(fileName:any,screen:any){
	
	 let body:any={};
		body['File_Path']="/opt/tomcat/webapps/"+this.reduceFilePath(this.V_SRC_CD)+"/BulkDataLoad/";
		body['File_Name']=fileName;
		body['TIMEZONE']=new Date();
		body['SCREEN']=screen;
		body['V_SRC_CD']=this.V_SRC_CD;
		body['USR_NM']=this.V_USR_NM;
		this.https.post("https://"+this.domain_name+"/rest/file/upload",body).subscribe(
			res=>{
				("File upload response : "+res);	
			},
			error=>{
				console.error("File uploading info error :"+error);
			}
		);
 }
 /*
 Download files from API this API is same for all admin user 
 just parameter changes
 */
 public downloadFile(fileName:any) {
   let option = this.setHeaders();
	  let formData: FormData = new FormData();
    let file:any={};
    file['File_Path']="/opt/tomcat/webapps/BulkDataDownload/";
    file['File_Name']=fileName;

    formData.append("FileInfo", JSON.stringify(file));
   
    this.http.post("https://"+this.removeSubDomain(this.domain_name)+"/FileAPIs/api/file/v1/download", 
	formData, option).
	subscribe(data =>{
		  var a = document.createElement("a");
          a.href = URL.createObjectURL(data.blob());
          a.download = fileName;
          // start download
          a.click();
	});

  }
 /*
	Send email to user at the add option in user admin
	 email will send when user click on check box(values should be true)
 */
 public sendEmailStatus(log:any,email:any,pass:any) : void{
		let body:any={};
		body["Subject"]="Account Login Detail";
		
		body["EmailMessage"]="Your account has been created at -https://"+
				this.domain_name+"  Username - "+email+" Password - "+pass;
		body["SendTo"]=email;
		
		this.http.post("https://"+this.domain_name+"/rest/EmailServices/email",body).subscribe(
		res=>{
				("email send response");
				(res);
				
		},error=>{
			("email sending error :"+error);
		});
		
 }
 /*
 Update the existing user
 */
 public updateExistingUser(user:any){
	
	this.http.get("https://"+this.domain_name+"/rest/E_DB/SP?V_USR_NM="+user.USR_NM_R+"&V_SRC_CD="+this.V_SRC_CD+"&V_USR_DSC="+user.USR_DSC_R+"&V_STS="+user.USRC_STATUS_R. toUpperCase()+"&REST_Service=User&Verb=PATCH")
		.subscribe(
			res=>{
				("Existing user updation : "+res);
				user.ClearField();
			},
			err=>{
				console.error("Existing user updation failed : "+err);
			}
		)
 }
 public tests(){
	 
 }

  setHeaders() {
    const headers = new Headers();
    //headers.append('Accept','application/json');
    //headers.append('Content-Type','application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `Bearer ${JSON.parse(sessionStorage.getItem('u')).TOKEN}`)
    //headers.append('responseType', 'blob')
    //const options = new RequestOptions({ headers: headers });
    const options = new RequestOptions({ headers: headers, responseType:ResponseContentType.Blob });
    return options;
  } 
  //code by manav end

}
