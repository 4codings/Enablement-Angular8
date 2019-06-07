import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { EnduserRoutingModule } from './enduser-routing.module';
import { EnduserComponent } from '../enduser/enduser.component';
import { ExecuteComponent } from './execute/execute.component';
import { MytaskComponent } from './mytask/mytask.component';
import { ExceptionComponent } from './exception/exception.component';
import { SchdActnComponent } from './schd-actn/schd-actn.component';
import { ProcessComponent } from './process/process.component';
import { OrchestrateComponent } from './orchestrate/orchestrate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepeatAfterComponent } from './schd-actn/repeat-after/repeat-after.component';
import { FormComponent } from './execute/form/form.component';
import { DialogScheduleComponent } from './execute/dialog-schedule/dialog-schedule.component';
import { InputArtComponent } from './execute/Input_Art/InputArt.component';
import { NonRepeatableFormComponent } from './execute/non-repeatable-form/non-repeatable-form.component';
import { RepeatProcessComponent } from './execute/repeat-process/repeat-process.component';
import { RepeatableFormComponent } from './execute/repeatable-form/repeatable-form.component';
import { ReportTableComponent } from './report-table/report-table.component';
import { DialogChartsComponent } from './report-table/dialog-charts/dialog-charts.component';
import { MyFilterPipe, SplitLastPipe } from './execute/MyFilterPipe ';
import { MyFilterPipe1 } from './schd-actn/myFilterPipe1';
import { DeleteConfirmComponent } from './execute/delete-confirm/delete-confirm.component';

@NgModule({
  declarations: [
    EnduserComponent, 
    ExecuteComponent, 
    MytaskComponent, 
    ExceptionComponent, 
    SchdActnComponent, 
    ProcessComponent, 
    OrchestrateComponent, 
    DashboardComponent, 
    UsernavbarComponent,
    RepeatAfterComponent,
    FormComponent,
    DialogScheduleComponent,
    InputArtComponent,
    NonRepeatableFormComponent,
    RepeatProcessComponent,
    RepeatableFormComponent,
    ReportTableComponent,
    DialogChartsComponent,
    DeleteConfirmComponent
  ],
  imports: [
    CommonModule,
    EnduserRoutingModule,
    SharedModule,
    HeaderModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgbModule,
    ModalModule.forRoot(),
  ],
  entryComponents: [DialogScheduleComponent, DialogChartsComponent, DeleteConfirmComponent]
})
export class EnduserModule {
  constructor(){
    console.log("EnduserModule => ");
  }
}
