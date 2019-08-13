import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { IsAuthenticatedGuard } from '../core/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path:'', redirectTo:'user', pathMatch: 'full'},
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'Developer',
        loadChildren: () => import('./developer/developer.module').then(m => m.DeveloperModule)
      },
      {
        path: 'User_Admin',
        loadChildren: () => import('./useradmin/useradmin.module').then(m => m.UseradminModule)
      },
      {
        path: 'End_User',
        loadChildren: () => import('./enduser/enduser.module').then(m => m.EnduserModule)
      },
      {
        path: 'System_Admin',
        loadChildren: () => import('./system-admin/system-admin.module').then(m => m.SystemAdminModule)
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
