import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent implements OnInit {

  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Are you sure ?';
  @Input() noBtnText: string = 'NO';
  @Input() yesBtnText: string = 'YES';

  constructor(private dialogRef: MatDialogRef<ConfirmationAlertComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onNoBtnClick() {
    this.dialogRef.close(false);
  }

  onYesBtnClick() {
    this.dialogRef.close(true);
  }

}
