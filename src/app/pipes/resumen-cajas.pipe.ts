import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumenCajas'
})
export class ResumenCajasPipe implements PipeTransform {

  transform(label: string) {
    const l =label.substring(1,label.length-1);    
    return l.startsWith("y")?l.substring(1,label.length-1):label;    
    
  }

}
