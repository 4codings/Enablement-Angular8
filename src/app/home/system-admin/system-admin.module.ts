import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminComponent } from './system-admin.component';
import { PlatformComponent } from './platform/platform.component';
import { SystemAdminRoutingModule } from './system-admin-routing.module';
import { ConnectionComponent } from './connection/connection.component';
import { DeployStatusComponent } from './deploy-status/deploy-status.component';
import { DeploymentComponent } from './deployment/deployment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeploymentsnavbarComponent } from './deploymentsnavbar/deploymentsnavbar.component';
import { InstallComponent } from './install/install.component';
import { MachineComponent } from './machine/machine.component';
import { MachineconnectionComponent } from './machineconnection/machineconnection.component';
import { MachinespecsComponent } from './machinespecs/machinespecs.component';
import { HeaderModule } from '../header/header.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SystemAdminComponent, PlatformComponent, ConnectionComponent, DeployStatusComponent, DeploymentComponent, DeploymentsnavbarComponent, InstallComponent, MachineComponent, MachineconnectionComponent, MachinespecsComponent],
  imports: [
    CommonModule,
    SystemAdminRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SystemAdminModule { }
