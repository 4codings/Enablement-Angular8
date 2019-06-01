import { Component, OnInit, HostListener } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
import { UserService } from './core/user.service';
import { OptionalValuesService } from './services/optional-values.service';

declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'enablement';

  constructor(
    // private /api: ApiSdkService,
    private userService: UserService,
    private optionalService: OptionalValuesService,
    private router: Router,
  ) {
  }

  @HostListener('window:beforeunload') goToPage() {
    this.optionalService.applicationOptionalValue.next(null);
    this.optionalService.processOptionalValue.next(null);
    this.optionalService.serviceOptionalValue.next(null);
    this.optionalService.applicationArray = [];
    this.optionalService.serviceArray = [];
    this.optionalService.processArray = [];
    this.userService.clear();
    this.router.navigate(['/'], { skipLocationChange: true });
  }


  ngOnInit(): void {
    // this.api.http.apiUrl = environment.apiUrl;
    this.router.navigateByUrl('/user', { skipLocationChange: true });
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
