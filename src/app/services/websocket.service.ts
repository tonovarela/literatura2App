import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;    
  constructor(private socket:Socket) {    
    //this.checkStatus();
  }

  checkStatus() {    
    this.socket.on('connect', () => {
      this.socketStatus = true;
      console.log("Conectado");
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
      console.log("Desconectado");
    });
  }


  emitir(evento, payload: any) {
    this.socket.emit(evento, payload);

  }

  listen(evento: string) {
  
    return this.socket.fromEvent(evento);

  }
}
