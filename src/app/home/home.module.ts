import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent, KeepAliveDialog } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SplitFormsPipe } from '../split-forms.pipe';

@NgModule({
  declarations: [HomeComponent, KeepAliveDialog, SplitFormsPipe],
  imports: [
    MatIconModule,
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    HttpModule,
    FormsModule
  ],
  entryComponents: [KeepAliveDialog]
})
export class HomeModule { }
