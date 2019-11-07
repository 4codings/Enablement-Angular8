import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UseradminRoutingModule } from './useradmin-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AuthorizeroleComponent } from './authorizerole/authorizerole.component';
import { MembershipComponent } from './membership/membership.component';
import { OrganizationComponent } from './organization/organization.component';
import { RoleComponent } from './role/role.component';
import { UserAdminNavComponent } from './user-admin-nav/user-admin-nav.component';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '../../store/user-admin/user/user.effects';
import { UserGroupEffects } from '../../store/user-admin/user-group/usergroup.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleEffects } from '../../store/user-admin/user-role/userrole.effects';
import { UserMembershipEffects } from '../../store/user-admin/user-membership/usermembership.effects';
import { AuthEffects } from '../../store/user-admin/user-authorization/authorization.effects';
import { AuthorizeComponent } from './authorize/authorize.component';
import { HeaderModule } from '../header/header.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { OverviewComponent } from './overview/overview.component';
import { AuthTypePipe } from './overview/auth-type.pipe';
import { UserFormComponent } from './user-admin-user/user-form/user-form.component';
import { AddUserComponent } from './user-admin-user/add-user/add-user.component';
import { EditUserComponent } from './user-admin-user/edit-user/edit-user.component';
import { GroupFormComponent } from './user-admin-group/group-form/group-form.component';
import { AddGroupComponent } from './user-admin-group/add-group/add-group.component';
import { EditGroupComponent } from './user-admin-group/edit-group/edit-group.component';
import { AddEditRoleComponent } from './role/add-edit-role/add-edit-role.component';
import { AddEditUserComponent } from './user-admin-user/add-edit-user/add-edit-user.component';
import { AddEditAuthorizeComponent } from './authorize/add-edit-authorize/add-edit-authorize.component';
import { GroupTypePipe, GroupTypeProfilePipe } from './user-admin-group/group-type.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserListComponent } from './user-admin-user/user-list/user-list.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { GroupListComponent } from './overview/group-list/group-list.component';
import { SingleGroupComponent } from './overview/single-group/single-group.component';
import { UserTileListComponent } from './overview/user-tile-list/user-tile-list.component';
import { RoleListComponent } from './overview/role-list/role-list.component';
import { SingleRoleComponent } from './overview/single-role/single-role.component';
import { AuthTileListComponent } from './overview/auth-tile-list/auth-tile-list.component';
import { AuthListComponent } from './authorize/auth-list/auth-list.component';
import { AssignRoleModalComponent } from './assignrole/assign-role-modal/assign-role-modal.component';
import { AssignGroupModalComponent } from './assignrole/assign-group-modal/assign-group-modal.component';

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
    OverviewComponent,
    AuthTypePipe,
    UserFormComponent,
    AddUserComponent,
    EditUserComponent,
    GroupFormComponent,
    AddGroupComponent,
    EditGroupComponent,
    AddEditRoleComponent,
    AddEditUserComponent,
    AddEditAuthorizeComponent,
    GroupTypePipe,
    GroupTypeProfilePipe,
    UserListComponent,
    RoleFormComponent,
    AddRoleComponent,
    EditRoleComponent,
    GroupListComponent,
    SingleGroupComponent,
    UserTileListComponent,
    RoleListComponent,
    SingleRoleComponent,
    AuthTileListComponent,
    AuthListComponent,
    AssignRoleModalComponent,
    AssignGroupModalComponent,
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
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    CommonModule,
    UseradminRoutingModule,
    HeaderModule,
    FlexLayoutModule,
    MatRadioModule,
    SharedModule,
    EffectsModule.forFeature([UserEffects, UserGroupEffects, UserRoleEffects, UserMembershipEffects, AuthEffects]),
    MatGridListModule,
    MatRippleModule,
    DragDropModule,
  ],
  entryComponents: [
    AddUserComponent,
    AddGroupComponent,
    EditUserComponent,
    EditGroupComponent,
    AddEditRoleComponent,
    AddEditUserComponent,
    AddEditAuthorizeComponent,
    AddRoleComponent,
    EditRoleComponent,
    AssignRoleModalComponent,
    AssignGroupModalComponent],
})
export class UseradminModule {
  constructor() {
  }
}
