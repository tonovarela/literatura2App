
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styles: [
    `
    .kitActivo{
      padding: 5px 10px;
      font-size:13px!important
    }
  `
  ]
})
export class TopbarComponent implements OnInit, OnDestroy {



  validRoutesToStopConfeccion: string[] = ["pages/confeccion/cuadernos", "pages/confeccion/conteo", "pages/confeccion/kits"];
  activeRoutePath: string;
  subscriptions: Subscription[] = [];
  id_configuracion: Number = 0;


  constructor(private router: Router,
    public usuarioService: UsuarioService,
    public configuracionService: ConfiguracionService,
    private webSocketService: WebsocketService

  ) {
    const subs = this.router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd || (event instanceof ActivationEnd && event.snapshot.data["id_configuracion"])))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.activeRoutePath = event['url']
        }
        if (event instanceof ActivationEnd) {
          this.configuracionService.pausarSeleccion.id_configuracion = event.snapshot.data["id_configuracion"];
          this.id_configuracion = event.snapshot.data["id_configuracion"];
          this.configuracionService.cargarConfiguraciones();
        }
      });
    this.subscriptions.push(subs);

  }

  ngOnDestroy() {
    this.id_configuracion = 0;
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  get kitActivo() {
    return this.configuracionService.kitActivo;
  }

  get esArmado() {
    return this.activeRoutePath.includes("pages/confeccion/cuadernos/revision");
  }

  get esRevisionKit() {
    return this.activeRoutePath.includes("pages/confeccion/conteo");
  }

  get CanStopConfeccion() {
    return this.validRoutesToStopConfeccion.some(e => this.activeRoutePath.includes(e));
  }
  ngOnInit(): void {
    const subs = this.webSocketService.listen("reloadConfiguracion").subscribe(_ => {
      this.configuracionService.cargarConfiguraciones();
    });
    this.subscriptions.push(subs);

  }
  actualizarConfiguracion() {
    this.configuracionService.actualizar().subscribe(response => {
      this.webSocketService.emitir('reloadConfiguracion', "Actualizar desde el cliente");
      this.configuracionService.cargarConfiguraciones();
    });

  }

  logout() {
    this.usuarioService.logout();
    this.router.navigate(["/auth/login"]);
  }



  iniciarArmado() {
    const elementos = this.activeRoutePath.split("/");
    const numpartprod = elementos[elementos.length - 1];
    this.configuracionService.iniciarArmado(numpartprod).subscribe(this.callbackCargarConfiguracion);
  }

  terminarArmado() {
    //this.configuracionService.terminarArmado().subscribe(this.callbackCargarConfiguracion);
  }

  terminoRevision() {
    console.log("termino");
    this.configuracionService.terminoRevision().subscribe(this.callbackCargarConfiguracion);
  }


  callbackCargarConfiguracion = (_) => {
    this.webSocketService.emitir('reloadConfiguracion', "Actualizar desde el cliente");
    this.configuracionService.cargarConfiguraciones();
  }





}
