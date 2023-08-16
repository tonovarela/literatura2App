import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//import * as moment from 'moment';
import { DateTime } from 'luxon';

import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { mdColors } from 'src/app/interfaces/shared/colors';
import { LoteService } from 'src/app/services/lote.service';
import { PdeService } from 'src/app/services/pde.service';
import { UiService } from 'src/app/services/ui.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { WebsocketService } from 'src/app/services/websocket.service';

import { ImpresionService } from '../../../../../services/impresion.service';
import { KitDetalle } from 'src/app/interfaces/shared/kit.interfaces';

//declare function  alasql() :any;


@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css'],
})
export class EntregaComponent implements OnInit, OnDestroy {
  data: any = [];
  distribucion: any = null;
  kits: KitDetalle[] = [];
  id_pde: string = '';
  id_lote: string = '';
  actualizo: boolean = false;
  cargando: boolean = false;
  pde: any = {};

  pdesAsociados: any[] = [];

  subscriptions: Subscription[] = [];

  modelImpresion = { cajas: [], tarimas: [] };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private webSocketService: WebsocketService,
    private usuarioService: UsuarioService,
    private pdeService: PdeService,
    private uiService: UiService,
    private loteService: LoteService,
    private impresionService: ImpresionService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    
    this.subscriptions.push(this.webSocketService.listen('cambioPDEActivo').subscribe(_ => {
      this.router.navigate(['../../../pde'], { relativeTo: this.activatedRoute })
    }));

    const obs$ = this.activatedRoute.params.pipe(
      switchMap(({ id_lote, id_pde }) => {
        this.id_pde = id_pde;
        this.id_lote = id_lote;
        return this.pdeService.obtener(id_pde).pipe(
          tap((response: any) => {
            this.pde = response['pde'];
          }),
          switchMap((_) => this.loteService.obtenerDistribucion(id_lote))
        );
      })
    );
    this.subscriptions.push(obs$.subscribe((response) => {
      this.data = response['distribucion'];
      this.kits = response['kits'];            
      this.cargando = false;
      this.loteService.obtenerPDES(this.id_lote).subscribe(x => {
        this.pdesAsociados = x["pdes"];
        this.pdesAsociados.forEach((pde, i) => {
          pde.color = mdColors[i];
        });
        this.distribucion = JSON.parse(this.data.distribucion);
        this.construirModelImpresion();
      });

    }));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private obtenerDetalleKit(numpartprod, totalKits, id_caja, id_tarima, etiqueta,id_pde) {    
    const kits = this.kits.filter(k => k.numparteprod.toUpperCase() == numpartprod.toUpperCase()  && k.id_pde==id_pde);    
    
    const kit = kits[0];    
    return {
      id: id_caja,
      idLabel: id_caja,
      orden_compra: kit.orden_compra,
      indice: kit.indice,
      idioma: kit.idioma || '',
      contenido: `${kit.cont1} ${kit.cont2}`,
      cont1: kit.cont1,
      cont2: kit.cont2,
      numpartprod: numpartprod,
      pr: kit.pr,
      vehiculo: kit.identifica,
      sku: kit.clavekit,
      sku2: kit.clavekit2,
      fechaImpresion: DateTime.now().toFormat('dd-MM-yyy'),      
      nombre: numpartprod,
      totalKits,
      etiqueta: etiqueta,
      idTarima: id_tarima,
      id_pde:"",
      pdeDescripcion:"",
      importado: kit.edicion.toUpperCase() == "IMPORTADOS",
    };
  }


  construirModelImpresion() {    
    let _cajas=[];
    this.distribucion.completas.forEach(tarima => {
      _cajas=[..._cajas,...tarima.cajas];
    });    
    this.distribucion.mezcladas.forEach(tarima => {
      _cajas=[..._cajas,...tarima.cajas];
    });    


    this.pdeService.obtenerTarimas(this.id_pde).subscribe(response => {      
      const _tarimasResponse: any[] = response["tarimas"];
      
      
      const cajas = [];
      const tarimas = [];
      let i = 0,
        j = 0;
      this.distribucion.completas.forEach((t) => {
        i = 0;
        ++j;
        //------------Para determinar el orden de compra-----------------------------
        const [caja] = t.cajas;        
        const kit = this.kits.find(k => k.numparteprod == caja.nombre);
        //---------------------------------------------------------------
        const {nombreTarima,nombrePallet}= this.obtenerTarima(_tarimasResponse,t.id);
        tarimas.push({ id: t.id, tipo: 'Completa', nombre: `${nombreTarima}`, orden_compra: kit.orden_compra ,label:`${nombreTarima} `,nombrePallet});
        t.cajas.forEach((c) => {
          const { nombre, totalKits, id } = c;
          const {numeroTarima} = this.obtenerTarima(_tarimasResponse,t.id);          
          const etiqueta = `Caja [${++i} de ${t.cajas.length}]   [${numeroTarima} ]`;          
          const kit = this.obtenerDetalleKit(nombre, totalKits, id, t.id, etiqueta,c.id_pde);
          const {id_pde} =_cajas.find(_c=>_c.id==id);
          const pdeAsociado =this.pdesAsociados.find(_p=>_p.id_pde==id_pde);          
          kit.id_pde= id_pde;           
          kit.pdeDescripcion=pdeAsociado.nombre;
          cajas.push(kit);
        });

        
      });

      //console.log(t.cajas);
      this.distribucion.mezcladas.forEach((t) => {
        i = 0;
        ++j;
        const {nombreTarima,nombrePallet}= this.obtenerTarima(_tarimasResponse,t.id);                
        tarimas.push({ id: t.id, tipo: 'Mezclada', nombre: `${nombreTarima}`, orden_compra: "", label:`${nombreTarima} `,nombrePallet });
        t.cajas.forEach((c) => {
          const { nombre, totalKits, id } = c;
          const {numeroTarima} = this.obtenerTarima(_tarimasResponse,t.id);
          const etiqueta = `Caja [${++i} de ${t.cajas.length}]   [${numeroTarima}]`;
          let kit = this.obtenerDetalleKit(nombre, totalKits, id, t.id, etiqueta,c.id_pde);                    
          const {id_pde} =_cajas.find(_c=>_c.id==id);
          const pdeAsociado =this.pdesAsociados.find(_p=>_p.id_pde==id_pde);          
          kit.id_pde= id_pde;           
          kit.pdeDescripcion=pdeAsociado.nombre;           
          cajas.push(kit);
        });
      });                  
      this.modelImpresion.cajas = cajas;
      this.modelImpresion.tarimas = tarimas;      
      this.impresionService.pde = this.pde;
      this.impresionService.modelImpresion = this.modelImpresion;      
    });

  }

