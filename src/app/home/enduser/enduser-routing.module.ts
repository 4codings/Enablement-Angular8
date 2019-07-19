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
import { InputArtComponent } from './execute/Input_Art/InputArt.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { ProcessDesignComponent } from './process-design/process-design.component';

const routes: Routes = [{
  path: '',
  component: EnduserComponent,
  children: [
    { path: '', redirectTo: 'Design', pathMatch: 'full' },
    { path: 'Execute', component: ExecuteComponent },
    { path: 'Mytask', component: MytaskComponent },
    { path: 'Exception', component: ExceptionComponent },
    { path: 'ScheduleAction', component: SchdActnComponent },
    { path: 'Process', component: ProcessComponent },
    { path: 'Design', component: ProcessDesignComponent },
    { path: 'Orchestrate', component: OrchestrateComponent },
    { path: 'Dashboard', component: DashboardComponent },
  ]
},
{ path: 'InputArtForm', component: InputArtComponent, runGuardsAndResolvers: 'always' },
{ path: 'RepeatForm', component: RepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'NonRepeatForm', component: NonRepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'ReportTable', component: ReportTableComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnduserRoutingModule { }
