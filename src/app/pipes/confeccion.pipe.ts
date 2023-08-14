import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'confeccionFiltro'
})
export class ConfeccionPipe implements PipeTransform {

  transform(confeccion: any, edicion:string=""): any[] {
    
    return edicion.toUpperCase()=="NACIONALES"
        ?confeccion.filter(x=>x.edicion.toUpperCase().trim()!="IMPORTADOS")
        :confeccion.filter(x=>x.edicion.toUpperCase().trim()=="IMPORTADOS")
      
  }

}
