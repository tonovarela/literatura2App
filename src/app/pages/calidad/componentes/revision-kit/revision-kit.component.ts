import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

import { StackKits } from '../../interfaces/interfaces';

interface revisionKitCalidad{
  aceptado?:boolean,  
}

@Component({
  selector: 'app-revision-kit',
  templateUrl: './revision-kit.component.html',
  styleUrls: ['./revision-kit.component.css']
})


export class RevisionKitComponent implements OnInit {
  
  @Input("stackKit") stackKit: StackKits;
  @Output('kitRevisado') kitRevisado = new EventEmitter<StackKits>();
  skuTxt:string="";
  revisiones:revisionKitCalidad[]=[]

  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    for (let i = 0; i < Number(this.stackKit.aceptados); i++) 
      this.revisiones.push({aceptado:true})            
      for (let i = 0; i < Number(this.stackKit.rechazados); i++) 
      this.revisiones.push({aceptado:false})                
  }


  regresar() {
    this.stackKit.aceptados= this.kitAceptados;
    this.stackKit.rechazados= this.kitRechazados;    
    this.kitRevisado.emit(this.stackKit);
  }
  
  cambiaRevision(revision:revisionKitCalidad){    
    revision.aceptado=!revision.aceptado;    
  }
  get haRevisadoTodo() {
    return this.kitAceptados + this.kitRechazados >= Number(this.stackKit.totalKits);
  }
  get kitAceptados(){
    return this.revisiones.filter(x=>x.aceptado).length
  }
  get kitRechazados(){
    return this.revisiones.filter(x=>!x.aceptado).length
  }

  async revisarSKU(event) {
    if (event.keyCode != 13) {
      return;
    }
    if (this.skuTxt.trim().toUpperCase() == this.stackKit.nombreCaja.toUpperCase()) {
      const res = await this.uiService.mostrarAlertaConfirmacion("Revision Kit", "Es aceptado?", "Si, es aceptado", "No, es rechazado");      
        this.revisiones.push({aceptado:res.isConfirmed})              
    } else {
      this.uiService.mostrarAlertaError("Revision kits", `El sku ${this.skuTxt} no corresponde al kit`);
    }
    this.skuTxt = "";
  }

}
