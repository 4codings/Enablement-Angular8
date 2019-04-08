import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemAdminComponent } from './system-admin.component';
import { PlatformComponent } from './platform/platform.component';
import { SystemAdminRoutingModule } from './system-admin-routing.module';

@NgModule({
  declarations: [SystemAdminComponent, PlatformComponent],
  imports: [
    CommonModule,
    SystemAdminRoutingModule
  ]
})
export class SystemAdminModule { }
