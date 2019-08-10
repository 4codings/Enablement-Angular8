import { NgModule } from '@angular/core';

import { ExceptionRoutingModule } from './exception-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExceptionComponent } from './exception.component';
import { HeaderModule } from '../../header/header.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ExceptionComponent],
  imports: [
    SharedModule,
    ExceptionRoutingModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ]
})
export class ExceptionModule { }
