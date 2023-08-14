import { ListarComponent } from './pages/listar/listar.component';
//import { KitsComponent } from './kits.component';
import { DetalleComponent } from './pages/detalle/detalle.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KitsGuard } from 'src/app/services/guards/kits.guard';
import { CargaBatchGuard } from 'src/app/services/guards/carga-batch.guard';


const routes: Routes = [{
  path: '',  children: [
    { path: "inicio", component: ListarComponent , canActivate:[KitsGuard]},
    { path: "registrar", component: RegistrarComponent, canActivate:[CargaBatchGuard] },
    { path: "detalle/:id_kit", component: DetalleComponent ,canActivate:[KitsGuard]},
    { path: '**', redirectTo: 'inicio' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitsRoutingModule { }
