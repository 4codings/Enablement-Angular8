import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-connection-dialog',
  templateUrl: './add-connection-dialog.component.html',
  styleUrls: ['./add-connection-dialog.component.scss']
})
export class AddConnectionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddConnectionDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick() {

  }

}
