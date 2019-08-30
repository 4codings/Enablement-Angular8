import { NgModule } from '@angular/core';

import { ProcessDesignRoutingModule } from './process-design-routing.module';
import { ProcessDesignComponent, IsOutsideDirective } from './process-design.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { SchedularComponent } from './schedular/schedular.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ResolveComponent } from './resolve/resolve.component';
import { ApproveComponent } from './approve/approve.component';

@NgModule({
  declarations: [ProcessDesignComponent, SchedularComponent, MonitorComponent, ResolveComponent, ApproveComponent, IsOutsideDirective],
  imports: [
    SharedModule,
    ProcessDesignRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ],
  entryComponents: []
})
export class ProcessDesignModule { }
