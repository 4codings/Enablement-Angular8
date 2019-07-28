import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'user',
    // },
    // {
    // path:       '',
    // loadChildren: '../app/home/home.module#HomeModule',
    // redirectTo: '/home/dashboard'
    // },
    {path:'', loadChildren: '../app/home/home.module#HomeModule'}

];


@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
