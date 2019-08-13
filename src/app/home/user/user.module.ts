import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '../../store/user-admin/user/user.effects';
import { UserGroupEffects } from '../../store/user-admin/user-group/usergroup.effects';
// import { ProfileComponent } from './profile/profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserRoleEffects } from '../../store/user-admin/user-role/userrole.effects';
import { UserMembershipEffects } from '../../store/user-admin/user-membership/usermembership.effects';
import { SharedModule } from '../../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FlexLayoutModule,
    HeaderModule,
    EffectsModule.forFeature([UserEffects, UserGroupEffects, UserRoleEffects, UserMembershipEffects]),
  ]
})
export class UserModule {
  constructor(){
  }
}
