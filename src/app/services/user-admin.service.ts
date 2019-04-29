import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { userRole } from '../store/user-admin/user-role/userrole.model';
import { userMemberShip } from '../store/user-admin/user-membership/usermembership.model';
import { AuthorizationData } from '../store/user-admin/user-authorization/authorization.model';
import { Http, ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {
	sessionDataToken;
	V_SRC_CD;
	V_USR_NM;
	domain_name;

	constructor(private http: HttpClient) {
		if (sessionStorage.getItem('u') != undefined || sessionStorage.getItem('u') != null) {
		    const data = JSON.parse(sessionStorage.getItem('u'));
			    this.sessionDataToken = data.TOKEN;
			    this.V_SRC_CD = data.V_SRC_CD;
       			this.V_USR_NM = data.V_USR_NM;
		}
		this.domain_name = 'enablement.us/Enablement';
	}


    getUsers(): Observable<User[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<User[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=USER&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	getUserGroups(): Observable<userGroup[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userGroup[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=USR_GRP&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	getUserRoles(): Observable<userRole[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userRole[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=ROLE&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	// membership-> user/group
	getUserMemberShip(): Observable<userMemberShip[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
		return this.http.get<userMemberShip[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_CD_TYP=ROLE&V_SRC_CD=AB&REST_Service=Masters&Verb=GET', {headers: header});
		// return this.http.get<userMemberShip[]>('https://enablement.us/Enablement/rest/E_DB/SPJSON?V_SRC_CD=uttra.24&V_CD_TYP=USR_GRP&REST_Service=Masters&Verb=GET');
	}

	getAuthorizationData(): Observable<AuthorizationData[]> {
		const header = new HttpHeaders().set('Authorization', `Bearer ${this.sessionDataToken}`);
  		return this.http.get<AuthorizationData[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=AUTH&V_SRC_CD=cbp%207&REST_Service=Masters&Verb=GET', {headers: header});
	}

	public fileUpload(currentFile:File,fileName:any,screen:any)  {
		("The file name is  :"+fileName);
		("The current screen is :"+screen);
	  let formData: FormData = new FormData();
	  
		let file:any={};
		file['File_Path']="/opt/tomcat/webapps/"+this.reduceFilePath(this.V_SRC_CD)+"/BulkDataLoad/";
		file['File_Name']=fileName;
		formData.append('Source_File', currentFile);
	  	formData.append("FileInfo", JSON.stringify(file));
	  
		let obj=this.http.post("https://enablement.us/FileAPIs/api/file/v1/upload", formData);
		this.uploadFileSendInfo(fileName,screen);
			return obj;
	}

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

	public uploadFileSendInfo(fileName:any,screen:any){
	
		let body:any={};
		   body['File_Path']="/opt/tomcat/webapps/"+this.reduceFilePath(this.V_SRC_CD)+"/BulkDataLoad/";
		   body['File_Name']=fileName;
		   body['TIMEZONE']=new Date();
		   body['SCREEN']=screen;
		   body['V_SRC_CD']=this.V_SRC_CD;
		   body['USR_NM']=this.V_USR_NM;
		   this.http.post("https://enablement.us/FileAPIs/api/file/v1/download",body).subscribe(
			   res=>{
				   ("File upload response : "+res);	
			   },
			   error=>{
				   console.error("File uploading info error :"+error);
			   }
		   );
	}

	public downloadFile(fileName:any) {
		
	    let formData: FormData = new FormData();
		let file:any={};
		file['File_Path']="/opt/tomcat/webapps/BulkDataDownload/";
		file['File_Name']=fileName;
	
		formData.append("FileInfo", JSON.stringify(file));
		
		this.http.post("https://enablement.us/FileAPIs/api/file/v1/download", 
		formData,{responseType:'blob' as 'json'}).
		subscribe((data:any) =>{
			var a = document.createElement("a");
				a.href = URL.createObjectURL(data.blob());
				a.download = fileName;
				// start download
				a.click();
		});
		/*
        return this.http.post("https://enablement.us/FileAPIs/api/file/v1/download", {
            responseType: ResponseContentType.Blob
        })
        .toPromise()
        .then(response => this.saveAsBlob(response))
		.catch(error => console.log(error));
		*/
	}

		private saveAsBlob(data: any) {
			const blob = new Blob([data._body],
				{ type: 'application/vnd.ms-excel' });
			const file = new File([blob], 'report.xlsx',
				{ type: 'application/vnd.ms-excel' });
		
			//FileSaver.saveAs(file);
		}
 
}
