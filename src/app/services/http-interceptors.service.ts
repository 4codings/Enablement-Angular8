import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../core/user.service';
import { UserIdleService } from 'angular-user-idle';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorsService implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private userIdle: UserIdleService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.userIdle.resetTimer();
    var sessiondata =  this.userService.getDetailFromStorage();
    
    if(sessiondata.TOKEN){
      const cloned = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${sessiondata.TOKEN}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
