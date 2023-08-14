import { SharedModule } from './../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuadernosRoutingModule } from './cuadernos-routing.module';
import { ListarComponent } from './pages/listar/listar.component';
import { CuadernosComponent } from './cuadernos.component';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DetalleComponent } from './pages/detalle/detalle.component';


@NgModule({
  declarations: [
    ListarComponent,
    CuadernosComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    GridAllModule,
    ReactiveFormsModule,
    DropDownListAllModule,
    SharedModule,
    CuadernosRoutingModule
  ]
})
export class CuadernosModule { }
