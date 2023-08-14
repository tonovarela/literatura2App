
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaImpresionComponent } from './caja-impresion/caja-impresion.component';



@NgModule({
  declarations: [CajaImpresionComponent,],
  imports: [
    CommonModule,
    
  ],
  exports: [CajaImpresionComponent]
})
export class ImpresionModule { }
