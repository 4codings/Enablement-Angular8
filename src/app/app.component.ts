import { Component, OnInit, HostListener } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
import { UserService } from './core/user.service';
import { OptionalValuesService } from './services/optional-values.service';
import { ApiService } from './service/api/api.service';
import { MatDialog } from '@angular/material';
import { KeepAliveDialog } from './home/home.component';

declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'enablement';
  private dialogRef = null;

  constructor(
    // private /api: ApiSdkService,
    private userService: UserService,
    private optionalService: OptionalValuesService,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // this.api.http.apiUrl = environment.apiUrl;
    if (environment.production) {
      $(document).keydown(function (e) {
        if (e.which === 123) {
          return false;
        }
      });
      $(document).bind("contextmenu", function (e) {
        e.preventDefault();
      });
      this.initHomeRedirect();
    }
  }

  /**
   * Redirect to /home/dashboard view if user tries to navigate to /home url
   */
  private initHomeRedirect() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url == '/') { this.router.navigate(['/user'], { skipLocationChange: true }); }
      });
  }
}
