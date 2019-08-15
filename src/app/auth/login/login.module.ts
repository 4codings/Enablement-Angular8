import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { UserLoginEffects } from '../../store/auth/userlogin.effects';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports:      [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        LoginRoutingModule,
        EffectsModule.forFeature([UserLoginEffects]),
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
