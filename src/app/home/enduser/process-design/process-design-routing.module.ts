import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessDesignComponent } from './process-design.component';
import { MonitorComponent } from './monitor/monitor.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessDesignComponent
  },
  {
    path: 'monitor',
    component: MonitorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessDesignRoutingModule { }
