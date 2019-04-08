import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UseradminRoutingModule } from './useradmin-routing.module';
import { MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AuthorizeroleComponent } from './authorizerole/authorizerole.component';
import { MembershipComponent } from './membership/membership.component';
import { OrganizationComponent } from './organization/organization.component';
import { RoleComponent } from './role/role.component';
import { UserAdminNavComponent } from './user-admin-nav/user-admin-nav.component';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';

@NgModule({
  declarations: [UseradminComponent, UserAdminUserComponent, AssignroleComponent, AuthorizeroleComponent, MembershipComponent, OrganizationComponent, RoleComponent, UserAdminNavComponent, UserAdminGroupComponent],
  imports: [
    MatIconModule,
    MatListModule,
    MatCardModule,
    CommonModule,
    UseradminRoutingModule
  ]
})
export class UseradminModule { }
