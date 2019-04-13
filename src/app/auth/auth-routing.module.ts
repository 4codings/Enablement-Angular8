import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {AuthComponent} from "./auth.component";
import { AnonymousOnlyGuard } from '../core/guards/anonymous-only.guard';
// import {AnonymousOnlyGuard} from "../core/guards/anonymous-only.guard";


const routes: Routes = [
    {
        path:'auth', component: AuthComponent,
        children:    [
            {path: 'login', loadChildren: './login/login.module#LoginModule'}
        ],
        canActivate: [AnonymousOnlyGuard]
    },
];


@NgModule({
    imports:      [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports:      [RouterModule],
    declarations: []
})
export class AuthRoutingModule {
}
