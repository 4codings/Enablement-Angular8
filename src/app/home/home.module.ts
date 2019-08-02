import { NgModule } from '@angular/core';
import { HomeComponent, KeepAliveDialog } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SplitFormsPipe } from '../split-forms.pipe';

@NgModule({
  declarations: [HomeComponent, KeepAliveDialog, SplitFormsPipe],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  entryComponents: [KeepAliveDialog]
})
export class HomeModule { }
