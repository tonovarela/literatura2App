import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { KitService } from '@services/kit.service';
import { WindowsService } from '@services/windows.service';
import { FilterSettingsModel, Grid, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfeccionService } from 'src/app/services/confeccion.service';
import { LoteService } from 'src/app/services/lote.service';
import { PdeService } from 'src/app/services/pde.service';
import { UiService } from 'src/app/services/ui.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { generarLote, NewID } from 'src/app/utils/utils';
import { CajaEmpaque, Residuo } from '../interface/interfaces';
import { ConfeccionKitsGeneral } from 'src/app/interfaces/shared/confeccion.interface';




@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

export class ResumenComponent implements OnInit {
  @ViewChild("btnEnLote") btnEnLote: ElementRef;
  @ViewChild("grid") grid: Grid;
  
  selectedIndex = 1;
  cajasEmpaque: CajaEmpaque[] = [];
  resumenConfeccion: ConfeccionKitsGeneral = { resumen: [], resumenGeneral: [] };
  residuosKitsPorEmpacar: Residuo[] = [];
  pde: any = {};
  mostrarBack: boolean = true;
  lotes: any = [];
  lotesDetalle: any = [];
  cargando: boolean = false;
  height: number = 0;
  pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  resizeSubscription$: Subscription;  
  subscriptions: Subscription[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,
    private pdeService: PdeService,
    private loteService: LoteService,
    private wService: WindowsService,
    private webSocketService: WebsocketService,
    private kitService: KitService,
    private confeccionService: ConfeccionService,
    private uiService: UiService) { }


