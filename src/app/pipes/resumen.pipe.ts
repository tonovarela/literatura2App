import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumenFiltro'
})
export class ResumenPipe implements PipeTransform {

  transform(resumen: any[] ,etiqueta:string="reportados" ): any[] {
    if (etiqueta=="reportados"){
      return resumen.filter(x=>x.reportados>0);
    }
    return resumen;
    
  }

}
