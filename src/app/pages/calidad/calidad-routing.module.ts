import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConInspeccionComponent } from './pages/con-inspeccion/con-inspeccion.component';
import { EntregaComponent } from './pages/entrega/entrega.component';
import { InspeccionComponent } from './pages/inspeccion/inspeccion.component';
import { SinInspeccionComponent } from './pages/sin-inspeccion/sin-inspeccion.component';

const routes: Routes = [{
  path: '', children: [    
    { path: 'sin-inspeccion', component: SinInspeccionComponent },
    { path: 'con-inspeccion', component: ConInspeccionComponent },
    //{ path: 'entrega/:id_pde', component: EntregaComponent },
    { path: 'inspeccion/:id_pde/:id_lote', component: InspeccionComponent },    
    { path: '**', redirectTo: 'sin-inspeccion' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalidadRoutingModule { }
