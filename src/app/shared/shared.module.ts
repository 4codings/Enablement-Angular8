import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ColorPickerModule} from 'ngx-color-picker';
import {ChartsModule} from 'ng2-charts';

import {FormErrorMsgComponent} from './components/form-error-msg/form-error-msg.component';
import {NoDataMsgComponent} from './components/no-data-msg/no-data-msg.component';
// import {CoreModule} from "../core/core.module";
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  MatListModule, MatIconModule, MatCardModule, MatInputModule, MatRadioModule, MatButtonModule,
  MatFormFieldControl, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatCheckboxModule, MatAutocompleteModule
} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SplitLastPipe, MyFilterPipe} from '../home/enduser/execute/MyFilterPipe ';
import {MyFilterPipe1} from '../home/enduser/schd-actn/myFilterPipe1';
import {MatMenuModule} from '@angular/material/menu';
import {ConfirmationAlertComponent} from './components/confirmation-alert/confirmation-alert.component';

@NgModule({
  imports: [
    CommonModule,
    // CoreModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTableModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSliderModule,
    ColorPickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  declarations: [
    FormErrorMsgComponent,
    NoDataMsgComponent,
    MyFilterPipe,
    MyFilterPipe1,
    SplitLastPipe,
    ConfirmationAlertComponent
  ],
  entryComponents: [ConfirmationAlertComponent],
  exports: [
    FormErrorMsgComponent,
    NoDataMsgComponent,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatTableModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSliderModule,
    ColorPickerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ChartsModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MyFilterPipe,
    MyFilterPipe1,
    SplitLastPipe,
    MatMenuModule,
    ConfirmationAlertComponent
  ]
})
export class SharedModule {
}
