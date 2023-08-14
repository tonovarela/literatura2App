import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ConfeccionService } from '../../services/confeccion.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styles: [
    `.logo-sm{
      height:75% !important
    }
    .logo-lg{
      height:75% !important
    }
    .left-sidenav-menu li > a.active .menu-icon {
    color: #06ff8a;
    fill: rgba(23,97,253,0.12);
   }

   .bloqueado{
    margin-left: auto
   }
   .candado{
    font-size: 1.1em;    
    width: 15px;
    color: #f92250 !important;
   }
   .metismenu{
      font-size: 1.069em;    
   }
   .brand{
    height: 62px;
   }
   
    `
  ]
})
export class SidenavComponent {
  
  constructor(public configuracionService: ConfiguracionService,
               public usuarioService:UsuarioService) { }

  estaHabilitada(id_configuracion) {
    const c = this.configuracionService.configuraciones.filter(c => c["id_configuracion"] == id_configuracion);    
    if (c.length==0){
      return false;
    }

    return c == undefined ? false : c[0]["habilitada"] == "1";
  }

}
