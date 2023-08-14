import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[error-indicador]'
})
export class ErrorIndicadorDirective {

  htmlElement: ElementRef<HTMLElement>;
  
  constructor(private el: ElementRef<HTMLElement>) { 
    this.htmlElement = el;
  }

  @Input() set valido(valor: boolean) {    
    
    if (!valor) {
      this.htmlElement.nativeElement.classList.add("parsley-error");
    } else {
      this.htmlElement.nativeElement.classList.remove("parsley-error");
    }
  }

}
