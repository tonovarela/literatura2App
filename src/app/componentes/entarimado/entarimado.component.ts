import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ImpresionService } from '../../services/impresion.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-entarimado',
  templateUrl: './entarimado.component.html',
  styleUrls: ['./entarimado.component.css'],
})
export class EntarimadoComponent implements OnInit {
  @Input('tarimas') tarimas: any[] = [];
  @Input('maximoCajasPorTarima') maximoCajasPorTarima: number;
  @Input('totalTarimas') totalTarimas: number;
  @Input('puedeMoverCajas') puedeMoverCajas: boolean;
  @Input('pdesAsociados') pdesAsociados:any[];
  @Input('actualizo') actualizo: boolean;

  @Output('apilar') apilar = new EventEmitter<any>();
  @Output('reset') reset = new EventEmitter<any>();
  @Output('agregarTarima') agregarTarima = new EventEmitter<any>();    //SIN USARSE --Pero se quedan por si acaso hay cambio de planes
  @Output('eliminarTarima') eliminarTarima = new EventEmitter<any>();  
  @Output('eliminarTarimaDistribucion') eliminarTarimaDistribucion= new EventEmitter<any>();
  @Output('movioItem') movioItem = new EventEmitter<any>();
  @Output('eliminarCaja') eliminarCaja = new EventEmitter<any>();

  apilo: boolean;

  constructor(public impresionService: ImpresionService) { }

  get MAX() {
    return Number(this.maximoCajasPorTarima);
  }
  ngOnInit(): void {        
    this.apilo = false;            
  }
  _eliminarTarimaDistribucion(tarima) {    
    const { id, cajas } = tarima;
    const [caja] = cajas;
    let totalKits = 0;
    cajas.forEach(c => totalKits+=c.totalKits);
    const tarimaDistribucion={ id_tarima:id, numpartprod: caja.nombre,totalKits };    
    this.eliminarTarimaDistribucion.emit(tarimaDistribucion);
  }
  eliminar(caja) {
    this.eliminarCaja.emit(caja);
  }
  resetApilamiento() {
    this.reset.emit(null);
    this.apilo = false;
    this.movioItem.emit(true);
  }
  recomendarPila() {
    this.apilar.emit(null);
    this.movioItem.emit(true);
    this.apilo = true;
  }
  drop(event: CdkDragDrop<number[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.movioItem.emit(true);
  }

  colorPDE(caja){    
    const [pde] = this.pdesAsociados.filter(x=>x.id_pde==caja.id_pde);    
    if (pde==undefined){
      return 'red';
    }

    return pde.color;
  }

  validaMaximoCajas = (item: CdkDrag, container: CdkDropList) => {
    if (container.data.length == this.MAX) {
      return false;
    }
    return true;
  };

  //En desuso
  impresionCaja(caja) {
    //console.log(caja);
    //this.impresionService.generarPorCaja(caja.id);
  }


  _eliminarTarima(tarima) {
    this.eliminarTarima.emit(tarima);
  }

  _agregarTarima() {
    this.agregarTarima.emit();
  }
}
