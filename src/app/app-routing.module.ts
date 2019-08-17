import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';


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
    {path:'', loadChildren: () => import('../app/home/home.module').then(m => m.HomeModule)}

];


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
