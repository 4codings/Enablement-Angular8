import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UseradminRoutingModule } from './useradmin-routing.module';
import { MatListModule, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldControl, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AuthorizeroleComponent } from './authorizerole/authorizerole.component';
import { MembershipComponent } from './membership/membership.component';
import { OrganizationComponent } from './organization/organization.component';
import { RoleComponent } from './role/role.component';
import { UserAdminNavComponent } from './user-admin-nav/user-admin-nav.component';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'src/app/store/user-admin/user/user.effects';
import { UserGroupEffects } from 'src/app/store/user-admin/user-group/usergroup.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleEffects } from 'src/app/store/user-admin/user-role/userrole.effects';
import { UserMembershipEffects } from 'src/app/store/user-admin/user-membership/usermembership.effects';
import { AuthEffects } from 'src/app/store/user-admin/user-authorization/authorization.effects';
import { AuthorizeComponent } from './authorize/authorize.component';
import { HeaderModule } from '../header/header.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    UseradminComponent,
    UserAdminUserComponent,
    AssignroleComponent,
    AuthorizeroleComponent,
    MembershipComponent,
    OrganizationComponent,
    RoleComponent,
    UserAdminNavComponent,
    UserAdminGroupComponent,
    AuthorizeComponent,
  ],
  imports: [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    UseradminRoutingModule,
    HeaderModule,
    FlexLayoutModule,
    MatRadioModule,
    EffectsModule.forFeature([UserEffects, UserGroupEffects, UserRoleEffects, UserMembershipEffects, AuthEffects]),
  ]
})
export class UseradminModule { }
