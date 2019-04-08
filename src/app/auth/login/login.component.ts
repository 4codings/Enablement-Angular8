import {Component, OnInit} from '@angular/core';
// import {ApiSdkService} from "../../core/api-sdk/api-sdk.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {UserService} from "../../core/user.service";
import {Router} from "@angular/router";
// import {LoggerService} from "../../core/logger.service";
import {ToastrService} from "ngx-toastr";
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as usreLoginActions from "../../store/auth/userlogin.action";
import { Observable } from 'rxjs';


@Component({
    selector:    'app-login',
    templateUrl: './login.component.html',
    styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    ui: any;
    didLoading$:Observable<boolean>;
    didLoaded$:Observable<boolean>;

    constructor(
      // private api: ApiSdkService,
      // private user: UserService,
        private fb: FormBuilder,
        private router: Router,
        // private l: LoggerService,
        private t: ToastrService,
        private store: Store<AppState>
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.ui = {laddaLogin: false};
        this.didLoading$ = this.store.pipe(select(state => state.userInfo.loading));
        this.didLoaded$ = this.store.pipe(select(state => state.userInfo.loaded));
    }

    login() {
        if (this.form.invalid) return;

        this.ui.laddaLogin = true;
        console.log(this.form.value)
        let body = {
            "V_USR_NM": this.form.value.email,
            "V_PSWRD": this.form.value.password,
            "V_ACTN_NM": "LOGIN"
        }
        this.router.navigate(['/user']);

        // this.store.dispatch(new usreLoginActions.userLogin(body));
        // this.store.subscribe(
        //             resp => {
        //                 console.log(resp)
                        // this.l.debug('LoginResponse', resp.body);
                        // this.t.error(resp.body+'');
                        // this.user.setUser(resp.body, !this.form.get('rememberMe').value);
                        // debugger
                        // this.router.navigate(['/user']);

                        // this.ui.laddaLogin = false;
                        // let key = 'id';
                        // localStorage.setItem(key, JSON.stringify(resp));
                        // resp.body
                        // debugger
                        // let keyt = 'token';
                        // localStorage.setItem(key, JSON.stringify(resp.body.result.token));
    
                        // localStorage.setItem(key, JSON.stringify(resp.body.result.token));
                    // },
                    // e => {
                    //     // this.l.debug('LoginError', e);
                    //     this.t.error(e.error.error.detail);
                    //     this.ui.laddaLogin = false;
                    // }
                // )
        // this.api.auth.login(this.form.value)
        //     .subscribe(
        //         resp => {
        //             console.log(resp)
        //             this.l.debug('LoginResponse', resp.body);
        //             this.t.error(resp.body+'');
        //             this.user.setUser(resp.body, !this.form.get('rememberMe').value);
        //             this.router.navigate(['/home/dashboard']);
        //             this.ui.laddaLogin = false;
        //             let key = 'id';
        //             localStorage.setItem(key, JSON.stringify(resp.body));
        //             resp.body
        //             debugger
        //             let keyt = 'token';
                    // localStorage.setItem(key, JSON.stringify(resp.body.result.token));

                    // localStorage.setItem(key, JSON.stringify(resp.body.result.token));
            //     },
            //     e => {
            //         this.l.debug('LoginError', e);
            //         this.t.error(e.error.error.detail);
            //         this.ui.laddaLogin = false;
            //     }
            // )
    }

    private initForm() {
        this.form = this.fb.group({
            email:   ['', Validators.required],
            password:   ['', Validators.required],
            rememberMe: [false]
        })
    }

}
