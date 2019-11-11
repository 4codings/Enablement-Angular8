import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-output-element',
  templateUrl: './input-output-element.component.html',
  styleUrls: ['./input-output-element.component.scss']
})
export class InputOutputElementComponent implements OnInit {

  inputElement: any;
  outputElement: any;
  showInput: Boolean;
  showOutput: Boolean;
  showInputOutput: Boolean;

  constructor(private dialogRef: MatDialogRef<InputOutputElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.inputElement = this.data.inputElement;
    this.outputElement = this.data.outputElement;
    this.showInput = this.data.showInput;
    this.showOutput = this.data.showOutput;
    this.showInputOutput = this.data.showInputOutput;
  }

  ngOnInit() {
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

}
