import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperComponent } from './developer.component';
import { ParametersComponent } from './parameters/parameters.component';
import { DeveloperRoutingModule } from './developer-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeveloperComponent, ParametersComponent],
  imports: [
    CommonModule,
    DeveloperRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule
  ]
})
export class DeveloperModule { }
