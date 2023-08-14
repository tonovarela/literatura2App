import { ComponentesModule } from './../../componentes/componentes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    InicioComponent, HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,    
    ComponentesModule,    
    
  ]
})
export class HomeModule { }
