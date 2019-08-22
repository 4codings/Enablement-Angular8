import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { environment } from '../../environments/environment';
import { ApiService } from '../service/api/api.service';
import { StorageSessionService } from '../services/storage-session.service';
import { UserService } from '../core/user.service';
import { OptionalValuesService } from '../services/optional-values.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'app';
  text_mgs: string;
  public loading = false;
  public loadingCharts = false;
  public fromNonRepForm = false;
  public selected_APPLICATION = 'ALL';
  public selected_PROCESS = 'ALL';
  public selected_SERVICE = 'ALL';
  public START = true;
  private useTimeout = true;
  private dialogRef = null;
  private unsubscribe = new Subject<void>();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private userIdle: UserIdleService,
    private storageSessionService: StorageSessionService,
    private apiService: ApiService,
    private userService: UserService,
    private optionalService: OptionalValuesService,
  ) {
    //--------------------Workflow Profile---------------------
    this.matIconRegistry.addSvgIcon(
      "settings",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/settings.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "play",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/play.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "schedule",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/schedule.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "list",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/list.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "task",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/task.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "error",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/error.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "dashboard",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/dashboard.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "user",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/user.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "home",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/home.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "logout",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/logout.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "switch",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/switch.svg")
    );
    //--------------------Users Profile---------------------
    this.matIconRegistry.addSvgIcon(
      "group",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/group.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "membership",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/membership.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "playlist_add_check",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/playlist_add_check.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "gantt-chart",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/chart-gantt.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "gantt-chart-red",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/chart-gantt-red.svg")
    );
    //--------------------Deployment Profile---------------------
    this.matIconRegistry.addSvgIcon(
      "search",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/search.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "refresh",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/refresh.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "swap_horiz",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/swap_horiz.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "cloud_upload",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/cloud_upload.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "insert_link",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/insert_link.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "machines2",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/machines2.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "build",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/build.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "developer_mode",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/developer_mode.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "developer_mode",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/developer_mode.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "assignment_ret",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/assignment_ret.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "lock_red",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/lock_red.svg")
    );
  }

  @HostListener('window:beforeunload') goToPage() {
    this.userIdle.resetTimer();
    this.useTimeout = true;
    this.apiService.refreshToken();
  }
  ngOnInit() {
    this.useTimeout = true;
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().pipe(takeUntil(this.unsubscribe)).subscribe((count) => {
      if (this.useTimeout && count === 1) {
        this.dialogRef = this.dialog.open(KeepAliveDialog, { disableClose: true, hasBackdrop: true });
        this.dialogRef.afterClosed().subscribe((result) => {
          if (result === 'keep') {
            this.userIdle.resetTimer();
            this.useTimeout = true;
            this.apiService.refreshToken();
          } else if (result === 'logout') {
            this.useTimeout = false;
            this.apiService.logout('LOGOUT');
            this.logout();
          }
        });
      }
    });
    this.userIdle.onTimeout().subscribe(() => {
      if (this.useTimeout) {
        this.apiService.logout('TIMEOUT');
        this.logout();
      }
      this.useTimeout = false;
    });
     this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.userIdle.resetTimer();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private logout() {
    this.userIdle.stopTimer();
    this.userIdle.stopWatching();
    this.useTimeout = false;
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.userService.clear();
    this.optionalService.applicationOptionalValue.next(null);
    this.optionalService.processOptionalValue.next(null);
    this.optionalService.serviceOptionalValue.next(null);
    this.optionalService.applicationArray = [];
    this.optionalService.serviceArray = [];
    this.optionalService.processArray = [];
    this.optionalService.selectedAppPrcoessValue.next(null);
    //this.storageSessionService.ClearSession('email');
    //this.storageSessionService.ClearSession('agency');
    this.router.navigateByUrl('/login', { skipLocationChange: true });
  }
}

@Component({
  selector: 'keep-alive-dialog',
  template: `
    <h1 mat-dialog-title>Session Timeout</h1>
    <div mat-dialog-content>
      <p>Your session will be timeout in {{timeout}} minutes.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="keepMeAlive()">Keep me alive</button>
      <button mat-button (click)="logout()">Logout</button>
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