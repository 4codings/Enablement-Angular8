import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { EnduserRoutingModule } from './enduser-routing.module';
import { EnduserComponent } from '../enduser/enduser.component';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { SharedModule } from '../../shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { FormComponent } from './execute/form/form.component';
import { DialogChartsComponent } from './report-table/dialog-charts/dialog-charts.component';
import { ArtifactFormComponent } from './execute/artifact-form/artifact-form.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { PersonalizationTableComponent } from './report-table/personalization-table/personalization-table.component';
import { ChartsComponent } from './report-table/charts/charts.component';


@NgModule({
  declarations: [
    EnduserComponent,
    UsernavbarComponent,
    FormComponent,
    ArtifactFormComponent,
    NonRepeatableFormComponent,
    RepeatableFormComponent,
    ReportTableComponent,
    DialogChartsComponent,
    PersonalizationTableComponent,
    ChartsComponent
  ],
  imports: [
    EnduserRoutingModule,
    SharedModule,
    HeaderModule,
    NgbModule,
    ModalModule.forRoot(),
  ],
  entryComponents: [DialogChartsComponent]
})
export class EnduserModule {
  constructor() {
  }
}
