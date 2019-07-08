import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformsListComponent, DialogData } from '../platforms-list/platforms-list.component';

@Component({
  selector: 'app-add-platform-dialog',
  templateUrl: './add-platform-dialog.component.html',
  styleUrls: ['./add-platform-dialog.component.scss']
})
export class AddPlatformDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddPlatformDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onBtnAddClick() {

  }

}
