import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { IsAuthenticatedGuard } from '../core/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'developer',
        loadChildren: './developer/developer.module#DeveloperModule'
      },
      {
        path: 'User_Admin',
        loadChildren: './useradmin/useradmin.module#UseradminModule'
      }
    ],
    canActivate: [IsAuthenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class HomeRoutingModule {}
