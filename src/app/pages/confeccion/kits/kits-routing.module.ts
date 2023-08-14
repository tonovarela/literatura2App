import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpaqueGuard } from 'src/app/services/guards/empaque.guard';
import { EntregaComponent } from './pages/entrega/entrega.component';
import { PdeComponent } from './pages/pde/pde.component';
import { ResumenComponent } from './pages/resumen/resumen.component';


const routes: Routes = [{
  path: '', children: [
    { path: 'pde', component: PdeComponent,data:{id_configuracion:3}, canActivate:[EmpaqueGuard] },
    { path: 'resumen/:id_pde', component: ResumenComponent,data:{id_configuracion:3} , canActivate:[EmpaqueGuard]},
    { path: 'entrega/:id_pde/:id_lote', component: EntregaComponent ,data:{id_configuracion:3},canActivate:[EmpaqueGuard]},    
    { path: '**', redirectTo: 'pde' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitsRoutingModule { }
