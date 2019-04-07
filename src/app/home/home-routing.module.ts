import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";
// import {IsAuthenticatedGuard} from "../core/guards/is-authenticated.guard";


const routes: Routes = [
    {
        path:        'home',
        component:   HomeComponent,
        children:    [
        //     {
        //         path:         'dashboard',
        //         loadChildren: './dashboard/dashboard.module#DashboardModule'
        //     },
            {
                path:         'user',
                loadChildren: './user/user.module#UserModule'
            }
            // {
            //     path:         'employee',
            //     loadChildren: './employee/employee.module#EmployeeModule'
            // },
            // {
            //     path:         'project',
            //     loadChildren: './project/project.module#ProjectModule'
            // }

        ],
        // canActivate: [IsAuthenticatedGuard]
    },
];


@NgModule({
    imports:      [
        RouterModule.forChild(routes)
    ],
    exports:      [RouterModule],
    declarations: []
})
export class HomeRoutingModule {
}
