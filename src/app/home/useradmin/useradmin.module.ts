import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../../shared/shared.module';
import { AuthEffects } from '../../store/user-admin/user-authorization/authorization.effects';
import { UserGroupEffects } from '../../store/user-admin/user-group/usergroup.effects';
import { UserMembershipEffects } from '../../store/user-admin/user-membership/usermembership.effects';
import { UserRoleEffects } from '../../store/user-admin/user-role/userrole.effects';
import { UserEffects } from '../../store/user-admin/user/user.effects';
import { HeaderModule } from '../header/header.module';
import { AssignGroupModalComponent } from './assignrole/assign-group-modal/assign-group-modal.component';
import { AssignRoleModalComponent } from './assignrole/assign-role-modal/assign-role-modal.component';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AddEditAuthorizeComponent } from './authorize/add-edit-authorize/add-edit-authorize.component';
import { AuthListComponent } from './authorize/auth-list/auth-list.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { AuthTileListComponent } from './overview/auth-tile-list/auth-tile-list.component';
import { AuthTypePipe } from './overview/auth-type.pipe';
import { GroupListComponent } from './overview/group-list/group-list.component';
import { OverviewComponent } from './overview/overview.component';
import { RoleListComponent } from './overview/role-list/role-list.component';
import { SingleGroupComponent } from './overview/single-group/single-group.component';
import { SingleRoleComponent } from './overview/single-role/single-role.component';
import { UserTileListComponent } from './overview/user-tile-list/user-tile-list.component';
import { AddEditRoleComponent } from './role/add-edit-role/add-edit-role.component';
import { AddRoleComponent } from './role/add-role/add-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleComponent } from './role/role.component';
import { AddGroupComponent } from './user-admin-group/add-group/add-group.component';
import { EditGroupComponent } from './user-admin-group/edit-group/edit-group.component';
import { GroupFormComponent } from './user-admin-group/group-form/group-form.component';
import { GroupTypePipe, GroupTypeProfilePipe } from './user-admin-group/group-type.pipe';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';
import { UserAdminNavComponent } from './user-admin-nav/user-admin-nav.component';
import { AddEditUserComponent } from './user-admin-user/add-edit-user/add-edit-user.component';
import { AddUserComponent } from './user-admin-user/add-user/add-user.component';
import { EditUserComponent } from './user-admin-user/edit-user/edit-user.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UserFormComponent } from './user-admin-user/user-form/user-form.component';
import { UserListComponent } from './user-admin-user/user-list/user-list.component';
import { UseradminRoutingModule } from './useradmin-routing.module';
import { UseradminComponent } from './useradmin.component';
@NgModule({
  declarations: [
    UseradminComponent,
    UserAdminUserComponent,
    AssignroleComponent,
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
