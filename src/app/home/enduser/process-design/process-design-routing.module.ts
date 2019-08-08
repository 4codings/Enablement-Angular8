import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessDesignComponent } from './process-design.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessDesignComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessDesignRoutingModule { }
