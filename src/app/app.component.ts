import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UserIdleService } from 'angular-user-idle';
import { UserService } from './core/user.service';
import { OptionalValuesService } from './services/optional-values.service';
import { ApiService } from './service/api/api.service';
import { KeepAliveDialog } from './core/keep-alive-dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'enablement';
  private dialogRef = null;
  private unsubscribe = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userIdle: UserIdleService,
    private userService: UserService,
    private optionalService: OptionalValuesService,
    private apiService: ApiService
  ) { }

  @HostListener('window:beforeunload') goToPage() {
    this.router.navigate(['/user'], { skipLocationChange: true });
  }
  ngOnInit(): void {
    // this.api.http.apiUrl = environment.apiUrl;
    if (environment.production) {
      document.addEventListener('keydown', (e) => {
        if (e.which === 123) {
          return false;
        }
      });
      document.addEventListener('contextmenu', e => {
        e.preventDefault();
      });
    }
    this.initHomeRedirect();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Redirect to /home/dashboard view if user tries to navigate to /home url
   */
  private initHomeRedirect() {
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().pipe(takeUntil(this.unsubscribe)).subscribe((count) => {
      if (!this.userService.isAnonymous && count === 1) {
        this.dialogRef = this.dialog.open(KeepAliveDialog, { disableClose: true, hasBackdrop: true });
        this.dialogRef.afterClosed().subscribe((result) => {
          if (result === 'keep') {
            this.userIdle.resetTimer();
            this.apiService.refreshToken();
          } else if (result === 'logout') {
            this.apiService.logout('LOGOUT');
            this.logout();
          }
        });
      }
    });
    this.userIdle.onTimeout().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      if (!this.userService.isAnonymous) {
        this.apiService.logout('TIMEOUT');
        this.logout();
      }
    });
    this.router.events
      .pipe(takeUntil(this.unsubscribe), filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.userIdle.resetTimer();
        if (!this.userService.isAnonymous && event.url == '/') {
          this.router.navigate(['/user'], { skipLocationChange: true });
        }
      });
  }

  private logout() {
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
