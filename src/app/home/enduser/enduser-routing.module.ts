import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnduserComponent } from './enduser.component';
import { ArtifactFormComponent } from './execute/artifact-form/artifact-form.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { PersonalizationTableComponent } from './report-table/personalization-table/personalization-table.component';

const routes: Routes = [{
  path: '',
  component: EnduserComponent,
  children: [
    { path: '', redirectTo: 'Design', pathMatch: 'full' },
    {
      path: 'Mytask',
      loadChildren: () => import('./mytask/mytask.module').then(m => m.MytaskModule)
    },
    {
      path: 'Exception',
      loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule)
    },
    {
      path: 'Design',
      loadChildren: () => import('./process-design/process-design.module').then(m => m.ProcessDesignModule)
    },
    {
      path: 'Dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
  ]
},
{ path: 'InputArtForm', component: ArtifactFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'RepeatForm', component: RepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'NonRepeatForm', component: NonRepeatableFormComponent, runGuardsAndResolvers: 'always' },
{ path: 'ReportTable', component: ReportTableComponent },
{ path: 'ptable', component: PersonalizationTableComponent },

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
