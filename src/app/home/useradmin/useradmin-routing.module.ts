import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { UseradminComponent } from './useradmin.component';
import { UserAdminUserComponent } from './user-admin-user/user-admin-user.component';



const routes: Routes = [
    {path: '', component: UseradminComponent},
    {path: 'Adminuser', component: UserAdminUserComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UseradminRoutingModule {
}
