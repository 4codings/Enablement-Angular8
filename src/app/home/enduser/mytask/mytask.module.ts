import { NgModule } from '@angular/core';

import { MytaskRoutingModule } from './mytask-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MytaskComponent } from './mytask.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [MytaskComponent],
  imports: [
    SharedModule,
    MytaskRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ]
})
export class MytaskModule { }
