import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SystemAdminComponent } from './system-admin.component';
// import { PlatformComponent } from './platform/platform.component';
import { SystemAdminRoutingModule } from './system-admin-routing.module';
// import { ConnectionComponent } from './connection/connection.component';
// import { DeploymentComponent } from './deployment/deployment.component';
import { SharedModule } from '../../shared/shared.module';
import { DeploymentsnavbarComponent } from './deploymentsnavbar/deploymentsnavbar.component';
// import { MachineComponent } from './machine/machine.component';
// import { MachineconnectionComponent } from './machineconnection/machineconnection.component';
// import { MachinespecsComponent } from './machinespecs/machinespecs.component';
import { HeaderModule } from '../header/header.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';
import { MachinesListComponent } from './overview/machines-list/machines-list.component';
import { SingleExeComponent } from './overview/single-exe/single-exe.component';
import { ExeTileListComponent } from './overview/exe-tile-list/exe-tile-list.component';
import { AddPlatformDialogComponent } from './overview/add-platform-dialog/add-platform-dialog.component';
import { EditExeTypeDialogComponent } from './overview/dialogs/edit-exe-type-dialog/edit-exe-type-dialog.component';
import { ExeTypesListComponent } from './overview/exe-types-list/exe-types-list.component';
import { SingleMachineComponent } from './overview/single-machine/single-machine.component';
import { MachineTileListComponent } from './overview/machine-tile-list/machine-tile-list.component';
import { FilterExetypePipe } from './overview/pipes/filter-exetype.pipe';
import { FilterMachinesPipe } from './overview/pipes/filter-machines.pipe';
import { AddExeDialogComponent } from './overview/dialogs/add-exe-dialog/add-exe-dialog.component';
import { AddConnectionDialogComponent } from './overview/dialogs/add-connection-dialog/add-connection-dialog.component';
import { EditConnectionDialogComponent } from './overview/dialogs/edit-connection-dialog/edit-connection-dialog.component';
import { ManageMachinesComponent } from './overview/dialogs/manage-machines/manage-machines.component';
import { AssignConnectionExeComponent } from './overview/dialogs/assign-connection-exe/assign-connection-exe.component';
import { AssignMcnPlfComponent } from './overview/dialogs/assign-mcn-plf/assign-mcn-plf.component';
import { FilterPlfExesPipe } from './overview/pipes/filter-plf-exes.pipe';
import { InstallComponent } from './install/install.component';
import { DeployStatusComponent } from './deploy-status/deploy-status.component';

@NgModule({
  declarations: [SystemAdminComponent, DeploymentsnavbarComponent, OverviewComponent, MachinesListComponent, SingleExeComponent, ExeTileListComponent, AddPlatformDialogComponent, EditExeTypeDialogComponent, ExeTypesListComponent, SingleMachineComponent, MachineTileListComponent, FilterExetypePipe, FilterMachinesPipe, AddExeDialogComponent, AddConnectionDialogComponent, EditConnectionDialogComponent, ManageMachinesComponent, AssignConnectionExeComponent, AssignMcnPlfComponent, FilterPlfExesPipe, DeployStatusComponent, InstallComponent],
  imports: [
    CommonModule,
    SystemAdminRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
  ],
  entryComponents: [AddPlatformDialogComponent, AssignConnectionExeComponent, EditExeTypeDialogComponent, AddExeDialogComponent, AddConnectionDialogComponent, EditConnectionDialogComponent, ManageMachinesComponent, AssignMcnPlfComponent]
})
export class SystemAdminModule {
  constructor() {
  }
}
