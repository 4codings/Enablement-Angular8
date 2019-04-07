import {Component, OnInit} from '@angular/core';
// import {ApiSdkService} from "../../core/api-sdk/api-sdk.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {UserService} from "../../core/user.service";
import {Router} from "@angular/router";
// import {LoggerService} from "../../core/logger.service";
import {ToastrService} from "ngx-toastr";


@Component({
    selector:    'app-login',
    templateUrl: './login.component.html',
    styleUrls:   ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    ui: any;

    constructor(
      // private api: ApiSdkService,
      //           private user: UserService,
                private fb: FormBuilder,
                private router: Router,
                // private l: LoggerService,
                private t: ToastrService
                ) {
    }

    ngOnInit() {
        this.initForm();
        this.ui = {laddaLogin: false}
    }

    login() {
        if (this.form.invalid) return;

        this.ui.laddaLogin = true;
        console.log(this.form.value)
debugger
                            this.t.error('Hemant');

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
