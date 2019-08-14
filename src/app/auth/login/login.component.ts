import {Component, OnInit, OnDestroy} from '@angular/core';
// import {ApiSdkService} from "../../core/api-sdk/api-sdk.service";
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
// import {UserService} from "../../core/user.service";
import {Router} from '@angular/router';
// import {LoggerService} from "../../core/logger.service";
import {ToastrService} from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../app.state';
import * as usreLoginActions from '../../store/auth/userlogin.action';
import { Observable } from 'rxjs';


@Component({
    selector:    'app-login',
    templateUrl: './login.component.html',
    styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    form: FormGroup;
    ui: any;
    didLoading$: Observable<boolean>;
    didLoaded$: Observable<boolean>;
    sub;
    public agcy: boolean = true;
    public msg: boolean = true;
    public loading: boolean = true;
    countAt: number = 0;
    logBtn: boolean = true;
    rstBnt: boolean = false;
    captcha: boolean = false;
    srcBloc: boolean = false;
    pass1: boolean = true;
    pass2: boolean = false;
    msg_alert = "";
    email: string = "";
    progress: boolean = false;
    email_id: string[] = ['gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'aol', 'aim', 'yandex', 'protonmail', 'zoho', 'gmx', 'tutanota'];
    btn_disabled: boolean = false;
    Label: any[] = [];

    constructor(
      // private api: ApiSdkService,
      // private user: UserService,
        private fb: FormBuilder,
        private router: Router,
        // private l: LoggerService,
        private toastr: ToastrService,
        private store: Store<AppState>
    ) {
    }

    ngOnInit() {
        this.initForm();

        this.didLoading$ = this.store.pipe(select(state => state.userInfo.loading));

        this.didLoaded$ = this.store.pipe(select(state => state.userInfo && state.userInfo.loaded));
        this.sub = this.didLoaded$.subscribe(loaded => {
        if (loaded == true) {
            this.router.navigateByUrl('/user', { skipLocationChange: true });
        }
        });
    }

    login(form:NgForm) {
        if (form.invalid) { return; }

        const body = {
            V_USR_NM: form.value.email,
            V_PSWRD: form.value.pass,
            V_ACTN_NM: 'LOGIN'
        };

        this.store.dispatch(new usreLoginActions.userLogin(body));
    }

    private initForm() {
        this.form = this.fb.group({
            email:   ['', Validators.required],
            password:   ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onKey(event: any) {
        //alert(this.email);
        this.btn_disabled = false;
        this.msg_alert = "";
        let index_start = this.email.indexOf("@");
        let index_end = this.email.indexOf(".");
        let sub_string = this.email.substring(index_start + 1, index_end);
        //alert(sub_string);
        for (let e of this.email_id) {
        if (e == sub_string) {
            this.btn_disabled = true;
            this.msg_alert = "Please use your corporate email id, '"+sub_string+"' is not allowed","E-mail";

            this.toastr.warning("Please use your corporate email id, '"+sub_string+"' is not allowed","E-mail");
        } else {
            //this.btn_disabled=false;
        }
        }
    }

}

// import { Component, OnInit,ViewContainerRef } from '@angular/core';
// import{RouterModule,Route} from '@angular/router';
// import { RouterLink } from '@angular/router/src/directives/router_link';
// import { HttpClient, HttpHeaders} from '@angular/common/http';
// import { Http,Response,Headers } from '@angular/http';
// import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// import { ToastrService } from 'ngx-toastr';
// import { NgForm } from '@angular/forms';
// import { ViewEncapsulation } from "@angular/core";
// import { ChangeDetectorRef } from "@angular/core";
// import { Store, select } from '@ngrx/store';
// import { AppState } from 'src/app/app.state';
// import { AuthService } from 'src/app/services/auth.service';


// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class LoginComponent implements OnInit {
//   tooltipflag: boolean = false;
//   tooltipmsg="";
//   confirm_msg: boolean;
//   msg1;
//   pwdset: boolean;
//   httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };
// sub_string;
// public errorMsg;
// public sendMail;
//   constructor(private Router:Router,
//     private http:HttpClient,
//     private toastr:ToastrService,
//     private ref: ChangeDetectorRef,
//     private route: ActivatedRoute,
//     private router: Router,
//     private store: Store<AppState>,
//     private logData:AuthService
//    ) {  }

// email_id:string[]=['gmail','yahoo','outlook','hotmail','live','aol','aim','yandex','protonmail','zoho','gmx','tutanota'];
// btn_disabled:boolean=false;
//   onKey(event: any) {
//  this.btn_disabled=false;
//  let index_start=this.email.indexOf("@");
//  let index_end=this.email.indexOf(".");
//  let sub_string=this.email.substring(index_start+1,index_end);
//  //alert(sub_string);
//  this.tooltipmsg = null;
//  this.tooltipflag = false;
//  this.msg1 = false;
// for(let e of this.email_id){
//   // this.msg1 = false;
//     if(e==sub_string){
//         this.btn_disabled=true;
//         this.msg1 = true;
//         this.sub_string =  sub_string;
//         this.toastr.warning("Please use your corporate email id, '"+sub_string+"' is not allowed","E-mail");
//        this.agcy= true;
//     }else{
//       this.btn_disabled=false;
//     }
// }
//   }
//   Label:any[]=[];
//   ngOnInit() {
//     // this.data.getJSON().subscribe(data => {
//     //   (data.json());
//     //   this.Label=data.json();
//     //   (this.Label);

//     // });

//     //   this.didLoading$ = this.store.pipe(select(state => state.userInfo.loading));

//     //     this.didLoaded$ = this.store.pipe(select(state => state.userInfo && state.userInfo.loaded));
//     //     this.sub = this.didLoaded$.subscribe(loaded => {
//     //     if (loaded == true) {
//     //         this.router.navigate(['/user']);
//     //     }
//     //     });
//   }
//   resolved(captchaResponse: string) {
//     (`Resolved captcha with response ${captchaResponse}:`);
// }

//  domain_name="enablement.online";
//  private apiUrlGet = "https://"+this.domain_name+"/rest/v1/secured?";
// private apiUrlPost = "https://"+this.domain_name+"/";
// public agcy:boolean = true;
// public msg:boolean = true;
// public loading:boolean = true;
// countAt:number=0;
// logBtn:boolean=true;
// rstBnt:boolean=false;
// captcha:boolean=false;
// srcBloc:boolean=false;
// pass1:boolean=true;
// pass2:boolean=false;
// msg_alert="";
// email:string="";
// progress:boolean=false;


// checkUser(form:NgForm){   //1
//     this.progress=true;
//     let email=form.value.email;
//     let pass=form.value.pass;
//     let agency=form.value.agency;
//     (email+pass+agency);
//     if(agency!==undefined){
//         this.CheckSrc(form);   //3
//     }else{
//         this.CheckUsrPw(form);   //2
//     }
// }


// CheckSrc(form){   //4
//   this.confirm_msg = false;
//     this.logData.CheckSrc(form).subscribe(res=>{
//          if( res.resultUsrname=="Passed"){
//           this.toastr.success("A confirmation link is sent to your email id. Please check your email and confirm the registration","Login");
//           this.confirm_msg = true;
//           this.agcy = true;
//           this.sendConfirmation(form);  //5
//           this.progress=false;

// }});}
// sendConfirmation(data){    //6  "Please confirm your login..."
// this.logData.sendConfirmation(data)
// .subscribe(res=>{(res);});
// }

// CheckUsrPw(form){     //7
//   this.progress=true;
//   this.pwdset=false;

// if(form.value.email!=""&&form.value.pass!=""){
// this.logData.CheckUsrPw(form).subscribe(
//    data=>{
//      (data);
//      (data.resultUsrPwd);
//     (data.resultUsrOnly);
//                      if(data.resultUsrOnly=="FALSE"){
//                              this.srcBloc=true; //show src block
//                              this.agcy=false;

//                              this.toastr.warning("Please enter your Organization name","Agency");
//                             //  this.msg_alert="Please enter your Organization name";
//                       }else if(data.resultUsrOnly=="TERMINATED"){
//                               this.toastr.error('Your are Terminated..!','Login');
//                       } else if(data.resultUsrOnly=="TRUE"){
//                                         this.msg_alert="";
//                                             if(data.resultLoginValidity=="FALSE"){
//                                                   this.msg_alert="Your Login Account is expired. Contact your Admin at "+data.resultSrcAdminEmailID+" to activate it.";
//                                             }else if(data.resultUsrPaymentValid=="FALSE"){
//                                                   this.msg_alert="You have utilized your Account balance. Contact your Admin at "+data.resultSrcAdminEmailID+" to process payment.";
//                                             }
//                        } if(data.resultUsrPwd=="INCORRECT"&&data.resultLoginValidity==""){
//                                       this.countAt++;
//                                     if(this.countAt==3){
//                                          this.toastr.warning("Please provide a new password that you want to reset","Change password");
//                                          this.pass1=false;
//                                          this.pass2=true;
//                                          this.rstBnt=true;
//                                          this.logBtn=false;
//                                          this.captcha=true;
//                                          this.pwdset=true;
//                                          this.sendResetPassowrdEmail(form);
//                                     }else{
//                                         this.toastr.warning("Invalid password,Attempt="+this.countAt,"Login");
//                                     }
//                        }else if(data.resultUsrPwd=="CORRECT"&&data.resultLoginValidity == "TRUE"){
//                          // put this parameter when payment option come in res "&& data.resultUsrPaymentValid == "TRUE""
//                            // this.toastr.success("Success...!","Login In");
//                             this.loading = true;

//                        }
//     });
//     this.progress=false;
// }else{
//   this.toastr.warning("Please enter email and passowrd.","Login");
// }
// }

// //-----------------Send reset conformation passworrd
// sendResetPassowrdEmail(data){
//   let body={
//     "V_USR_NM":data.value.email,
//     "V_PSWRD":data.value.passr
//   };
//       this.http.patch(this.apiUrlGet+"REST_Service=Password&Verb=PATCH",body).subscribe(
//         res=>{
//           (res);
//         }
//       );
// }
// }

// export interface data{
//   resultUsrname:string;
//   //check user email and password

//   resultUsrOnly:string;
//   resultLoginValidity:string;
//   resultSrc:string;
//   resultSrcAdminEmailID:string;
//   resultUsrPwd:string;
//   esultUsrname:string;
//   resultUsrPaymentValid:string;

// }

