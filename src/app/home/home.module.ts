import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    MatIconModule,
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
