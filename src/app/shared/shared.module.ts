import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormErrorMsgComponent} from "./components/form-error-msg/form-error-msg.component";
import {NoDataMsgComponent} from "./components/no-data-msg/no-data-msg.component";
// import {CoreModule} from "../core/core.module";
import {RouterModule} from "@angular/router";


@NgModule({
    imports:      [
        CommonModule,
        // CoreModule,
        RouterModule
    ],
    declarations: [
        FormErrorMsgComponent,
        NoDataMsgComponent,
    ],
    exports:      [
        FormErrorMsgComponent,
        NoDataMsgComponent,
    ]
})
export class SharedModule {
}
