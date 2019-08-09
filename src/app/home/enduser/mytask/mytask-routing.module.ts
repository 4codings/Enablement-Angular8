import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MytaskComponent } from './mytask.component';

const routes: Routes = [
  {
    path: '',
    component: MytaskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MytaskRoutingModule { }
