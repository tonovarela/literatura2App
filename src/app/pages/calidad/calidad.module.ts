import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { CalidadRoutingModule } from './calidad-routing.module';
import { CalidadComponent } from './calidad.component';
import { FormsModule } from '@angular/forms';

import { EntregaComponent } from './pages/entrega/entrega.component';
import { ComponentesModule } from '@componentesModule/componentes.module';
import { InspeccionComponent } from './pages/inspeccion/inspeccion.component';

import { RevisionKitComponent } from './componentes/revision-kit/revision-kit.component';
import { TablaSeleccionSugeridaComponent } from './componentes/tabla-seleccion-sugerida/tabla-seleccion-sugerida.component';
import { TablaTamanioMuestrasComponent } from './componentes/tabla-tamanio-muestras/tabla-tamanio-muestras.component';
import { SinInspeccionComponent } from './pages/sin-inspeccion/sin-inspeccion.component';
import { ConInspeccionComponent } from './pages/con-inspeccion/con-inspeccion.component';
import { ListadoInspeccionComponent } from './componentes/listado-inspeccion/listado-inspeccion.component';



@NgModule({
  declarations: [
    CalidadComponent,        
    EntregaComponent,
    InspeccionComponent,
    RevisionKitComponent,
    TablaSeleccionSugeridaComponent,
    TablaTamanioMuestrasComponent,
    SinInspeccionComponent,
    ConInspeccionComponent,
    ListadoInspeccionComponent,
    
    
  ],
  imports: [
    CommonModule,        
    ComponentesModule,
    GridModule,
    GridAllModule,
    DropDownListAllModule,        
    CalidadRoutingModule,
    FormsModule,
    
  ]
})
export class CalidadModule { }
