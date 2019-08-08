import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessDesignRoutingModule } from './process-design-routing.module';
import { ProcessDesignComponent } from './process-design.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedularComponent } from './schedular/schedular.component';

@NgModule({
  declarations: [ProcessDesignComponent, SchedularComponent],
  imports: [
    SharedModule,
    ProcessDesignRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ]
})
export class ProcessDesignModule { }
