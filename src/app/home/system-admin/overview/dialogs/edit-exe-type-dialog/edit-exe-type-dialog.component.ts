import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-exe-type-dialog',
  templateUrl: './edit-exe-type-dialog.component.html',
  styleUrls: ['./edit-exe-type-dialog.component.scss']
})
export class EditExeTypeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditExeTypeDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  
  onBtnCancelClick(): void {
    this.dialogRef.close();
  }
}
