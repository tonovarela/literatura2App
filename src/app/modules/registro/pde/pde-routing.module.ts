

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarComponent } from './pages/agregar/agregar.component';
import { ListarComponent } from './pages/listar/listar.component';
import { DetalleComponent } from './pages/detalle/detalle.component';


const routes: Routes = [{
  path: '',  children: [
    { path: "inicio", component: ListarComponent,  },
    { path:"agregar", component:AgregarComponent},    
    { path:"detalle/:id", component:DetalleComponent},    
    { path: '**', redirectTo: 'inicio' }
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdeRoutingModule { }
