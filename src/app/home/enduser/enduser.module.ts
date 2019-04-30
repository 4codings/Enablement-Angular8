import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { EnduserRoutingModule } from './enduser-routing.module';
import { EnduserComponent } from '../enduser/enduser.component';
import { ExecuteComponent } from './execute/execute.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { SchdActnComponent } from './schd-actn/schd-actn.component';
import { ProcessComponent } from './process/process.component';
import { OrchestrateComponent } from './orchestrate/orchestrate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EnduserComponent, 
    ExecuteComponent, 
    MytaskComponent, 
    ExceptionComponent, 
    SchdActnComponent, 
    ProcessComponent, 
    OrchestrateComponent, 
    DashboardComponent, 
    UsernavbarComponent],
  imports: [
    CommonModule,
    EnduserRoutingModule,
    SharedModule,
    HeaderModule,
    HttpClientModule,
    FormsModule
  ]
})
export class EnduserModule { }
