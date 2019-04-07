import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from "./login-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { UserLoginEffects } from 'src/app/store/auth/userlogin.effects';
// import {SharedModule} from "../../shared/shared.module";
// import {CoreModule} from "../../core/core.module";


@NgModule({
    imports:      [
        CommonModule,
        SharedModule,
        // CoreModule,
        FormsModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        EffectsModule.forFeature([UserLoginEffects]),
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
