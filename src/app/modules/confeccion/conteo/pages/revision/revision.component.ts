import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { firstValueFrom, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { toast } from 'wc-toast'
import { AudioRevision } from '../../../kits/interfaces/kit.interfaces';
import { pasteNotAllowFunc } from 'src/app/utils/utils';
import { ResumenParte } from 'src/app/interfaces/shared/confeccion.interface';
import { KitDetalle } from 'src/app/interfaces/shared/kit.interfaces';
import { CajaService, ConfeccionService, ConfiguracionService, KitService, PdeService, UiService, WebsocketService } from '@services/index';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css'],

})
export class RevisionComponent implements OnInit, OnDestroy {
  id_pde: string = "";
  cargando: boolean = false;
  estaRegistrandoCaja: boolean = false;
  pde: any = {};
  subscriptions: Subscription[] = [];
  formCaptura: FormGroup = this.fb.group({ entrada: '' });
  resumenKit: ResumenParte[] = [];  
  DELAYMAX: number = environment.delayTimeAllowedInput;
  blockInput: boolean = false;
  esFireFox: boolean = false;
  audios: AudioRevision = {
    scan: new Audio(`assets/audio/scan.mp3`),
    error: new Audio(`assets/audio/error.mp3`),
    ok: new Audio(`assets/audio/ok.mp3`)
  };

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private kitService: KitService,
    public configuracionService: ConfiguracionService,
    private confeccionService: ConfeccionService,
    private pdeService: PdeService,
    private cajaService: CajaService,
    private webSocketService: WebsocketService,
    private uiService: UiService) {
    const agent = window.navigator.userAgent.toLowerCase()
    this.esFireFox = agent.indexOf('firefox') > -1;
  }
  regresar() {
    this.router.navigate(['../../pde'], { relativeTo: this.activatedRoute })
  }
  ngOnInit(): void {

    const subs1 = this.formCaptura.valueChanges.pipe(
      debounceTime(this.DELAYMAX),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val.entrada.length < 6) {
        this.formCaptura.get('entrada').setValue("");
        return;
      }
    });
    const subs2 = this.webSocketService.listen("cambioPDEActivo").subscribe(_ => this.regresar());
    const subs3 = this.webSocketService.listen('actualizarInfo').subscribe(async (payload: any) => {
      const { modulo, numpartprod, resumen } = payload;
      //console.log(payload);
      if (modulo == "revisionCuadernos") {
        const { restantes: pendientes } = resumen;
        console.log(resumen);
        const r = this.resumenKit.find(r => r.numpartprod == numpartprod);
        if (r != undefined) {          
          r.pendientes = Number(pendientes);
          r.armados= r.armados +1;
          
        } else {
          if (!this.estaRegistrandoCaja){
            await this.cargarRevisiones();
          }          
          
        }
      }

    });
    const subs4 = this.activatedRoute.params.subscribe(async (params: Params) => {
      this.id_pde = params['id_pde'];
      this.pdeService.obtener(this.id_pde).subscribe((response) => {
        this.pde = response["pde"];
      });
      await this.cargarRevisiones();
    });
    const subs5 = this.webSocketService.listen('reloadConfiguracion').subscribe(async (_) => {
      if (this.configuracionService.kitActivo.terminoRevision == false) {
        await this.cargarRevisiones();
      }

    });
    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);
    this.subscriptions.push(subs3);
    this.subscriptions.push(subs4);
    this.subscriptions.push(subs5);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  get kitActivo() {
    return this.configuracionService.kitActivo;
  }

  animarContador(numparteprod) {
    const element = document.getElementById(numparteprod);
    if (element == null) {
      return;
    }
    element.classList.add("flipInY", "animated", "contadorActivo");
    setTimeout(() => {
      element.classList.remove("flipInY", "animated", "contadorActivo");
    }, 1);
  }

  private async revisionPreEtiqueta(revision) {

    if (revision == null) {
      return Promise.resolve(false);
    }   
    const { revisados, totalPorCaja, total, numpartprod,porEmpacar } = revision;
    const _restantes = Number(porEmpacar) % Number(totalPorCaja);
      //console.log({revisados,total})
    // console.log(_restantes);
    // console.log(porEmpacar);
    //console.log({revisados,total});
    
    if (_restantes === 0 || Number(revisados) == Number(total)) {
      console.log("imprimiendo Caja");
      const totalKits = _restantes === 0 ? totalPorCaja : _restantes;
      //toast('Imprimiendo caja', { icon: { type:'success' }, theme: { type: 'light' }, duration: 500 });      
      const [k] = this.resumenKit;
      this.resumenKit = [{ ...k, porEmpacar: Number(k.porEmpacar + 1) }];
      await this.imprimirPreEtiqueta(numpartprod, totalKits);      
      this.uiService.mostrarToaster("Caja", "Imprimiendo caja", false, 500, "info");      
      return Promise.resolve(true)
    }
    if (revisados > totalPorCaja) {
      this.webSocketService.emitir('actualizarInfo', { modulo: "revisionKits", numparteprod: numpartprod });
    }
    return Promise.resolve(false);
  }


  async imprimirPreEtiqueta(numpartprod, totalKits) {
    let kit: KitDetalle = {};

    const response = await firstValueFrom(this.kitService.obtenerDetalle(numpartprod).pipe(
      switchMap(kitResponse => {
        kit = kitResponse.kit;
        return this.cajaService.obtenerPreEtiqueta(this.id_pde, numpartprod)
      })));

    let caja = {};
    if (!response.ok) {
      caja = {
        cont1: kit.cont1,
        cont2: kit.cont2,
        contenido: `${kit.cont1} ${kit.cont2 || ""}`,
        etiqueta: "Pre-etiqueta",
        fechaImpresion: "",
        id: "#################",
        idioma: kit.idioma,
        idLabel: "#############",
        idTarima: "############",
        importado: kit.edicion.toUpperCase() == "IMPORTADOS",
        indice: kit.indice,
        nombre: numpartprod,
        numpartprod: numpartprod,
        pr: kit.pr,
        sku: kit.clavekit,
        sku2: kit.clavekit2,
        totalKits: totalKits,
        vehiculo: kit.vehiculo || kit.identifica
      };

      this.webSocketService.emitir("imprimirPreEtiqueta", caja);

    } else {
      const { id_caja, id_tarima, numeroTarima, numeroCaja } = response.caja;
      const resumenTotal = response.resumenTotal;
      const { totalCajas } = resumenTotal.find(x => x.id_tarima == id_tarima)
      caja = {
        cont1: kit.cont1,
        cont2: kit.cont2,
        contenido: `${kit.cont1} ${kit.cont2 || ""}`,
        etiqueta: `Caja [${numeroCaja} de ${totalCajas} ] Tarima [${numeroTarima}}]`,
        fechaImpresion: "",
        id: id_caja,
        idioma: kit.idioma,
        idLabel: id_caja,
        idTarima: id_tarima,
        importado: kit.edicion.toUpperCase() == "IMPORTADOS",
        indice: kit.indice,
        nombre: numpartprod,
        numpartprod: numpartprod,
        pr: kit.pr,
        sku: kit.clavekit,
        sku2: kit.clavekit2,
        totalKits: totalKits,
        vehiculo: kit.vehiculo || kit.identifica
      };
      this.webSocketService.emitir('actualizarInfo', { modulo: "revisionKits", numparteprod: numpartprod });
      this.webSocketService.emitir("imprimirPreEtiqueta", caja);
      this.webSocketService.emitir("imprimirPreEtiqueta", caja);
      await this.cargarRevisiones();
      return Promise.resolve(true);
    }
    return Promise.resolve(false)
  }
  async cargarInfo(response, numparteprod: string) {
    this.cargando = false;
    let _revisiones = [...response.resumenGeneral];
    const numpartActivo = this.configuracionService.kitActivo.numpartprod;
    if (numpartActivo.length > 0) {
      _revisiones = _revisiones.filter(x => x.numpartprod == numpartActivo);
      const [revision] = _revisiones;
      if (Number(revision.porEmpacar) > 0 && Number(revision.armados) == 0) {
        _revisiones = [...response.resumenGeneral];
        this.configuracionService.terminoRevision().subscribe(_ => {
          this.webSocketService.emitir("reloadConfiguracion", {});
          if (numparteprod != "") {
            this.regresar();
          }
        })
      }
    }
    if (numparteprod.length > 0) {
      this.estaRegistrandoCaja = true;
      const etiqueta = await this.revisionPreEtiqueta(_revisiones.find(x => x.numpartprod == numparteprod));
      this.estaRegistrandoCaja = false;
      setTimeout(() => this.animarContador(numparteprod), 1);
      if (etiqueta) {
        return Promise.resolve(true);
      }
    }
    this.resumenKit = [..._revisiones];
    return await Promise.resolve(true);
  }


  private async ckCargarInfo(response, numparteprod) {
    await this.cargarInfo(response, numparteprod);
    if (document.getElementById("entrada") != null) {
      pasteNotAllowFunc("entrada");
      this.formCaptura.get("entrada").setValue("");
      document.getElementById("entrada")?.focus();

      return Promise.resolve(true);
    }
  }

  private async registroAutomatico(numparteprod: string) {
    const [k] = this.resumenKit
    if (k.armados >= 3 && numparteprod != "") {
      this.formCaptura.get("entrada").setValue(numparteprod);
      this.verificarKit();
    }
  }

  async cargarRevisiones(numparteprod = "") {
    // if (this.estaRegistrandoCaja) {
    //   return Promise.resolve(true);
    // }
    const materialActivo = this.configuracionService.kitActivo.numpartprod;
    this.cargando = true;
    if (numparteprod != "") {
      const [nK] = this.resumenKit;
      if (nK != null) {
        const nuevoResumenGeneral = [{ ...nK, porEmpacar: Number(nK.porEmpacar) + 1, armados: Number(nK.armados) - 1, revisados: nK.revisados + 1 }];        
        const armados = nuevoResumenGeneral[0].armados;
        if (armados >= 10) {
          const newResponse = { resumenGeneral: nuevoResumenGeneral };
          await this.ckCargarInfo(newResponse, numparteprod);
          return Promise.resolve(true);
        }
      }

    }
    const response = await firstValueFrom(this.confeccionService.revisionesKit(this.id_pde, materialActivo));
    await this.ckCargarInfo(response, numparteprod);
    return Promise.resolve(true);
  }





  async verificarKit() {
    const kitVerificar = this.formCaptura.get('entrada').value;
    if (this.blockInput) {
      return;
    }
    if (kitVerificar.length == 0) {
      return;
    }
    if (kitVerificar.toUpperCase().trim() != this.kitActivo.numpartprod.toUpperCase().trim()) {
      //this.uiService.mostrarToaster("Atención", "Este kit es erroneo o  no es el activo", true, 400, "error");
      //this.audios.error.play();
      this.formCaptura.get("entrada").setValue("");
      document.getElementById("entrada").focus();
      return;
    }
    this.blockInput = true;
    const [kit] = this.resumenKit;
    let armados = 0;
    if (kit != null) {
      armados = Number(kit.armados);
    }
    const response=await firstValueFrom(this.confeccionService.registrarRevisionKit(this.id_pde, kitVerificar, armados)
      .pipe(
        catchError(err => {
          this.uiService.mostrarToaster("Atencion!", err.error.mensaje, true, 400, "error");
          this.audios.error.play();
          return of({ ok: false })
        }),
      )
      );
      if (response["ok"] == false) {
        return;
      }
      this.audios.ok.play();
      toast(response['result'], { icon: { type: 'success' }, theme: { type: 'light' }, duration: 400 });
      await this.cargarRevisiones(kitVerificar);
      this.blockInput = false
     //await this.registroAutomatico(kitVerificar);
      this.formCaptura.get("entrada").setValue("");
      document.getElementById("entrada").focus();
      
      

  }



}
