import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  public socket;
  constructor() { }
  public listenOn='message';
  public sendOnKey='message';

  reconnectSocket(){
    this.socket.on('disconnect',()=>{
      let inst=this;
      var timer=setInterval(function(){
        ("Attempting reconnection");
        if(inst.socket.connected==false){
          inst.socket.connect();
          inst.socket.removeAllListeners('disconnect');
          clearInterval(timer);
          ("Reconneced !");
        }
      },500);
    });
    this.socket.disconnect();
  }
}
