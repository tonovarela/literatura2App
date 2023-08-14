import { ComponentesModule } from './../componentes/componentes.module';

import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';

import { PagesComponent } from './pages.component';




@NgModule({
  declarations: [    
    PagesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ComponentesModule,    
    PagesRoutingModule, 
      
  ]
})
export class PagesModule { }
