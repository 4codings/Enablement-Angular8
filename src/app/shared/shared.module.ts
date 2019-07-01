import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChartsModule } from 'ng2-charts-x';

import { FormErrorMsgComponent } from './components/form-error-msg/form-error-msg.component';
import { NoDataMsgComponent } from './components/no-data-msg/no-data-msg.component';
// import {CoreModule} from "../core/core.module";
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatListModule, MatIconModule, MatCardModule, MatInputModule, MatRadioModule, MatButtonModule,
  MatSidenavModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
  MatCheckboxModule, MatAutocompleteModule, MatSortModule, MatDividerModule
} from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SplitLastPipe, MyFilterPipe } from '../home/enduser/execute/MyFilterPipe ';
import { MyFilterPipe1 } from '../home/enduser/schd-actn/myFilterPipe1';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { TreeviewModule } from 'ngx-treeview';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  imports: [
    CommonModule,
    // CoreModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    MatChipsModule,
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
    MatSortModule,
    MatDividerModule,
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
    MatMenuModule,
    TreeviewModule.forRoot(),
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
    MatSidenavModule,
    MatDividerModule,
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
    MatChipsModule,
    MatSortModule,
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
    ConfirmationAlertComponent,
    TreeviewModule
  ]
})
export class SharedModule {
}