  cargarData() {
    this.cargando = true;
    const { id_pde } = this.pde;
    this.kitService.obtenerResiduos(id_pde).subscribe(({residuos}) => {      
      this.residuosKitsPorEmpacar= residuos.map(x=>{x.seleccionado=false; return x});            
    });
    this.confeccionService.resumenKitsRevisados(id_pde)
      .pipe(
        catchError((e) => {
          this.router.navigate(['/pages/confeccion/kits/pde']);
          return of({} as ConfeccionKitsGeneral);
        }),
      )
      .subscribe((response: ConfeccionKitsGeneral) => {        
        //this.cargando = false;
        this.pde = response.pde;
        const { id_estado } = this.pde;
        if (id_estado == "1") {
          this.mostrarBack = false;
        }
        this.resumenConfeccion = response;
        this.resumenConfeccion.resumenGeneral = this.resumenConfeccion.resumenGeneral
          .filter(x => x.porEmpacar > 0);
        const a = this.obtenerCajas(this.resumenConfeccion.resumenGeneral);
        const b = this.obtenerCajas(this.residuosKitsPorEmpacar);        
        this.cajasEmpaque = [...a, ...b]
        this.actualizarLotes();
      });
  }
  obtenerCajas(resumenGeneral: any): CajaEmpaque[] {
    let resultCajaEmpaque: CajaEmpaque[] = [];
    resumenGeneral.forEach(x => {
      let max = Math.trunc(x.porEmpacar / x.totalPorCaja);
      const { descripcionPDE, id_pde, numpartprod, totalPorCaja, descripcion } = x;
      for (let index = 0; index < max; index++) {
        resultCajaEmpaque.push({ numpartprod, totalPorCaja: Number(totalPorCaja), id: NewID(), nombrePDE: descripcionPDE, id_pde, descripcion, seleccionado: false });
      }
      if (x.porEmpacar % x.totalPorCaja > 0) {
        resultCajaEmpaque.push({ numpartprod, totalPorCaja: (x.porEmpacar % x.totalPorCaja), id: NewID(), nombrePDE: descripcionPDE, id_pde, descripcion, seleccionado: false });
      }
    })
    return resultCajaEmpaque;
  }
  ngOnInit(): void {    
    this.height = window.innerHeight - 350;
    this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
      this.height = window.innerHeight - 350;
    });
    // this.subscriptions.push(this.webSocketService.listen('actualizarInfo').subscribe(_ => {
    //   this.cargarData();
    // }));
    this.subscriptions.push(this.webSocketService.listen("cambioPDEActivo").subscribe(_ => {
      this.irListado();
    }));
    
    

    this.activatedRoute.params.subscribe(({ id_pde }) => {
      this.pde.id_pde = id_pde;
      this.cargarData();
    });
  }

  load(){    
    (this.grid.localeObj as any).localeStrings.EmptyRecord = "No hay cajas "

  }
  // cambiaCheck(kit) {
  //    const r = this.residuosKitsPorEmpacar
  //      .find(x => x.id_pde == kit.id_pde && x.numpartprod == kit.numpartprod);  
  //   r.seleccionado = !r.seleccionado;

  // }

  ImpresionCaja(caja){    
    this.kitService.obtenerDetalle(caja.numpartprod).subscribe(response=>{            
      const {kit}= response;
      const _caja = {
      cont1: kit.cont1,
      cont2: kit.cont2,
      contenido: `${kit.cont1} ${kit.cont2}`,
      etiqueta: "Pre-etiqueta",
      fechaImpresion: "",
      id: "#################",
      idioma: kit.idioma,
      idLabel: "#############",
      idTarima: "############",
      importado: kit.edicion.toUpperCase() == "IMPORTADOS",
      indice: kit.indice ,
      nombre: caja.numpartprod  ,
      numpartprod: caja.numpartprod ,
      pr: kit.pr,
      sku: kit.clavekit,
      sku2: null,
      totalKits: caja.totalPorCaja,
      vehiculo: kit.vehiculo || "-------------"
    };
    this.webSocketService.emitir("imprimirPreEtiqueta",_caja);    
    this.uiService.mostrarToaster("PRE-Etiqueta 👍",`Imprimiendo ${_caja.numpartprod} de  ${_caja.totalKits} kits`,true,1000,"info");
    console.log("Imprimiendo preEtiqueta ")
    });
    


   

  }
  setSelected(id: number) {
    this.selectedIndex = id;
  }
  actualizarLotes() {
    this.pdeService.obtenerLotes(this.pde.id_pde).subscribe(x => {      
      this.lotes = x["lotes"];      
      this.lotesDetalle = x["detalle"];
      this.cargando=false;
    });
  }
  irListado() {
    this.router.navigate(["../../pde"], { relativeTo: this.activatedRoute })
  }
  generarLot = async () => {
    const seguro = await this.uiService.mostrarAlertaConfirmacion("PDE", "Confirmar generar la distribución de empaque de los kits seleccionados?", "Si, registrar entrega", "No");
    if (!seguro.isConfirmed) {
      return;
    }
    const kitOtrosPDE = this.residuosKitsPorEmpacar.filter(x => x.seleccionado)
    const { id_pde } = this.pde;
    let id_lote = "";
    const cajas = this.cajasEmpaque.filter(c => c.seleccionado);        
    this.loteService.registrar(id_pde, cajas, kitOtrosPDE)
      .subscribe(response => {      
        id_lote = response["id_lote"];
        let cuadernos = response["cuadernos"];
        const contadorTarima = Number(response["contadorTarima"]);        
        let distribucion = generarLote(cuadernos,
          this.pde.max_cajas,
          contadorTarima,
          true);        
        this.loteService.registrarDistribucion(id_lote, JSON.stringify(distribucion)).subscribe(x => {
          this.uiService.mostrarAlertaSuccess("PDE", "Entrega registrada");
          this.irEntrega(id_lote);
        });
      });
  }
  irEntrega(id_lote) {
    this.router.navigate(["../../entrega", this.pde.id_pde, id_lote], { relativeTo: this.activatedRoute })
  }


  get puedeGenerarTarima() {
    const tamanio = this.cajasEmpaque.filter(x => x.seleccionado).length;
    return tamanio <= 12 && tamanio > 0;
  }

  get CajasSeleccionadas() {
    return this.cajasEmpaque.filter(x => x.seleccionado).length
  }



  cambiarCheck(caja: CajaEmpaque) {  
    this.grid.getCurrentViewRecords().forEach((c: any) => {
      if (c.id == caja.id)
        c.seleccionado = !c.seleccionado;
    });
  }

  get seleccionados() {
    return this.cajasEmpaque.filter(x => x.seleccionado);
  }





}
