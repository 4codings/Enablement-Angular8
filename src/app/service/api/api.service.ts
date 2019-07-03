import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Globals2 } from '../globals';
import { Observable } from 'rxjs';
import { Globals } from 'src/app/services/globals';
import { Http, RequestOptions, Headers } from '@angular/http';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiURL: string = environment.apiURL
	private endPoint: string
	private authHeader: HttpHeaders;
	public insecureUrl = 'https://' + this.globalUrl.domain + this.globalUrl.suffix + this.globalUrl.Path;
	public securedApiUrl = 'https://' + this.globalUrl.domain + this.globalUrl.suffix + this.globalUrl.Path + this.globalUrl.version;
	public fileUrl = 'https://' + this.globalUrl.domain + '/FileAPIs/api/file' + this.globalUrl.version;
	public readonly endPoints = {
		// Authentications
		login: `${this.apiURL}/`,
		insecure: `${this.insecureUrl}/v1/secured?`,
		secure: `${this.securedApiUrl}/secured?`,
		insecureProcessReport: `${this.insecureUrl}/Process/Report`,
		secureProcessReport: `${this.securedApiUrl}/secured/Process/Report`,
		secureProcessReportSubmit: `${this.securedApiUrl}/secured/Process/ReportSubmit`,
		secureProcessStart: `${this.securedApiUrl}/secured/Process/Start`,
		insecureProcessStart: `${this.insecureUrl}/Process/Start`,
		secureFormSubmit: `${this.securedApiUrl}/secured/FormSubmit`,
		insecureFormSubmit: `${this.insecureUrl}/Submit/FormSubmit`,
		sessionRefresh: `${this.insecureUrl}/sessionRefresh`,
		logout: `${this.insecureUrl}/logout`,
		deleteArtifact: `${this.insecureUrl}/Artifact/DeleteArtifact?`,
		securedJSON: `${this.securedApiUrl}/securedJSON?`,
		downloadFile: `${this.fileUrl}/download`
	}

	constructor(private http: HttpClient, private globals: Globals2, private globalUrl: Globals,
		public https: Http) { }

	public setAuthHeader = () => {
		if (this.globals.currentUser !== null) {
			this.authHeader = new HttpHeaders({ 'Authorization': `Bearer ${this.globals.currentUser.TOKEN}` });
		}
	}

	public init = (endPoint: string) => this.endPoint = endPoint

	public all = (data: any = null, endPoint: string = null) =>
		this.http.get(`${this.apiURL}${endPoint || this.endPoint}`, { headers: this.authHeader })

	public create = (data: any, endPoint: string = null): Observable<any> =>
		this.http.post(`${this.apiURL}${endPoint || this.endPoint}`, data, { headers: this.authHeader })

	public read = (id: number, additional: any = {}, endPoint: string = null): Observable<any> =>
		this.http.get(`${this.apiURL}${endPoint || this.endPoint}${id ? id : ''}`, { params: additional, headers: this.authHeader })

	public update = (id: number, data: any, endPoint: string = null): Observable<any> =>
		this.http.patch(`${this.apiURL}${endPoint || this.endPoint}${id}`, data, { headers: this.authHeader })

	public delete = (id: number, additional: any = {}, endPoint: string = null): Observable<any> =>
		this.http.delete(`${this.apiURL}${endPoint || this.endPoint}${id}`, { params: additional, headers: this.authHeader })

	public request = (endPoint: string, data: any, type: RequestTypes) => {
		this.setAuthHeader();
		if (type == RequestTypes.DELETE)
			return this.delete(null, data, endPoint)
		else if (type == RequestTypes.GET)
			return this.read(null, data, endPoint)
		else if (type == RequestTypes.PATCH)
			return this.all(data, endPoint)
		else if (type == RequestTypes.POST)
			return this.create(data, endPoint)
		else if (type == RequestTypes.PUT)
			return this.update(null, data, endPoint)
	}

	public requestSecureApi(url, type, data?) {
		if (type === 'get') {
			return this.getSecure(url);
		}
	}

	public refreshToken() {
		this.setAuthHeader();
		this.http.post(
			this.endPoints.sessionRefresh,
			{ V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM },
			{ headers: this.authHeader }
		).subscribe();
	}

	public logout(comment) {
		this.setAuthHeader();
		this.http.post(
			this.endPoints.logout,
			{
				V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
				V_SRC_ID: JSON.parse(sessionStorage.getItem('u')).SRC_ID,
				V_ACTN_NM: 'LOGOUT',
				V_COMMNT: comment
			},
			{ headers: this.authHeader }
		).subscribe();
	}

	private getSecure(url: string): any {
		const options = this.setHeaders();
		return this.https.get(url, options);
	}

	public requestInSecureApi(url, type, data?): Observable<any> {
		if (type === 'get') {
			return this.getInSecure(url);
		}
	}

	private getInSecure(url: string): any {
		return this.https.get(url);
	}

	// getUsers(): Observable<User[]> {
	// 	this.setAuthHeader();
	// 	return this.http.get<User[]>('https://enablement.us/Enablement/rest/v1/securedJSON?V_CD_TYP=USER&V_SRC_CD=uttra.24&REST_Service=Masters&Verb=GET');
	// }

	setHeaders() {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		//headers.append('Access-Control-Allow-Origin', '*');
		headers.append('Authorization', `Bearer ${JSON.parse(sessionStorage.getItem('u')).TOKEN}`)
		const options = new RequestOptions({ headers: headers });
		return options;
	}
}

export enum RequestTypes {
	POST, GET, PUT, DELETE, PATCH
}