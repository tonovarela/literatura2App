import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfeccionPipe } from './confeccion.pipe';
import { ResumenPipe } from './resumen.pipe';
import { ResumenKitPipe } from './resumen-kit.pipe';
import { ResumenCajasPipe } from './resumen-cajas.pipe';



@NgModule({
  declarations: [
    ConfeccionPipe,
    ResumenPipe,
    ResumenKitPipe,
    ResumenCajasPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[ConfeccionPipe,ResumenPipe,ResumenKitPipe,ResumenCajasPipe]
})
export class PipesModule { }
