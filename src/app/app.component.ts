import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'enablement';

  constructor(
    // private /api: ApiSdkService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.api.http.apiUrl = environment.apiUrl;

    this.initHomeRedirect();
  }

  /**
   * Redirect to /home/dashboard view if user tries to navigate to /home url
   */
  private initHomeRedirect() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url == '/') { this.router.navigate(['/user']); }
      });
  }
}
