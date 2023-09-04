import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuadernosRoutingModule } from './cuadernos-routing.module';
import { PdeComponent } from './pages/pde/pde.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { RevisionComponent } from './pages/revision/revision.component';
import { GridAllModule, GridModule} from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { LoteComponent } from './pages/lote/lote.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [  
    PdeComponent,
            ResumenComponent,
            RevisionComponent,
            LoteComponent
  ],
  imports: [
    CommonModule,
    CuadernosRoutingModule,
    GridModule,
    GridAllModule,    
    DropDownListAllModule,
    ComponentesModule,
    PipesModule,
    ReactiveFormsModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CuadernosModule { }
