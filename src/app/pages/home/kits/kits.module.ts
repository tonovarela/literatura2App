import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { KitsRoutingModule } from './kits-routing.module';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { KitsComponent } from './kits.component';
import { ListarComponent } from './pages/listar/listar.component';
import { SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';

import { FilterService, GridAllModule, PageService, SortService, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  declarations: [    
    RegistrarComponent,
    DetalleComponent,
    KitsComponent,
    ListarComponent
  ],
  imports: [
    CommonModule,
    AutocompleteLibModule,  
    SpreadsheetAllModule,
    GridModule,
    GridAllModule,
    DropDownListAllModule,
    KitsRoutingModule,
    SharedModule,    
    ReactiveFormsModule, 
    
  ],
  providers:[PageService,SortService,FilterService ]
})
export class KitsModule { }
