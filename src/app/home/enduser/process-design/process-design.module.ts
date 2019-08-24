import { NgModule } from '@angular/core';

import { ProcessDesignRoutingModule } from './process-design-routing.module';
import { ProcessDesignComponent } from './process-design.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { SchedularComponent } from './schedular/schedular.component';
import { ViewerComponent } from './viewer/viewer.component';
import { InputOutputElementComponent } from './input-output-element/input-output-element.component';

@NgModule({
  declarations: [ProcessDesignComponent, SchedularComponent, ViewerComponent, InputOutputElementComponent],
  imports: [
    SharedModule,
    ProcessDesignRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ],
  entryComponents: [InputOutputElementComponent]
})
export class ProcessDesignModule { }
