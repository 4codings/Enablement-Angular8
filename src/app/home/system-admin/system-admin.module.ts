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
import { OverviewComponent } from './overview/overview.component';
import { PlatformsListComponent } from './overview/platforms-list/platforms-list.component';
import { MachinesListComponent } from './overview/machines-list/machines-list.component';
import { SingleExeComponent } from './overview/single-exe/single-exe.component';
import { ExeTileListComponent } from './overview/exe-tile-list/exe-tile-list.component';
import { AddPlatformDialogComponent } from './overview/add-platform-dialog/add-platform-dialog.component';
import { EditExeTypeDialogComponent } from './overview/dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';

@NgModule({
  declarations: [SystemAdminComponent, PlatformComponent, ConnectionComponent, DeployStatusComponent, DeploymentComponent, DeploymentsnavbarComponent, InstallComponent, MachineComponent, MachineconnectionComponent, MachinespecsComponent, OverviewComponent, PlatformsListComponent, MachinesListComponent, SingleExeComponent, ExeTileListComponent, AddPlatformDialogComponent, EditExeTypeDialogComponent],
  imports: [
    CommonModule,
    SystemAdminRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
  ],
  entryComponents: [AddPlatformDialogComponent, EditExeTypeDialogComponent]
})
export class SystemAdminModule {
  constructor(){
    console.log("SystemAdminModule => ");
  }
}
