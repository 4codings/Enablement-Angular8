import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts-x';
import { ResizableModule } from 'angular-resizable-element';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ResizableModule,
    ChartsModule,
    DragDropModule,
    AngularResizedEventModule
  ]
})
export class ReportChartsModule { }
