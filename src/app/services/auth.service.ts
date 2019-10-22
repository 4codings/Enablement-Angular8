import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { userInfo } from '../store/auth/userinfo.model';
import { User } from '../store/user-admin/user/user.model';
import { userGroup } from '../store/user-admin/user-group/usergroup.model';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserService } from '../core/user.service';
import { UserLoginState } from '../store/auth/userlogin.reducer';
import {Globals} from './globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDetail: Observable<UserLoginState>;
  domain_name="enablement.us/Enablement";
  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
  private apiUrlPost = "https://"+this.domain_name+"/";

  constructor(private http: HttpClient, private store: Store<AppState>, public userService: UserService, handler:HttpBackend) {
    this.http = new HttpClient(handler);
		this.userDetail = this.store.pipe(select('userInfo'));
    this.userDetail.subscribe(data => {
            // this.userServicve.clear();
            if (data.userInfo.TOKEN != '') {
              if (this.userService.getDetailFromStorage() == null) {
                this.userService.setUser(data.userInfo);
              }
            }


        });
	}

	userLogin(data) {
		return this.http.post<userInfo>('https://enablement.us/Enablement/rest/authentication', data);
  }

  CheckSrc(form){
    let body={
      "V_SRC_CD":form.value.agency,
      "RESULT":"@RESULT"
    }
    var dt=JSON.stringify(body);
    return this.http.post<data>('https://enablement.us/Enablement/rest/'+'CheckSrc',body);
  }
  //------------------------
  sendConfirmation(data){
    let body = {
      "V_USR_NM": data.value.email,
      "V_PSWRD": data.value.pass,
      "SRC_CD": data.value.agency,
      "message": "Please confirm your login..."
    };
    var aa = JSON.stringify(body);
    return this.http.post('https://enablement.us/Enablement/rest/' + "SendEmail",aa);
  }
  //-------------
  CheckUsrPw(form){
      let body = {
        "V_USR_NM": form.value.email,
        "V_PSWRD": form.value.pass,
        "V_ACTN_NM": "LOGIN",
        "RESULT": "@RESULT"
      };
      var aa = JSON.stringify(body);
   return  this.http.post<data>(this.apiUrlPost + "CheckUsr",aa)
  }
  //--------------------
  SendResetPasswordEmail(data){
    let body = {
      "V_USR_NM": data.value.email,
      "V_PSWRD": data.value.passr,
       "SRC_CD": data.value.agency,
       "message": "Click on link to reset your account new password "+data.value.pass,
    };
    var aa = JSON.stringify(body);
  return this.http.post(this.apiUrlPost + "SendEmail",aa);
  //  return this.http.patch(this.apiUrlGet+"REST_Service=Password&Verb=PATCH",body);
    }
    //-----------------------------
    ChangePassword(form){
          return this.http.get("https://"+this.domain_name+"/rest/v1/secured?V_USR_NM=exeserver@adventbusiness.com&V_PSWRD=bala&REST_Service=Password&Verb=PATCH");
    }

}

//-------------------------------
export interface data{
  resultUsrname:string;
  //check user email and password

  resultUsrOnly:string;
  resultLoginValidity:string;
  resultSrc:string;
  resultSrcAdminEmailID:string;
  resultUsrPwd:string;
  esultUsrname:string;
  resultUsrPaymentValid:string;

}