  private obtenerTarima(_tarimasResponse, id) {
    const _t = _tarimasResponse.find(_tarima => _tarima.id_tarima == id);
    
    
    return {numeroTarima:_t.nombre,      
            nombreTarima:_t.nombre,
            nombrePallet:_t.nombrePallet
          }
    //return numero?_t.nombre.slice(_t.nombre.length - 1):_t.nombre;
    
    
  }

  regresar() {
    this.router.navigate(['../../../resumen', this.id_pde], {
      relativeTo: this.activatedRoute,
    });
  }
  movioItem(event) {
    this.actualizo = true;
  }

  get tieneTarimasMezcladasSinCajas() {
    const tarimasMezcladas = this.distribucion.mezcladas.filter(
      (t) => t.cajas.length == 0
    );
    return tarimasMezcladas.length > 0;
  }

  get tieneTarimasCompletasSinCajas() {
    const tarimasCompletas = this.distribucion.completas.filter(
      (t) => t.cajas.length == 0
    );
    return tarimasCompletas.length > 0;
  }


  async eliminarCaja({ id, nombre, totalKits }) {
    const confirmacion = await this.uiService.mostrarAlertaConfirmacion("Literatura",
      "Esta acción quitara este caja de las entregas, esta seguro",
      "Si, la quiero quitar",
      "No");
    if (confirmacion.dismiss) {
      return;
    }
    this.distribucion.mezcladas.forEach(tarima =>
      tarima.cajas = tarima.cajas.filter(caja => caja.id !== id)
    );
    this.distribucion.mezcladasBKP = this.distribucion.mezcladas;
    const { login } = this.usuarioService.Usuario;
    const { id_pde } = this.pde;
    const cancelacionCaja = { numpartprod: nombre, totalKits, id_pde, usuario: login };
    this.cargando = true;
    this.loteService.eliminarCaja(cancelacionCaja).subscribe(response => {
      this.cargando = false;
      if (this.tieneTarimasMezcladasSinCajas) {
        this.actualizar(false);
      } else {
        this.actualizar();
      }
    });

  }

  reEtiquetarTarimas(contadorInicial = 1) {
    this.distribucion.completas.forEach(tarima => tarima.nombre = `Tarima ${contadorInicial++}`);
    this.distribucion.mezcladas.forEach(tarima => tarima.nombre = `Tarima ${contadorInicial++}`);
  }

  eliminarTarima(tarima) {
    const nombresTarima = this.distribucion.mezcladas.map(e => Number(e.nombre.slice(e.nombre.length - 1)));
    const min = Math.min(...nombresTarima);
    this.distribucion.mezcladas = this.distribucion.mezcladas.filter(t => t.id != tarima.id);
    this.reEtiquetarTarimas(min);
  }



  async eliminarTarimaDistribucion(tarimaDistribucion) {
    const confirmacion = await this.uiService.mostrarAlertaConfirmacion("Literatura",
      "Esta acción quitara esta tarima de las entregas, esta seguro",
      "Si, la quiero quitar",
      "No");
    if (confirmacion.dismiss) {
      return;
    }
    const cancelacionTarima = { id_pde: this.id_pde, ...tarimaDistribucion }
    this.distribucion.completas = this.distribucion.completas.filter(t => t.id != tarimaDistribucion.id_tarima);
    this.reEtiquetarTarimas();
    this.cargando = true;

    this.loteService.eliminarTarimaDistribucion(cancelacionTarima).subscribe(response => {
      if (this.tieneTarimasCompletasSinCajas) {
        this.actualizar(false);
      } else {
        this.actualizar();
      }
      this.cargando = false;
    }

    );
  }
  actualizar(aviso = true) {
    if (this.tieneTarimasMezcladasSinCajas && aviso) {
      this.uiService.mostrarAlertaError('Entarimado', 'No se puede guardar una distribución con tarimas con 0 cajas');
      return;
    }

    this.cargando = true;
    this.loteService
      .actualizarDistribucion(this.id_lote, JSON.stringify(this.distribucion))
      .subscribe((x) => {
        this.cargando = false;
        this.uiService.mostrarAlertaSuccess(
          'Entarimado',
          'Se ha actualizado la formación de tarimas',
          1000
        );
        this.actualizo = false;
        this.construirModelImpresion();
      });
  }
}
