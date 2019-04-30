import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnduserComponent } from './enduser.component';
import { ExecuteComponent } from './execute/execute.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { SchdActnComponent } from './schd-actn/schd-actn.component';
import { ProcessComponent } from './process/process.component';
import { OrchestrateComponent } from './orchestrate/orchestrate.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: EnduserComponent,
    children: [
      { path: '', redirectTo: 'Execute', pathMatch: 'full' },
      { path: 'Execute', component: ExecuteComponent },
      { path: 'Mytask', component: MytaskComponent },
      { path: 'Exception', component: ExceptionComponent },
      { path: 'ScheduleAction', component: SchdActnComponent },
      { path: 'Process', component: ProcessComponent },
      { path: 'Orchestrate', component: OrchestrateComponent },
      { path: 'Dashboard', component: DashboardComponent },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnduserRoutingModule { }
