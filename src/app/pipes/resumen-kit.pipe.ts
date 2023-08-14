import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumenKitFiltro'
})
export class ResumenKitPipe implements PipeTransform {

  transform(resumen: any[], numpartprod:string="" ) {

    const comparator= (a,b)=> Number(b.restantes)-Number(a.restantes);
    if (numpartprod.trim().length==0){
      return resumen.sort(comparator);
    }
    return resumen    
    .filter(r=>r.numpartprod
                              .toLowerCase()                              
                              .includes(numpartprod.toLowerCase()))
                              .sort(comparator)
                              
                              
    
  }

}
