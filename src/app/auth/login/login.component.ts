import {Component, OnInit, OnDestroy} from '@angular/core';
// import {ApiSdkService} from "../../core/api-sdk/api-sdk.service";
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
// import {UserService} from "../../core/user.service";
import {Router} from '@angular/router';
// import {LoggerService} from "../../core/logger.service";
import {ToastrService} from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
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
            this.router.navigate(['/user']);
        }
        });
    }

    login(form:NgForm) {
        if (form.invalid) { return; }

        //console.log(form.value);
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
        // alert(this.email);
        this.btn_disabled = false;
        let index_start = this.email.indexOf("@");
        let index_end = this.email.indexOf(".");
        let sub_string = this.email.substring(index_start + 1, index_end);
        //alert(sub_string);
        for (let e of this.email_id) {
        if (e == sub_string) {
            this.btn_disabled = true;
            this.toastr.warning("Please use your corporate email id, '"+sub_string+"' is not allowed","E-mail");
        } else {
            // this.btn_disabled=false;
        }
        }
    }

}
