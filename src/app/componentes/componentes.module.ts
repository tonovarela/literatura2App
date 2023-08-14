import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ViewImpresionComponent } from './view-impresion/view-impresion.component';
import { EntarimadoComponent } from './entarimado/entarimado.component';
import { LoaderSpinnerComponent } from './loaders/loader-spinner/loader-spinner.component';
import { LoaderComponent } from './loaders/loader/loader.component';
import { MensajeEstacionBloquedadaComponent } from './mensaje-estacion-bloquedada/mensaje-estacion-bloquedada.component';
import { PdeInactivoComponent } from './pde-inactivo/pde-inactivo.component';
import { ProgresoConfeccionComponent } from './progreso-confeccion/progreso-confeccion.component';
import { ResumenConfeccionComponent } from './resumen-confeccion/resumen-confeccion.component';
import { TablaEntregaComponent } from './tabla-entrega/tabla-entrega.component';
import { TarimadorComponent } from './tarimador/tarimador.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    ViewImpresionComponent,
    EntarimadoComponent,
    TarimadorComponent,
    ResumenConfeccionComponent,    
    LoaderComponent,
    LoaderSpinnerComponent,
    MensajeEstacionBloquedadaComponent,
    PdeInactivoComponent,
    ProgresoConfeccionComponent,
    TablaEntregaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    DragDropModule
  ],
  exports:[ViewImpresionComponent,EntarimadoComponent, TarimadorComponent, LoaderComponent,LoaderSpinnerComponent,ResumenConfeccionComponent, MensajeEstacionBloquedadaComponent,PdeInactivoComponent,ProgresoConfeccionComponent,TablaEntregaComponent]
})
export class ComponentesModule { }
