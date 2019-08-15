import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ]
})
export class DashboardModule { }
