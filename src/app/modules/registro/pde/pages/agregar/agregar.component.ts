import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { Subscription } from 'rxjs';

import { DateTime } from 'luxon';

import { PdeService } from 'src/app/services/pde.service';
import { generarLote } from 'src/app/utils/utils';
import { MaxUsedRange, instanceOfModeError, mostrarMensaje, obtenerSolicitudKit } from 'src/app/utils/spreadsheet-helper';
import { SolicitudCuaderno } from 'src/app/interfaces/shared/solicitudCuaderno';
import { KitService, UiService, WindowsService } from '@services/index';

declare function iniciarlizarDatePicker(): any;

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `    
    label{
     font-size:11px
    }
    .parsley-error::placeholder { 
                color: red;
                opacity: 1; 
              }
    `
  ]
})
export class AgregarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("text") textoFecha!: ElementRef;
  @ViewChild('spreadsheet') spreadsheetObj!: SpreadsheetComponent;

  cargando: boolean = false;
  cargado: boolean = false;
  tarimas: any = { completas: [], mezcladas: [] };
  registroForm!: FormGroup
  cuadernosRegistro = [];
  kitRegistro: any[];
  porProcesar: any[] = [];
  conError: any[] = [];
  posicionCell: number = 1;
  spreadheight: number = 0;

  resizeSubscription$: Subscription
  public resumenConfeccion: any[] = [];
  maximoCajasPorTarima: number = 0;


  constructor(private fb: FormBuilder,
    private wService: WindowsService,
    private kitService: KitService,
    private uiService: UiService,
    private pdeService: PdeService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
    this.textoFecha.nativeElement.value = DateTime.now().toFormat('yyyy-MM-dd')
  }

  ngOnInit(): void {

    this.cargado = false;
    iniciarlizarDatePicker();
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha_entrega: [''],
      max_cajas: ['9'],
      serial: [""],
      //orden_compra: [""],
      lote: ["", Validators.required],
      numero_proveedor: ["1", Validators.required]
    });
    this.spreadheight = window.innerHeight - 300;
    this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
      this.spreadheight = window.innerHeight - 300;
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe()
  }

  // get MaxUsedRange() {
  //   const { rowIndex } = this.spreadsheetObj.sheets[0].usedRange;
  //   return rowIndex;
  // }


  limpiar() {
    this.registroForm.reset();
    this.textoFecha.nativeElement.value = DateTime.now().toFormat('yyyy-MM-dd');
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `A2:D${MaxUsedRange(this.spreadsheetObj, 0) + 100}` });
    this.spreadsheetObj.endEdit();
  }

  tieneError(campo: string): boolean {
    const field = this.registroForm.get(campo)!;
    return field.invalid;
  }

  inicializar() {
    this.porProcesar = [];
    this.cargando = true;
    this.cuadernosRegistro = [];
    this.kitRegistro = [];
    this.conError = [];
  }


  generarDistribucion() {
    let _conError = false;
    this.registroForm.get("fecha_entrega").setValue(this.textoFecha.nativeElement.value);
    this.maximoCajasPorTarima = this.registroForm.get("max_cajas").value;
    const rowIndex = MaxUsedRange(this.spreadsheetObj, 0);
    this.spreadsheetObj.endEdit();
    this.spreadsheetObj.updateCell({ value: "Respuesta" }, "D1");
    this.spreadsheetObj.clear({ type: "Clear Contents", range: 'D2:Z' + rowIndex + 10 });
    this.inicializar();
    this.posicionCell = 1;
    for (let i = this.posicionCell; i <= rowIndex + 10; i++) {
      const kit = obtenerSolicitudKit(this.spreadsheetObj, i);
      if (instanceOfModeError(kit)) {
        if (kit.mensaje.length > 0) {
          _conError = true;
          mostrarMensaje(this.spreadsheetObj, kit.mensaje, `D${i + 1}`, "red");
        }
        continue;
      }
      if (kit.clave.length > 0 && kit.cantidad > 0) {
        //Acumular los numeros de parte si es que lo repiten en el layout
        const [g] = this.porProcesar.filter(x => x.kit.clave == kit.clave)
        g ? g.kit.cantidad += kit.cantidad : this.porProcesar.push({ id: i, kit });
      }
    }

    if (_conError) {
      this.cargando = false;
      return;
    }

    if (this.porProcesar.length == 0) {
      this.cargando = false;
      this.uiService.mostrarAlertaError("PDE", "No hay datos por procesar");
    }

    this.kitService
      .obtenerDetalleSolicitudes(this.porProcesar)
      .subscribe({
        next: this.observerDetalleSolicitud,
        error: () => { },
        complete: () => {
          
          if (this.conError.length > 0) {
            this.cargando=false;
            return;
          }
          this.agruparCuadernos()          
        }
      }
      );

  }

  observerDetalleSolicitud = ({ kit, id, success, mensaje, kitSolicitud }) => {
    const totalItems = kit.detalle?.length || 0;
    let _mensaje = "";
    if (totalItems > 0) {
      let total = Number(kitSolicitud.cantidad);
      this.kitRegistro.push(kit);
      for (let index = 0; index < total; index++) {
        this.cuadernosRegistro.push(...kit.detalle);
      }
      _mensaje = `Este Kit contiente ${totalItems} `;
      totalItems > 1 ? _mensaje += 'cuadernos' : _mensaje += 'cuaderno';
    } else {
      _mensaje = `Este kit no tiene cuadernos`;
    }
    if (!success) {
      _mensaje = mensaje;
      this.conError.push(id);
    }
    mostrarMensaje(this.spreadsheetObj, _mensaje, `D${id + 1}`, success ? 'green' : 'red')    
    setTimeout(() => this.spreadsheetObj.goTo(`A${id + 1}`), 200);
  }


  agruparCuadernos() {

    const skus = this.cuadernosRegistro.map(c => c["sku1"]);
    const skuUnicos = [...new Set(skus)];
    const solicitudesCuaderno: SolicitudCuaderno[] = [];
    skuUnicos.forEach(s => {
      let total = 0;
      let _skus = this.cuadernosRegistro.filter(c => c["sku1"] === s);
      _skus.forEach(c => total++);
      const info = _skus[0];
      solicitudesCuaderno.push({
        sku1: s,
        sku2: info["sku2"],
        numparteprod: info["numparteprod"],
        descripcion: info["descripcion"],
        cantidadRequerida: total
      });
    });
    if (this.conError.length > 0) {
      this.uiService.mostrarAlertaError("PDE", "No se registrara el PDE hasta que toda la información sea correcta");
      this.cargando = false;
      return;
    }
    let dto = [];
    this.kitRegistro.forEach(k => {

      const {
        numparteprod,
        idioma,
        clavekit,
        clavekit2,
        identifica,
        pr,
        etiqueta,
        cont1,
        cont2,
        vehiculo,
        edicion,
        indice,
        plataforma,
        totalCajasPorTarima,
        totalPorCaja } = k;

      const _k = this.porProcesar.find(r => r.kit.clave === numparteprod);
      const { cantidad } = _k.kit;
      const totalCajas = cantidad / totalPorCaja;
      dto.push({
        cuadernos: k.detalle.map(m => m.sku1),
        numparteprod,
        idioma,
        pr,
        cont2: cont2,
        cont1: cont1,
        etiqueta: etiqueta,
        edicion,
        indice,
        clavekit,
        clavekit2,
        vehiculo,
        identifica,
        plataforma,
        maxTarima: Number(totalCajasPorTarima),
        maxCaja: Number(totalPorCaja),
        reportados: Number(cantidad),
        cantidadSolicitada: Number(cantidad),
        distribucion: { // --totalCajas = totalReportados/totalPorCaja (MAXcajas)   -totalReportados  --totalPorCaja
          numparteprod,
          Caja: {
            completas: { total: Math.trunc(totalCajas), totalKits: Number(totalPorCaja) }, incompletas: { totalKits: cantidad % totalPorCaja },
            //detalle: formarCajas(numparteprod, Math.trunc(totalCajas), Number(totalPorCaja), (cantidad % totalPorCaja))
          }
        },
      });
    });
    //MAX  --DTO



    //console.log(dto);
    this.tarimas = generarLote(dto, this.maximoCajasPorTarima);



    //const kits = this.porProcesar.map(k => k.kit);
    this.resumenConfeccion = dto.map(d => {
      const caja = d.distribucion.Caja
      let total = caja.completas.total;
      if (caja.incompletas.totalKits > 0) {
        total++;
      }
      let detalle = caja.completas.total > 0 ? ` ${caja.completas.total} de ${d.maxCaja} kits` : '';
      detalle += caja.incompletas.totalKits > 0 ? ` y 1 de ${caja.incompletas.totalKits} kits` : ''
      // console.log(d.numparteprod);
      // if (caja.completas.total > 0) {
      //   console.log(`${caja.completas.total} Cajas completas de ${d.maxCaja}`);
      // }
      // if (caja.incompletas.totalKits > 0) {
      //   console.log(`1 cajas incompleta de ${caja.incompletas.totalKits}`);
      // }
      //console.log(d.);
      //const {orden_compra}= kits.find(k=>k.clave==d.numparteprod);           
      return {
        numparteprod: d.numparteprod,
        totalComponentes: d.cuadernos.length,
        etiqueta: d.etiqueta,
        pr: d.pr,
        cont1: d.cont1,
        cont2: d.cont2,
        indice: d.indice,
        clavekit: d.clavekit,
        clavekit2: d.clavekit2,
        edicion: d.edicion,
        identifica: d.identifica,
        idioma: d.idioma,
        plataforma: d.plataforma,
        normaEmpaque: d.maxCaja,
        totalCajas: total,
        detalle: detalle,
        vehiculo: d.vehiculo,
        nombrePDE: this.registroForm.get("nombre").value,
        confeccion: d.cantidadSolicitada,
      }
    });


    // console.log(this.registroForm.value);
    // console.log(solicitudesCuaderno);
     

    //Registrar el PDE en el sistema de Almacen PT y despues registrarlo en Literatura
    this.pdeService
      .registrarSolicitudAlmacen(solicitudesCuaderno, this.registroForm.value)
      .pipe(
        switchMap(_ =>
          this.pdeService
            .registrar(
              this.tarimas,
              this.resumenConfeccion,
              this.registroForm.value))
      ).subscribe(response => {
        this.uiService.mostrarAlertaSuccess("PDE", "PDE registrado", 1000);
        setTimeout(() => {
          this.cargando = false;
          this.router.navigate(["../detalle", response["id"]], { relativeTo: this.route })
        }, 2000)
      })

  }



  irListado() {
    this.router.navigate(["../inicio"], { relativeTo: this.route })
  }

  colocarEncabezados() {
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
    this.spreadsheetObj.setBorder({ border: '1px solid #e0e0e0' }, 'A1:H11');
    this.spreadsheetObj.endEdit();
    this.spreadsheetObj.updateCell({ value: "Numparte producción" }, "B1")
    this.spreadsheetObj.updateCell({ value: "Cantidad" }, "C1");

  }

  setInformacionFicticia() {

    // this.spreadsheetObj.updateCell({ value: "17A012722DG" }, "B2")    
    // this.spreadsheetObj.updateCell({ value: "2GJ012723SA" }, "B4");
    // this.spreadsheetObj.updateCell({ value: "2GJ012722DA" }, "B5");
    // this.spreadsheetObj.updateCell({ value: "2GJ012742DA" }, "B6");
    // this.spreadsheetObj.updateCell({ value: "2GJ012762AA" }, "B7")
    // this.spreadsheetObj.updateCell({ value: "5NM012723SH" }, "B8");
    // this.spreadsheetObj.updateCell({ value: "5NM012722DH" }, "B9");
    // this.spreadsheetObj.updateCell({ value: "5NM012762AH" }, "B10");
    // this.spreadsheetObj.updateCell({ value: "5NM012742DH" }, "B11");
    // this.spreadsheetObj.updateCell({ value: "293" }, "C2")
    // this.spreadsheetObj.updateCell({ value: "218" }, "C3");
    // this.spreadsheetObj.updateCell({ value: "1427" }, "C4");
    // this.spreadsheetObj.updateCell({ value: "650" }, "C5");
    // this.spreadsheetObj.updateCell({ value: "419" }, "C6")
    // this.spreadsheetObj.updateCell({ value: "293" }, "C7");
    // this.spreadsheetObj.updateCell({ value: "2504" }, "C8");
    // this.spreadsheetObj.updateCell({ value: "579" }, "C9");
    // this.spreadsheetObj.updateCell({ value: "408" }, "C10");
    // this.spreadsheetObj.updateCell({ value: "180" }, "C11");
    // this.registroForm.get("nombre").setValue("PDE de prueba");

  }

  reiniciar() {
    const { rowIndex } = this.spreadsheetObj.sheets[0].usedRange;
    this.colocarEncabezados();
    this.spreadsheetObj.clear({ type: "Clear Contents", range: 'B2:Z' + rowIndex + 100 });
    this.spreadsheetObj.goTo("A1");
    this.posicionCell = 2;
  }

  created() {
    this.reiniciar();
    this.cargado = true;
    this.setInformacionFicticia();

  }

}
