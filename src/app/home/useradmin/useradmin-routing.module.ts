import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignroleComponent } from './assignrole/assignrole.component';
import { AuthorizeComponent } from './authorize/authorize.component';
import { OverviewComponent } from './overview/overview.component';
import { RoleComponent } from './role/role.component';
import { UserAdminGroupComponent } from './user-admin-group/user-admin-group.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';
import { UseradminComponent } from './useradmin.component';


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
            {path: 'Assignrole', component: AssignroleComponent},
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
