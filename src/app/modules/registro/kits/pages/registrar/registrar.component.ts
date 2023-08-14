import { UiService } from './../../../../../services/ui.service';
import { WindowsService } from '../../../../../services/windows.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CellModel, SheetModel, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { Subscription } from 'rxjs';
import { CuadernoRegistro, ErrorMensaje, KitRegistro } from '../../interfaces/kit.interface';
import { KitService } from '../../services/kit.service';


interface SheetProceso {
  indice?: number;
  nombre?: string;
}

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit, OnDestroy {
  @ViewChild('spreadsheet') spreadsheetObj!: SpreadsheetComponent;
  spreadheight: number = 0;
  posicionCell: number = 2;
  resizeSubscription$: Subscription;


  kitPorProcesar = [];
  detalleKitPorProcesar = [];

  cargando: boolean = false;



  kitProcesado = [];
  kitError = [];

  detalleKitProcesado = [];
  detalleKitError = [];


  styleCell: any = {
    fontWeight: "bold",
    textAlign: "center"
  }
  styleCellRequerido: any = {
    fontWeight: "bold",
    textAlign: "center",
    color: "#df1976"
  }

  SheetActive: SheetProceso = {};

  public spreadData: SheetModel[];
  public spreadDataReset: SheetModel[];



  constructor(private wService: WindowsService,
    private kitService: KitService,
    private uiService: UiService) {
    this.spreadData = [
      {
        name: "Kit",
        columns: [
          { width: 10 },
          { width: 140 },
          { width: 130 },
          //{ width: 150 },
          { width: 130 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 80 },
          { width: 100 },
          { width: 80 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
        ],
        rows: [{
          height: 30,
          cells: [
            { value: "", },
            { value: "Número parte Prod*", style: this.styleCellRequerido },
            { value: "Total kits por caja*", style: this.styleCellRequerido },            
            { value: "Numero de parte", style: this.styleCell },
            { value: "Edición", style: this.styleCell },
            { value: "Clave kit", style: this.styleCell },
            { value: "Clave kit 2", style: this.styleCell },
            { value: "Identifica", style: this.styleCell },
            { value: "Plataforma", style: this.styleCell },
            { value: "Pr", style: this.styleCell },
            { value: "Indice", style: this.styleCell },
            { value: "Idioma", style: this.styleCell },
            { value: "Cont1", style: this.styleCell },
            { value: "Cont2", style: this.styleCell },
            { value: "Vehiculo", style: this.styleCell },
            { value: "Tipo", style: this.styleCell },
            { value: "Etiqueta", style: this.styleCellRequerido },
            { value: "Orden compra", style: this.styleCellRequerido },
          ]
        }]
      },
      {
        name: "Cuadernos",
        columns: [
          { width: 10 },
          { width: 200 },
          { width: 200 },
          { width: 100 },
          { width: 140 },
          { width: 140 },
        ],
        rows: [{
          height: 30,
          cells: [
            { value: "", },
            { value: "Número parte Prod kit*", style: this.styleCellRequerido },
            { value: "Número parte Prod cuaderno*", style: this.styleCellRequerido },
            { value: "sku2", style: this.styleCell },
            { value: "Descripción*", style: this.styleCellRequerido },
            { value: "Clasificación*", style: this.styleCellRequerido },
          ]
        }]
      }
    ];

    this.spreadDataReset = [...this.spreadData];

  }


  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe()
  }

  ngOnInit(): void {
    this.spreadheight = window.innerHeight - 250;
    this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
      this.spreadheight = window.innerHeight - 250;
    });
  }

  created() {
    this.spreadsheetObj.goTo("A1");

  }



  private obtenerData(indice, columna) {
    return this.spreadsheetObj.getValueRowCol(this.SheetActive.indice,
      indice,
      columna) || "";
  }


  limpiarLayout() {

    this.SheetActive = { nombre: this.spreadsheetObj.sheets[0].name, indice: 0 };
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:R${this.MaxUsedRange + 100}` });
    this.SheetActive = { nombre: this.spreadsheetObj.sheets[1].name, indice: 1 };
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:F${this.MaxUsedRange + 100}` });
    this.spreadsheetObj.closeEdit();
    this.resetVariables();



  }
  private obtenerKit(indiceRow): KitRegistro | ErrorMensaje {

    let row: KitRegistro = {
      numparteprod: this.obtenerData(indiceRow, 2).toString(),
      totalPorCaja: Number(this.obtenerData(indiceRow, 3).toString()),
      //totalCajasPorTarima: Number(this.obtenerData(indiceRow, 4).toString()),
      numparte: this.obtenerData(indiceRow, 4).toString(),
      edicion: this.obtenerData(indiceRow, 5).toString(),
      clavekit: this.obtenerData(indiceRow, 6).toString(),
      clavekit2: this.obtenerData(indiceRow, 7).toString(),
      identifica: this.obtenerData(indiceRow, 8).toString(),
      plataforma: this.obtenerData(indiceRow, 9).toString(),
      pr: this.obtenerData(indiceRow, 10).toString(),
      indice: this.obtenerData(indiceRow, 11).toString(),
      idioma: this.obtenerData(indiceRow, 12).toString(),
      cont1: this.obtenerData(indiceRow, 13).toString(),
      cont2: this.obtenerData(indiceRow, 14).toString(),
      vehiculo: this.obtenerData(indiceRow, 15).toString(),
      tipo: this.obtenerData(indiceRow, 16).toString(),      
      etiqueta: this.obtenerData(indiceRow, 17).toString(),
      orden_compra: this.obtenerData(indiceRow, 18).toString(),
      
    };


    if (row.numparteprod.length > 0 && (isNaN(row.totalPorCaja) || row.totalPorCaja <= 0)) {
      return { error: true, mensaje: "Capture el total de kits por caja" };
    }

  
    if (row.numparteprod.length > 0 && row.etiqueta.length <= 0) {
      return { error: true, mensaje: "Capture la etiqueta " };
    }

    return row;

  }

  private obtenerDetalleKit(indiceRow): CuadernoRegistro | ErrorMensaje {


    if (this.obtenerData(indiceRow, 2).toString().trim().length > 0
      && this.obtenerData(indiceRow, 3).toString().trim().length == 0) {

      return { error: true, mensaje: "Hace falta el sku 1" };
    }

    if (this.obtenerData(indiceRow, 2).toString().trim().length > 0
      && this.obtenerData(indiceRow, 5).toString().trim().length == 0) {
      return { error: true, mensaje: "Hace falta la descripcion" };
    }

    if (this.obtenerData(indiceRow, 2).toString().trim().length > 0
      && this.obtenerData(indiceRow, 6).toString().trim().length == 0) {
      return { error: true, mensaje: "Hace falta la clasificación" };
    }

    let row: CuadernoRegistro = {
      numparteprod: this.obtenerData(indiceRow, 2).toString(),
      sku1: this.obtenerData(indiceRow, 3).toString(),
      sku2: this.obtenerData(indiceRow, 4).toString(),
      descripcion: this.obtenerData(indiceRow, 5).toString(),
      clasificacion: this.obtenerData(indiceRow, 6).toString(),

    };

    return row;

  }

  get MaxUsedRange() {
    const { rowIndex } = this.spreadsheetObj.sheets[this.SheetActive.indice].usedRange;
    return rowIndex;
  }




  get TextoTotalKit() {
    return `${this.kitProcesado.length} de ${this.kitPorProcesar.length}`;
  }

  get TextoTotalDetalleKit() {
    return `${this.detalleKitProcesado.length} de ${this.detalleKitPorProcesar.length}`;

  }



  registroKits() {

    this.SheetActive = { nombre: this.spreadsheetObj.sheets[0].name, indice: 0 };
    let rowIndex = this.MaxUsedRange;
    this.resetVariables();
    this.spreadsheetObj.endEdit();

    this.cargando = true;

    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:A${this.MaxUsedRange + 1}` });

    for (let i = this.posicionCell; i <= rowIndex + 100; i++) {
      let row = this.obtenerKit(i);
      if (row.hasOwnProperty('mensaje')) {
        this.ObserverProcesarKit({ mensaje: row["mensaje"], id: i, registro: {}, success: false, tipo: "kit" });
        continue;
      }
      if (row["numparteprod"].length > 0) {
        this.kitPorProcesar.push({ registro: row, id: i, tipo: 'kit' });
      }
    }

    this.kitService.procesarKit(this.kitPorProcesar)
      .subscribe(this.ObserverProcesarKit,
        (e) => {
          console.log(e);
        }, this.registroDetalleKits);

  }


  registroDetalleKits = () => {
    this.SheetActive = { nombre: this.spreadsheetObj.sheets[1].name, indice: 1 };
    const rowIndex = this.MaxUsedRange;
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:A${this.MaxUsedRange + 1}` });
    this.spreadsheetObj.endEdit();
    for (let i = this.posicionCell; i <= rowIndex + 100; i++) {
      let row = this.obtenerDetalleKit(i);
      if (row.hasOwnProperty('mensaje')) {
        this.ObserverProcesarKit({ mensaje: row["mensaje"], id: i, registro: {}, success: false, tipo: 'detalleKit' });
        continue;
      }
      if (row["numparteprod"].length > 0) {
        this.detalleKitPorProcesar.push({ registro: row, id: i, tipo: 'detalleKit' });

      }
    }

    if (this.detalleKitError.length > 0) {
      this.spreadsheetObj.autoFit("A");
    }

    if (this.detalleKitPorProcesar.length == 0 &&
      this.kitPorProcesar.length == 0 &&
      this.kitError.length == 0 &&
      this.detalleKitError.length == 0) {
      this.uiService.mostrarAlertaError("Kits", "No hay registros por procesar");
    }
    this.kitService.procesarKitDetalle(this.detalleKitPorProcesar)
      .subscribe(this.ObserverProcesarKit, () => {
      }, () => {
        this.cargando = false;
      });

  }




  ObserverProcesarKit = ({ mensaje, id, registro, success, tipo }) => {

    const nombreSheet = this.SheetActive.nombre;;
    const address = `${nombreSheet}!A${id}`;
    const cell: CellModel = {
      style: { color: (!success ? "red" : "green") },
      value: mensaje
    };

    if (!success) {

      if (tipo == "kit") {
        this.kitError.push(cell);
        this.spreadsheetObj.activeSheetIndex = 0;
      } else {

        this.detalleKitError.push(cell);
        this.spreadsheetObj.activeSheetIndex = 1;
      }
    }
    else {

      if (tipo == "kit") {
        this.kitProcesado.push(cell);
        this.spreadsheetObj.activeSheetIndex = 0;
      } else {
        this.detalleKitProcesado.push(cell);
        this.spreadsheetObj.activeSheetIndex = 1;
      }

    }


    this.spreadsheetObj.updateCell(cell, address);
    this.spreadsheetObj.autoFit("A");
    this.spreadsheetObj.goTo(address);



  }




  resetVariables() {
    this.kitPorProcesar = [];
    this.detalleKitPorProcesar = [];

    this.kitProcesado = [];
    this.detalleKitProcesado = [];

    this.detalleKitError = [];
    this.kitError = [];
    // this.registroConError=[];
    // this.registroProcesado=[];

  }




}
