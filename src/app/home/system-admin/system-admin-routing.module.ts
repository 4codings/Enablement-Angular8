import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SystemAdminComponent } from './system-admin.component';
import { PlatformComponent } from './platform/platform.component';
import { DeployStatusComponent } from './deploy-status/deploy-status.component';
import { InstallComponent } from './install/install.component';
import { MachineconnectionComponent } from './machineconnection/machineconnection.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { ConnectionComponent } from './connection/connection.component';
import { MachineComponent } from './machine/machine.component';
import { MachinespecsComponent } from './machinespecs/machinespecs.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [{
    path: '', component: SystemAdminComponent,
    children: [
      { path: '', redirectTo: 'SystemOverView', pathMatch: 'full' },
      { path: 'AppDeploy', component: DeployStatusComponent },
      { path: 'Install', component: InstallComponent },
    //   { path: 'Machineconnection', component: MachineconnectionComponent },
    //   { path: 'Deployment', component: DeploymentComponent },
    //   { path: 'Connection', component: ConnectionComponent },
    //   { path: 'Machine', component: MachineComponent },
    //   { path: 'Machinespecs', component: MachinespecsComponent },
    //   { path: 'Platform', component: PlatformComponent },
      { path: 'SystemOverView', component: OverviewComponent }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemAdminRoutingModule {
}
