import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnduserComponent } from './enduser.component';
import { ProcessDesignComponent } from './process-design/process-design.component';
import { MytaskModule } from './mytask/mytask.module';
import { ProcessDesignModule } from './process-design/process-design.module';
import { ExceptionModule } from './exception/exception.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ArtifactFormComponent } from './execute/artifact-form/artifact-form.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';

const routes: Routes = [{
  path: '',
  component: EnduserComponent,
  children: [
    { path: '', redirectTo: 'Design', pathMatch: 'full' },
    {
      path: 'Mytask',
      loadChildren: './mytask/mytask.module#MytaskModule'
      // loadChildren: () => MytaskModule,
    },
    {
      path: 'Exception',
      loadChildren: './exception/exception.module#ExceptionModule'
      // loadChildren: () => ExceptionModule,
    },
    {
      path: 'Design',
      loadChildren: './process-design/process-design.module#ProcessDesignModule'
      // loadChildren: () => ProcessDesignModule,
    },
    {
      path: 'Dashboard',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
      // loadChildren: () => DashboardModule,
    },
  ]
},
{ path: 'InputArtForm', component: ArtifactFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'RepeatForm', component: RepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'NonRepeatForm', component: NonRepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'ReportTable', component: ReportTableComponent },

  // { path: 'InputArtForm', loadChildren: () => ArtifactFormModule, runGuardsAndResolvers: 'always' },
  // { path: 'RepeatForm', loadChildren: () => RepeatableFormModule, runGuardsAndResolvers: 'always' },
  // { path: 'NonRepeatForm', loadChildren: () => NonRepeatableFormModule, runGuardsAndResolvers: 'always' },
  // {
  //   path: 'ReportTable',
  //   loadChildren: () => ReportTableModule,
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnduserRoutingModule { }
