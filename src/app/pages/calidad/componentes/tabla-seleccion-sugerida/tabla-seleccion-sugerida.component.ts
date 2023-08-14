import { Component, Input, OnInit } from '@angular/core';
import { SeleccionSugerida } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tabla-seleccion-sugerida',
  templateUrl: './tabla-seleccion-sugerida.component.html',
  styleUrls: ['./tabla-seleccion-sugerida.component.css']
})
export class TablaSeleccionSugeridaComponent implements OnInit {
  @Input('seleccionSugerida') seleccionSugerida: SeleccionSugerida;

  constructor() { }

  ngOnInit(): void {



  }

  get CajasActivas() {
    return this.seleccionSugerida.stackKits.filter(x => x.activo).map(x => {     
      const last=x.dataMatrixCode.substring(x.dataMatrixCode.length - 5);
      x["codeShadow"]=`**************************************${last}`
      return x; 
    });
  }
  get CajasInactivas() {
    return this.seleccionSugerida.stackKits.filter(x => !x.activo).map(x => {
      const last=x.dataMatrixCode.substring(x.dataMatrixCode.length - 5);
      x["codeShadow"]=`**************************************${last}`
      return x; 
    });
  }


  get tieneDataMatrixCapturado() {
    return this.seleccionSugerida.stackKits.some(x => x.dataMatrixCode == x.id_caja);
  }


}
