import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormErrorMsgComponent} from './components/form-error-msg/form-error-msg.component';
import {NoDataMsgComponent} from './components/no-data-msg/no-data-msg.component';
// import {CoreModule} from "../core/core.module";
import {RouterModule} from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatListModule, MatIconModule, MatCardModule, MatInputModule,MatRadioModule, MatButtonModule, 
    MatFormFieldControl, MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, 
    MatCheckboxModule, MatAutocompleteModule } from '@angular/material';
import {MatTableModule} from '@angular/material/table';

@NgModule({
    imports:      [
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
        MatTableModule
    ],
    declarations: [
        FormErrorMsgComponent,
        NoDataMsgComponent,
    ],
    exports:      [
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
        MatTableModule
    ]
})
export class SharedModule {
}
