import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperComponent } from './developer.component';
import { ParametersComponent } from './parameters/parameters.component';
import { DeveloperRoutingModule } from './developer-routing.module';

@NgModule({
  declarations: [DeveloperComponent, ParametersComponent],
  imports: [
    CommonModule,
    DeveloperRoutingModule
  ]
})
export class DeveloperModule { }
