
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
   }

   sendMessage(resp){
     this.getMessage.next(resp);
   }

}
