import { Component } from '@angular/core';
import { ConfiguracionService } from '@services/configuracion.service';
import { WebsocketService } from '@services/websocket.service';
import { io } from 'socket.io-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(
    private configuracionService: ConfiguracionService,
    private webSocketService: WebsocketService
    ) {
    this.configuracionService.cargarConfiguraciones();        
  }
  
}
