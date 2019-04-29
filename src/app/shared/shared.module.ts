import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormErrorMsgComponent} from './components/form-error-msg/form-error-msg.component';
import {NoDataMsgComponent} from './components/no-data-msg/no-data-msg.component';
// import {CoreModule} from "../core/core.module";
import {RouterModule} from '@angular/router';
import { MatIconModule, MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
    imports:      [
        CommonModule,
        // CoreModule,
        RouterModule,
        MatCardModule,
        MatIconModule,
        FlexLayoutModule,
        MatTooltipModule
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
        MatTooltipModule
    ]
})
export class SharedModule {
}
