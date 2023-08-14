import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Stack } from 'src/app/class/Stack';
import { NewID } from 'src/app/utils/utils';
import { environment } from '../../../environments/environment';
import { ImpresionService } from '../../services/impresion.service';
@Component({
  selector: 'app-tarimador',
  templateUrl: './tarimador.component.html',
  styleUrls: ['./tarimador.component.css']
})
export class TarimadorComponent implements OnInit {
  @Input("tarimas") tarimas: any = { completas: [], mezcladas: [], mezcladasBKP: [] };
  @Input("maximoCajasPorTarima") maximoCajasPorTarima: number;
  @Input("actualizo") actualizo: boolean;
  @Input("pdesAsociados") pdesAsociados: any[];
  @Output('movioItem') movioItem = new EventEmitter<any>();
  @Output('eliminarCaja') eliminarCaja = new EventEmitter<any>();
  @Output('eliminarTarima') eliminarTarima = new EventEmitter<any>();
  @Output('eliminarTarimaDistribucion') eliminarTarimaDistribucion = new EventEmitter<any>();

  URL_IMPRESIONES: string = environment.URL_IMPRESIONES;
  constructor(private impresionService: ImpresionService
  ) { }

  ngOnInit(): void {    
  }

  _eliminarCaja(caja) {
    this.eliminarCaja.emit(caja);
  }

  tabTarima(tipo) {
    //Muestra cual tab mostrar dependiendo del contenido de las tarimas    
    if (this.tarimas.completas.length>0 && tipo == "completas"){
      return "active";
    }
    if (this.tarimas.mezcladas.length>0 && tipo == "incompletas"){
      return "active";
    }
    return "";
  }

  obtenerTotalCajasTarima(tarimas) {
    let total = 0;
    tarimas.forEach(d => {
      total += d.cajas.length;
    });
    return total;
  }

  obtenerTotalKits() {
    let total = 0;
    this.tarimas.completas.forEach(d => {
      d.cajas.forEach(x => { total += Number(x.totalKits) });
    });
    this.tarimas.mezcladas.forEach(d => {
      d.cajas.forEach(x => { total += Number(x.totalKits) });
    });
    return total;
  }

  ImpresionCajas(id: string) {
    this.impresionService.generarPorCaja(id);
  }

  ImpresionTarimas(id: string) {
    this.impresionService.generarPorTarima(id);
  }


  get totalTarimas() {
    return this.tarimas.completas.length + this.tarimas.mezcladas.length;
  }
  resetTarimasMezcladas() {
    this.tarimas.mezcladas = JSON.parse(JSON.stringify(this.tarimas.mezcladasBKP));
  }

  agregarTarima() {
    const total = this.totalTarimas + 1
    this.tarimas.mezcladas.push({ id: NewID(), nombre: `Tarima ${total}`, tipo: "mezclada", cajas: [] });
  }

  _eliminarTarima(tarima) {
    this.eliminarTarima.emit(tarima);
  }

  _eliminarTarimaDistribucion(tarimaDistribucion) {
    this.eliminarTarimaDistribucion.emit(tarimaDistribucion);
  }

  apilarCajasSugerencia() {
    const max = Number(this.maximoCajasPorTarima);
    let stack: Stack = new Stack();
    this.tarimas.mezcladas.forEach(d => {
      d.cajas.forEach(x => {
        stack.push(x);
      });
    });
    let tarimas = [];
    let i = 0;
    while (stack.size() > 0) {
      if (stack.size() >= max) {
        const { id } = this.tarimas.mezcladas[i++];
        const numeroTarima = i + this.tarimas.completas.length;
        const _nuevasCajas = stack.obtener(max);
        tarimas.push({ id, nombre: `Tarima ${numeroTarima}`, tipo: "mezcladas", cajas: _nuevasCajas });
      }
      if (stack.size() < max && stack.size() > 0) {
        const { id } = this.tarimas.mezcladas[i++];
        const numeroTarima = i + this.tarimas.completas.length;
        const _nuevasCajas = stack.obtener(stack.size());
        tarimas.push({ id, nombre: `Tarima ${numeroTarima}`, tipo: "mezclada", cajas: _nuevasCajas });
      }
    }
    tarimas.forEach(t => {
      const [_tarima] = this.tarimas
        .mezcladasBKP
        .filter(_t => _t.id == t.id);
      t.nombre = _tarima.nombre
    });
    this.tarimas.mezcladas = tarimas;
  }


  _movioItem(event) {
    this.movioItem.emit(event);
  }


}


