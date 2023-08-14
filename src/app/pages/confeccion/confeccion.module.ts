import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { ConfeccionRoutingModule } from './confeccion-routing.module';

import { ConfeccionComponent } from './confeccion.component';


@NgModule({
  declarations: [
   ConfeccionComponent    
  ],
  imports: [
    CommonModule,    
    ConfeccionRoutingModule,    
    
  ]
})
export class ConfeccionModule { }
