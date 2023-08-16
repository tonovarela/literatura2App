import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  pde: any = {};
  subscriptions: Subscription[] = [];
  formCaptura: FormGroup = this.fb.group({ entrada: '' });
  //revisiones: Revision[] = [];
  resumenKit: ResumenParte[] = [];
  //resumenAlternativo: any;
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
    const subs3 = this.webSocketService.listen('actualizarInfo').subscribe((payload: any) => {
      this.cargarRevisiones();
    });
    const subs4 = this.activatedRoute.params.subscribe((params: Params) => {
      this.id_pde = params['id_pde'];
      this.pdeService.obtener(this.id_pde).subscribe(response => {
        this.pde = response["pde"];
      });
      this.cargarRevisiones();
    });

    const subs5 = this.webSocketService.listen('reloadConfiguracion').subscribe(_ => {
      if (this.configuracionService.kitActivo.terminoRevision == false) {
        this.cargarRevisiones();
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
      return;
    }
    const { revisados, totalPorCaja, total, numpartprod } = revision;
    const _restantes = revisados % totalPorCaja;
    if (_restantes === 0 || revisados == total) {
      const totalKits = _restantes === 0 ? totalPorCaja : _restantes;
      this.uiService.mostrarToaster("Caja", "Imprimiendo caja", false, 500, "info");
      await this.imprimirPreEtiqueta(numpartprod, totalKits);
    }
    return Promise.resolve(true);
  }
  imprimirPreEtiqueta(numpartprod, totalKits) {
    let kit: KitDetalle = {};
    this.kitService.obtenerDetalle(numpartprod).pipe(
      switchMap(kitResponse => {
        kit = kitResponse.kit;
        return this.cajaService.obtenerPreEtiqueta(this.id_pde, numpartprod)
      })).subscribe((response) => {
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
          this.webSocketService.emitir("imprimirPreEtiqueta", caja);
          this.webSocketService.emitir("imprimirPreEtiqueta", caja);

          this.cargarRevisiones();
        }
        //console.log(caja);

      });


  }





  async cargarInfo(response, numparteprod: string, imprimirPreEtiqueta: boolean) {


    this.cargando = false;

    let _revisiones = [...response.resumenGeneral];
    const numpartActivo = this.kitActivo.numpartprod;
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
      setTimeout(() => this.animarContador(numparteprod), 1);
      if (imprimirPreEtiqueta) {
        await this.revisionPreEtiqueta(_revisiones.find(x => x.numpartprod == numpartActivo));
      }
    }
    this.resumenKit = _revisiones;


  }




  async cargarRevisiones(numparteprod = "", imprimirPreEtiqueta = true) {
    const materialActivo = this.configuracionService.kitActivo.numpartprod;
    this.cargando = true;

    const callBackCargaInfo = async (response) => {
      await this.cargarInfo(response, numparteprod, imprimirPreEtiqueta);

      if (document.getElementById("entrada") != null) {
        pasteNotAllowFunc("entrada");
        this.formCaptura.get("entrada").setValue("");
        document.getElementById("entrada").focus();
        const [k] = this.resumenKit
        if (k.armados >= 50 && numparteprod != "") {

          this.formCaptura.get("entrada").setValue(numparteprod);
          this.verificarKit();
        }

      }
    }

    if (numparteprod != "") {
      const [nK] = this.resumenKit;
      if (nK != null) {
        const nuevoResumenGeneral = [{ ...nK, porEmpacar: Number(nK.porEmpacar) + 1, armados: Number(nK.armados) - 1, revisados: nK.revisados + 1 }];
        const porcentajeAvance = Math.round((Number(nK.empacados) * 100) / Number(nK.total));
        if (porcentajeAvance <= 80) {
          const newResponse = { resumenGeneral: nuevoResumenGeneral };
          await callBackCargaInfo(newResponse);
          return;
        }
      }
    }
    this.confeccionService.revisionesKit(this.id_pde, materialActivo).subscribe(callBackCargaInfo);
  }


  verificarKit() {
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
    this.confeccionService.registrarRevisionKit(this.id_pde, kitVerificar, armados)
      .pipe(
        catchError(err => {
          this.uiService.mostrarToaster("Atencion!", err.error.mensaje, true, 400, "error");
          this.audios.error.play();
          return of({ ok: false })
        }),
      )
      .subscribe(response => {
        this.blockInput = false
        if (response["ok"] == false) {
          return;
        }

        this.webSocketService.emitir('actualizarInfo', { modulo: "revisionKits", numparteprod: kitVerificar });
        this.audios.ok.play();
        this.uiService.mostrarToaster("OK", response['result'], true, 400, "success");
        this.cargarRevisiones(kitVerificar);
        this.formCaptura.get("entrada").setValue("");
        document.getElementById("entrada").focus();
      })

  }

}
