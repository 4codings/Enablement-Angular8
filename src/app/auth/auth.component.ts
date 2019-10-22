import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { AppState } from '../app.state';
import * as usreLoginActions from '../store/auth/userlogin.action';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    form: FormGroup;
    ui: any;
    didLoading$: Observable<boolean>;
    didLoaded$: Observable<boolean>;
    sub;
    isLoginButton = true;
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
    domain_name = "enablement.online";
    email_id: string[] = ['gmail', 'yahoo', 'outlook', 'hotmail', 'live', 'aol', 'aim', 'yandex', 'protonmail', 'zoho', 'gmx', 'tutanota'];
    btn_disabled: boolean = false;
    Label: any[] = [];
    private apiUrlGet = "https://" + this.domain_name + "/rest/E_DB/SP?";
    myRecaptcha = new FormControl(false);

    constructor(
        private http: HttpClient,
        // private user: UserService,
        private fb: FormBuilder,
        private router: Router,
        // private l: LoggerService,
        private authService: AuthService,
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

    login(form: NgForm) {
        if (form.invalid) { return; }
        const body = {
            V_USR_NM: form.value.email,
            V_PSWRD: form.value.pass,
            V_ACTN_NM: 'LOGIN'
        };
        // console.log('form.value.agency', form.value.agency);
        // if (form.value.agency != undefined) {
        //     this.sendConfirmation(form);
        // } else {
        //     this.CheckUsrPw(form);
        // }
        this.store.dispatch(new usreLoginActions.userLogin(body));
    }
    CheckUsrPw(form) {
        const body = {
            V_USR_NM: form.value.email,
            V_PSWRD: form.value.pass,
            V_ACTN_NM: 'LOGIN'
        };
        this.authService.userLogin(body).subscribe(
            (data: any) => {
                if (data.resultUsrOnly === "NO_SOURCE") {
                    this.srcBloc = true; //show src block
                    this.agcy = false;
                    this.isLoginButton = false;
                    this.toastr.warning("Please enter your Organization name", "Agency");
                }
                else if (data.resultUsrOnly == "TERMINATED") {
                    this.toastr.error('Your are Terminated..!', 'Login');
                } else if (data.resultUsrOnly == "TRUE") {
                    this.msg_alert = "";
                    if (data.resultLoginValidity == "FALSE") {
                        this.msg_alert = "Your Login Account is expired. Contact your Admin at " + data.resultSrcAdminEmailID + " to activate it.";
                    } else if (data.resultUsrPaymentValid == "FALSE") {
                        this.msg_alert = "You have utilized your Account balance. Contact your Admin at " + data.resultSrcAdminEmailID + " to process payment.";
                    }
                } if (data.resultUsrPwd == "INCORRECT" && data.resultLoginValidity == "") {
                    this.countAt++;
                    if (this.countAt == 3) {
                        this.toastr.warning("Please provide a new password that you want to reset", "Change password");
                        this.pass1 = false;
                        this.pass2 = true;
                        this.rstBnt = true;
                        this.logBtn = false;
                        this.captcha = true;
                        this.sendResetPassowrdEmail(form);
                    } else {
                        this.toastr.warning("Invalid password,Attempt=" + this.countAt, "Login");
                    }
                } else if (data.resultUsrPwd == "CORRECT" && data.resultLoginValidity == "TRUE") {
                    // put this parameter when payment option come in res "&& data.resultUsrPaymentValid == "TRUE""
                    // this.toastr.success("Success...!","Login In");
                    this.loading = true;
                    // this.StorageSessionService.setSession('email', data.resultUsrname);
                    // this.StorageSessionService.setSession('agency', data.resultSrc);
                    // this.apiServiceService.getUserId(data.resultSrc).subscribe(data => {
                    //     this.StorageSessionService.setSession('userid', data.SRC_ID[0]);
                    //     this.router.navigate(['Profile'], { skipLocationChange: true });
                    // });
                }
            }, err => {
                this.countAt++;
                if (this.countAt == 3) {
                    this.toastr.warning("Please provide a new password that you want to reset", "Change password");
                    this.pass1 = false;
                    this.pass2 = true;
                    this.rstBnt = true;
                    this.logBtn = false;
                    this.captcha = true;
                    this.sendResetPassowrdEmail(form);
                } else {
                    // this.toastr.warning("Invalid password,Attempt=" + this.countAt, "Login");
                }
                console.log('err', err);
            });
    }

    sendResetPassowrdEmail(data) {
        let body = {
            "V_USR_NM": data.value.email,
            "V_PSWRD": data.value.passr
        };
        this.http.patch(this.apiUrlGet + "REST_Service=Password&Verb=PATCH", body).subscribe(
            res => {
                (res);
            }
        );
    }

    sendConfirmation(data) {    //6  "Please confirm your login..."
        this.authService.sendConfirmation(data)
            .subscribe(res => { (res); });
    }
    private initForm() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            agency: ['', Validators.required],
            rememberMe: [false]
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    onScriptLoad() {
        console.log('Google reCAPTCHA loaded and is ready for use!')
    }

    onScriptError() {
        console.log('Something went long when loading the Google reCAPTCHA')
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
                this.msg_alert = "Please use your corporate email id, '" + sub_string + "' is not allowed", "E-mail";

                this.toastr.warning("Please use your corporate email id, '" + sub_string + "' is not allowed", "E-mail");
            } else {
                //this.btn_disabled=false;
            }
        }
    }

}
