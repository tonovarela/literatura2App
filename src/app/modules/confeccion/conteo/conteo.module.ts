import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConteoRoutingModule } from './conteo-routing.module';
import { ComponentesModule } from 'src/app/componentes/componentes.module';
import { PdeComponent } from './pages/pde/pde.component';


import { RevisionComponent } from './pages/revision/revision.component';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PdeComponent,
    RevisionComponent,
  ],
  imports: [    
  CommonModule,      
    ConteoRoutingModule,    
    GridModule,
    ReactiveFormsModule,
    GridAllModule,
    DropDownListAllModule,
    ComponentesModule,
  ], 
})
export class ConteoModule { }
