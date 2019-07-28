import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AnonymousOnlyGuard} from '../core/guards/anonymous-only.guard';
// import {AnonymousOnlyGuard} from "../core/guards/anonymous-only.guard";


const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [AnonymousOnlyGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AuthRoutingModule {
}
