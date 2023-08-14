import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.component.html',
  styles: [
  ]
})
export class ContadorComponent implements OnInit {


  @Input() etiqueta: string ="";
  @Input() cuerpo: string="";
  @Input() success: boolean= true;
  @Input() subtitulo: string ="";

  constructor() { }

  ngOnInit(): void {
  }

}
