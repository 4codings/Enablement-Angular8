import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SplitFormsPipe } from '../split-forms.pipe';

@NgModule({
  declarations: [HomeComponent, SplitFormsPipe],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
})
export class HomeModule { }
