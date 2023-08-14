import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitsRoutingModule } from './kits-routing.module';
import { PdeComponent } from './pages/pde/pde.component';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { EntregaComponent } from './pages/entrega/entrega.component';
import { PipesModule } from 'src/app/pipes/pipes.module';


import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PdeComponent,    
    ResumenComponent,
    EntregaComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    KitsRoutingModule,
    GridModule,
    GridAllModule,    
    DropDownListAllModule,
    ComponentesModule,
    FormsModule,
    CheckBoxModule
  ]
})
export class KitsModule { }
