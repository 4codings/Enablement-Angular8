import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'src/app/store/user-admin/user/user.effects';
import { UserGroupEffects } from 'src/app/store/user-admin/user-group/usergroup.effects';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    EffectsModule.forFeature([UserEffects, UserGroupEffects]),
  ]
})
export class UserModule { }
