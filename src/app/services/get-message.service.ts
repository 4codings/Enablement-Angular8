
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Observable ,  Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetMessageService {

  getMessage: Subject<any>;
  constructor(private wsService: WebSocketService) {
    //10th April
    // this.getMessage= <Subject<any>>wsService
    // .connect().pipe(
    // map((response: any): any =>{
    //   return response;
    // }))
   }

   sendMessage(resp){
     this.getMessage.next(resp);
   }

}
