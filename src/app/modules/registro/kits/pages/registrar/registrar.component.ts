import { UiService } from './../../../../../services/ui.service';
import { WindowsService } from '../../../../../services/windows.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CellModel, SheetModel, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { Subscription } from 'rxjs';
import { KitService } from '../../services/kit.service';
import { MaxUsedRange, obtenerDetalleKit, obtenerKit } from 'src/app/utils/spreadsheet-helper';


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
  //posicionCell: number = 1;
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





  limpiarLayout() {
    const maxSheet1Index = MaxUsedRange(this.spreadsheetObj, 0);
    const maxSheet2Index = MaxUsedRange(this.spreadsheetObj, 1);

    this.SheetActive = { nombre: this.spreadsheetObj.sheets[0].name, indice: 0 };
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:Z${maxSheet1Index+100}` });
    this.SheetActive = { nombre: this.spreadsheetObj.sheets[1].name, indice: 1 };
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:Z${maxSheet2Index+100}` });
    this.spreadsheetObj.closeEdit();
    this.resetVariables();



  }


  get TextoTotalKit() {
    return `${this.kitProcesado.length} de ${this.kitPorProcesar.length}`;
  }

  get TextoTotalDetalleKit() {
    return `${this.detalleKitProcesado.length} de ${this.detalleKitPorProcesar.length}`;

  }



  async registroKits() {
 
    this.kitPorProcesar=[];
    this.spreadsheetObj.activeSheetIndex = 0;
    const p = new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) }, 500)
    });
    await p;

    this.spreadsheetObj.goTo("Kit!A1");
    const x = new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) }, 500)
    });
    await x

    this.SheetActive = { nombre: this.spreadsheetObj.sheets[0].name, indice: 0 };
    let rowIndex = MaxUsedRange(this.spreadsheetObj, this.SheetActive.indice) + 1;

    this.resetVariables();
    this.spreadsheetObj.endEdit();

    this.cargando = true;
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:A${rowIndex}` });

    for (let i = 1; i <= rowIndex; i++) {
      let row = obtenerKit(this.spreadsheetObj, i);
      if (row.hasOwnProperty('mensaje')) {
        this.ObserverProcesarKit({ mensaje: row["mensaje"], id: i + 1, registro: {}, success: false, tipo: "kit" });
        continue;
      }
      if (row["numparteprod"].length > 0) {
        this.kitPorProcesar.push({ registro: row, id: i, tipo: 'kit' });
      }
    }


    this.kitService.procesarKit(this.kitPorProcesar).subscribe({
      next: (response) => {
        this.ObserverProcesarKit(response)
      },
      complete: async () => {
        await this.registroDetalleKits();
      },
      error: () => {
        this.cargando = false
      }
    });



  }


  async registroDetalleKits() {
    this.spreadsheetObj.activeSheetIndex = 1
    this.detalleKitPorProcesar=[];
    const p = new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) },500)
    });
    await p;
    this.spreadsheetObj.goTo("Cuadernos!A1");    
    const x = new Promise((resolve, reject) => {
      setTimeout(() => { resolve(true) }, 500)
    });
    await x
    
    this.SheetActive = { nombre: this.spreadsheetObj.sheets[1].name, indice: 1 };
    const rowIndex = MaxUsedRange(this.spreadsheetObj, 1);    
    this.spreadsheetObj.clear({ type: "Clear Contents", range: `${this.SheetActive.nombre}!A2:A${rowIndex+1}` });
    this.spreadsheetObj.endEdit();
    for (let i = 1; i <= rowIndex + 1; i++) {
      let row = obtenerDetalleKit(this.spreadsheetObj, i);
    
      if (row.hasOwnProperty('mensaje')) {
        this.ObserverProcesarKit({ mensaje: row["mensaje"], id: i + 1, registro: {}, success: false, tipo: 'detalleKit' });
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
    .subscribe({
      next: (response) => {
        this.ObserverProcesarKit(response);
      },
      complete: () => { this.cargando = false },
    });






  }




  ObserverProcesarKit({ mensaje, id, registro, success, tipo }) {

    const nombreSheet = this.SheetActive.nombre;
    const address = `${nombreSheet}!A${id + 1}`;
    const cell: CellModel = {
      style: { color: (!success ? "red" : "green") },
      value: mensaje
    };

    if (!success) {
      tipo == "kit" ? this.kitError.push(cell) : this.detalleKitError.push(cell)
    }
    else {
      tipo == "kit" ? this.kitProcesado.push(cell) : this.detalleKitProcesado.push(cell)

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
