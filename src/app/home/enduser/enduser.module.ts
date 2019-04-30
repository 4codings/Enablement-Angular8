import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnduserRoutingModule } from './enduser-routing.module';
import { EnduserComponent } from '../enduser/enduser.component';
import { ExecuteComponent } from './execute/execute.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { SchdActnComponent } from './schd-actn/schd-actn.component';
import { ProcessComponent } from './process/process.component';
import { OrchestrateComponent } from './orchestrate/orchestrate.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [EnduserComponent, ExecuteComponent, MytaskComponent, ExceptionComponent, SchdActnComponent, ProcessComponent, OrchestrateComponent, DashboardComponent],
  imports: [
    CommonModule,
    EnduserRoutingModule
  ]
})
export class EnduserModule { }
