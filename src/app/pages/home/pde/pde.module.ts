import { ComponentesModule } from './../../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdeRoutingModule } from './pde-routing.module';
import { ListarComponent } from './pages/listar/listar.component';
import { PdeComponent } from './pde.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { PipesModule } from 'src/app/pipes/pipes.module';



@NgModule({
  declarations: [  
    ListarComponent, PdeComponent,AgregarComponent, DetalleComponent
  ],
  imports: [
    CommonModule,    
    FormsModule,
    PdeRoutingModule,
    ReactiveFormsModule,    
    GridModule,
    GridAllModule,
    DropDownListAllModule,
    SpreadsheetAllModule, 
    PipesModule, 
    ComponentesModule,
    SharedModule,          
  ]
})
export class PdeModule { }
