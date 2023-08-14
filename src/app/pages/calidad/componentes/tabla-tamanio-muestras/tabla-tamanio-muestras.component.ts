import { Component, Input, OnInit } from '@angular/core';
import { TamanioMuesta } from '../../utils/calidad';

@Component({
  selector: 'app-tabla-tamanio-muestras',
  templateUrl: './tabla-tamanio-muestras.component.html',
  styleUrls: ['./tabla-tamanio-muestras.component.css']
})
export class TablaTamanioMuestrasComponent implements OnInit {

  @Input("tamanioMuestras") tamanioMuestras: TamanioMuesta[];
  totalKits: number = 0;
  totalMuestra: number = 0;
  constructor() { }
  ngOnInit(): void {
    this.tamanioMuestras.forEach(x => {
      this.totalMuestra += Number(x.tamanioMuestra);
      this.totalKits += Number(x.totalKits);
    });

  }

}
