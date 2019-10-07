import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';
import { RoleComponent } from './role/role.component';
import { OrganizationComponent } from './organization/organization.component';
import { MembershipComponent } from './membership/membership.component';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AuthorizeroleComponent } from './authorizerole/authorizerole.component';
import { AuthComponent } from 'src/app/auth/auth.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import {OverviewComponent} from './overview/overview.component';


const routes: Routes = [
    {
        path: '',
        component: UseradminComponent,
        children: [
            {path: '', redirectTo: 'UserAuth', pathMatch: 'full'},
            {path: 'Adminuser', component: UserAdminUserComponent},
            {path: 'UserGroup', component: UserAdminGroupComponent},
            {path: 'UserRole', component: RoleComponent},
            {path: 'UserAuthorize', component: AuthorizeComponent},
            {path: 'Organization', component: OrganizationComponent},
            {path: 'Membership', component: MembershipComponent},
            {path: 'Assignrole', component: AssignroleComponent},
            {path: 'Authorizerole', component: AuthorizeroleComponent},
            {path: 'UserAuth', component: OverviewComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UseradminRoutingModule {
}
