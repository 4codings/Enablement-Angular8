import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UseradminComponent} from './useradmin.component';
import {UserAdminUserComponent} from './user-admin-user/user-admin-user.component';
import {UseradminRoutingModule} from './useradmin-routing.module';
import {
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatFormFieldControl,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatRadioModule,
  MatGridListModule, MatRippleModule
} from '@angular/material';
import {AssignroleComponent} from './assignrole/assignrole.component';
import {AuthorizeroleComponent} from './authorizerole/authorizerole.component';
import {MembershipComponent} from './membership/membership.component';
import {OrganizationComponent} from './organization/organization.component';
import {RoleComponent} from './role/role.component';
import {UserAdminNavComponent} from './user-admin-nav/user-admin-nav.component';
import {UserAdminGroupComponent} from './user-admin-group/user-admin-group.component';
import {EffectsModule} from '@ngrx/effects';
import {UserEffects} from 'src/app/store/user-admin/user/user.effects';
import {UserGroupEffects} from 'src/app/store/user-admin/user-group/usergroup.effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserRoleEffects} from 'src/app/store/user-admin/user-role/userrole.effects';
import {UserMembershipEffects} from 'src/app/store/user-admin/user-membership/usermembership.effects';
import {AuthEffects} from 'src/app/store/user-admin/user-authorization/authorization.effects';
import {AuthorizeComponent} from './authorize/authorize.component';
import {HeaderModule} from '../header/header.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorizeUserComponent} from './authorize-user/authorize-user.component';
import {AuthTypePipe} from './authorize-user/auth-type.pipe';
import {UserFormComponent} from './user-admin-user/user-form/user-form.component';
import {AddUserComponent} from './user-admin-user/add-user/add-user.component';
import {EditUserComponent} from './user-admin-user/edit-user/edit-user.component';
import {GroupFormComponent} from './user-admin-group/group-form/group-form.component';
import {AddGroupComponent} from './user-admin-group/add-group/add-group.component';
import {EditGroupComponent} from './user-admin-group/edit-group/edit-group.component';
import {AddEditRoleComponent} from './role/add-edit-role/add-edit-role.component';
import { AddEditUserComponent } from './user-admin-user/add-edit-user/add-edit-user.component';
import { AddEditAuthorizeComponent } from './authorize/add-edit-authorize/add-edit-authorize.component';
import { GroupTypePipe } from './user-admin-group/group-type.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { UserListComponent } from './user-admin-user/user-list/user-list.component';

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
    AuthorizeUserComponent,
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
    UserListComponent
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
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
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
  entryComponents: [AddUserComponent, AddGroupComponent, EditUserComponent, EditGroupComponent, AddEditRoleComponent, AddEditUserComponent, AddEditAuthorizeComponent]
})
export class UseradminModule {
}
