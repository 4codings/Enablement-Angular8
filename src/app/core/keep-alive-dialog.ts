import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'keep-alive-dialog',
  template: `
    <div class="keep-alive">
      <h1 mat-dialog-title>Session Timeout</h1>
      <div mat-dialog-content>
        <p>Your session will be timeout in {{timeout}} minutes.</p>
      </div>
      <div mat-dialog-actions class="action-btns">
        <button mat-button (click)="keepMeAlive()">Keep me alive</button>
        <button mat-button (click)="logout()">Logout</button>
      </div>
    </div>
  `,
})
export class KeepAliveDialog {

  public timeout = environment.timeout % 60 === 0 ? environment.timeout / 60 : (environment.timeout / 60).toFixed(1);

  constructor(
    private dialogRef: MatDialogRef<KeepAliveDialog>
  ) { }

  public keepMeAlive() {
    this.dialogRef.close('keep');
  }

  public logout() {
    this.dialogRef.close('logout');
  }

}