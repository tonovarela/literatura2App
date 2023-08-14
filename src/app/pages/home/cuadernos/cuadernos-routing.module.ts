import { DetalleComponent } from './../cuadernos/pages/detalle/detalle.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './pages/listar/listar.component';

const routes: Routes = [{
  path: '', children: [
    { path: 'listado', component: ListarComponent },
    { path: 'detalle/:sku', component: DetalleComponent },
    { path: '**', redirectTo: 'listado' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadernosRoutingModule { }
