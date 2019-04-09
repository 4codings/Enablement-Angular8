import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UseradminComponent } from "./useradmin.component";
import { UserAdminUserComponent } from "./user-admin-user/user-admin-user.component";
import { UseradminRoutingModule } from "./useradmin-routing.module";
import { MatIconModule, MatListModule, MatCardModule, MatInputModule, MatFormFieldControl, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from "@angular/material";
import { AssignroleComponent } from "./assignrole/assignrole.component";
import { AuthorizeroleComponent } from "./authorizerole/authorizerole.component";
import { MembershipComponent } from "./membership/membership.component";
import { OrganizationComponent } from "./organization/organization.component";
import { RoleComponent } from "./role/role.component";
import { UserAdminNavComponent } from "./user-admin-nav/user-admin-nav.component";
import { UserAdminGroupComponent } from "./user-admin-group/user-admin-group.component";
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'src/app/store/user-admin/user/user.effects';
import { UserGroupEffects } from 'src/app/store/user-admin/user-group/usergroup.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    UserAdminGroupComponent
  ],
  imports: [
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    UseradminRoutingModule,
    EffectsModule.forFeature([UserEffects, UserGroupEffects]),

  ]
})
export class UseradminModule {}
