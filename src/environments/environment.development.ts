import { SocketIoConfig } from "ngx-socket-io";
const config: SocketIoConfig = { url: 'http://192.168.2.222:8085', options: {} };

export const environment = {
  production: false,
  sockectConfig: config,  
  URL: 'http://servicios.litoprocess.com/literatura7',    
  delayTimeAllowedInput: 200,
  puederPegarTexto: true,
  //URL_IMPRESIONES: "http://localhost:8050"  
 URL_IMPRESIONES: 'http://192.168.2.222/impresiones'
};