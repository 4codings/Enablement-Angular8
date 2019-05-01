import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent, KeepAliveDialog } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, KeepAliveDialog],
  imports: [
    MatIconModule,
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  entryComponents: [KeepAliveDialog]
})
export class HomeModule { }
