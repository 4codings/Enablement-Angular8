import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemAdminComponent } from './system-admin.component';
import { OverviewComponent } from './overview/overview.component';
import { DeployStatusComponent } from './deploy-status/deploy-status.component';
import { InstallComponent } from './install/install.component';

const routes: Routes = [{
  path: '', component: SystemAdminComponent,
  children: [
    { path: '', redirectTo: 'SystemOverView', pathMatch: 'full' },
    { path: 'AppDeploy', component: DeployStatusComponent },
    { path: 'Install', component: InstallComponent },
    { path: 'SystemOverView', component: OverviewComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemAdminRoutingModule {
}
