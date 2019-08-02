import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnduserComponent } from './enduser.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { ProcessDesignComponent } from './process-design/process-design.component';
import { ArtifactFormComponent } from './execute/artifact-form/artifact-form.component';

const routes: Routes = [{
  path: '',
  component: EnduserComponent,
  children: [
    { path: '', redirectTo: 'Design', pathMatch: 'full' },
    { path: 'Mytask', component: MytaskComponent },
    { path: 'Exception', component: ExceptionComponent },
    { path: 'Design', component: ProcessDesignComponent },
    { path: 'Dashboard', component: DashboardComponent },
  ]
},
{ path: 'InputArtForm', component: ArtifactFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'RepeatForm', component: RepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'NonRepeatForm', component: NonRepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'ReportTable', component: ReportTableComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnduserRoutingModule { }
