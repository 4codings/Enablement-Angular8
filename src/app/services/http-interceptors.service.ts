import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../core/user.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorsService implements HttpInterceptor {

  constructor(private userService:UserService) { }

  intercept(request, next){
    var sessiondata =  this.userService.getDetailFromStorage();

    if(sessiondata.TOKEN){
      console.log("sessiondata.TOKEN",sessiondata.TOKEN);
      const cloned = request.clone({
        headers: request.headers.set("authorization", `Bearer ${sessiondata.TOKEN}`)
      });
      return next.handle(cloned);
    } else {
      console.log("sessiondata.TOKEN",sessiondata.TOKEN);
      return next.handle(request);
    }
  }
}
