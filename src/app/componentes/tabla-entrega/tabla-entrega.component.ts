import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoteService } from '@services/lote.service';
import { UiService } from '@services/ui.service';
import { mdColors } from 'src/app/interfaces/shared/colors';

@Component({
  selector: 'app-tabla-entrega',
  templateUrl: './tabla-entrega.component.html',
  styleUrls: ['./tabla-entrega.component.css']
})
export class TablaEntregaComponent implements OnInit {

  @Input('lotesDetalle') lotesDetalle: any[];
  @Output('irEntrega') irEntrega = new EventEmitter<any>();
  @Input('etiquetaDetalle') etiquetaDetalle: string = "";
  colors: string[] = mdColors;
  pdesColors: any[] = [];

  constructor(private loteService: LoteService, private uiService: UiService) { }

  ngOnInit(): void {    
    let _pdes: any[] = [];
  
    this.lotesDetalle.forEach(x => {
      const pdes = [... new Set(x.detalle.map(d => d.nombre))]; //Se quitan los duplicados                           
      _pdes = _pdes.concat(pdes)
      x.pdes = pdes;
    });

    this.pdesColors = [... new Set(_pdes)].map((pde, index) => { return { pde, color: mdColors[index] } });  
  }

  colorPDE(nombrePDE) {
    const { color } = this.pdesColors.find(p => p.pde == nombrePDE);
    return color;
  }

  obtenerTotal(detalle: any[]) {
    let total = 0;
    detalle.forEach(x => { total += Number(x.total) });
    return total;

  }

  _irEntrega(id) {
    this.irEntrega.emit(id);
  }

  actualizarLote(lote) {
    this.loteService.actualizar(lote).subscribe(x => {
      this.uiService.mostrarAlertaSuccess("Pallet", `Pallet actualizado a  "${lote.nombrePallet}"`);
    })
  }

}
