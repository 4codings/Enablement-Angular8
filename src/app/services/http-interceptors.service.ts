import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../core/user.service';
import { UserIdleService } from 'angular-user-idle';
import { tap } from 'rxjs/operators';
import { ApiService } from '../service/api/api.service';
import { Router } from '@angular/router';
import { OptionalValuesService } from './optional-values.service';
import { RollserviceService } from './rollservice.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorsService implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private userIdle: UserIdleService,
    private router: Router,
    private optionalService: OptionalValuesService,
    private rollserviceService: RollserviceService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.userIdle.resetTimer();
    var sessiondata = this.userService.getDetailFromStorage();

    if (sessiondata) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${sessiondata.TOKEN}`)
      });
      return next.handle(cloned).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.sessionLogout();
          }
        }
      }));
    } else {
      return next.handle(request)
        .pipe(tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        }, (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.sessionLogout();
            }
          }
        }));
    }
  }
  sessionLogout() {
    this.optionalService.applicationOptionalValue.next(null);
    this.optionalService.processOptionalValue.next(null);
    this.optionalService.serviceOptionalValue.next(null);
    this.optionalService.applicationProcessValue.next(null);
    this.optionalService.applicationArray = [];
    this.optionalService.serviceArray = [];
    this.optionalService.processArray = [];
    this.optionalService.applicationProcessArray = [];
    this.userService.clear();
    this.rollserviceService.clear();
    this.router.navigateByUrl('/login', { skipLocationChange: true });
  }
}
