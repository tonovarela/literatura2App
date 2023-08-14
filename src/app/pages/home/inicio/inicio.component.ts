
import { Component, OnInit } from '@angular/core';
import { Impresion } from 'src/app/interfaces/impresion.interface';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: [
  ]
})
export class InicioComponent implements OnInit {
  URL:string="http://192.168.2.222/impresiones";
  constructor() { }


   Kit: Impresion ={
     url:`${this.URL}/api/impresion/kit?esBase=SI`,
     data:"",
     titulo:"Kit"

   };

   Caja : Impresion={
    url:`${this.URL}/api/impresion/caja?esBase=SI`,
    data:"",
    titulo:"Caja"
  };

  Tarima : Impresion={
    url:`${this.URL}/api/impresion/tarima?esBase=SI`,
    data:"",
    titulo:"Tarima"
  }

  
  ngOnInit(): void {
   
  }





  
  // get cargando(){
  //   return this.etiquetaService.cargando;
  // }

  //  downloadPDF() {
  
    
  //  this.etiquetaService.obtenerArchivo();
  

  // }










}
