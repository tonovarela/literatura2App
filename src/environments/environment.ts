import { SocketIoConfig } from "ngx-socket-io";
const config: SocketIoConfig = { url: 'http://192.168.2.222:8085', options: {} };
export const environment = {
  production: true,
  sockectConfig:config,  
  delayTimeAllowedInput:200,  
  puederPegarTexto:false,  
  URL:'/literatura_nissan/',  
  URL_IMPRESIONES:"/impresiones"
};
