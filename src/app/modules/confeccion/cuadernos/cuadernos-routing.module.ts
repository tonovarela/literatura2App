import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArmadoKitsGuard } from 'src/app/services/guards/armado-kits.guard';

import { LoteComponent } from './pages/lote/lote.component';
import { PdeComponent } from './pages/pde/pde.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { RevisionComponent } from './pages/revision/revision.component';

const routes: Routes = [{
  path: '', children: [
    { path: 'pde', component: PdeComponent, data: { id_configuracion: 1 }, canActivate: [ArmadoKitsGuard]},
    { path: 'resumen/:id_pde', component: ResumenComponent, data: { id_configuracion: 1 }, canActivate: [ArmadoKitsGuard] },
    { path: 'revision/:id_pde/:numpartprod', component: RevisionComponent, data: { id_configuracion: 1 }, canActivate: [ArmadoKitsGuard] },
    { path: 'lote/:id_pde/:id_lote', component: LoteComponent, data: { id_configuracion: 1 }, canActivate: [ArmadoKitsGuard] },
    { path: '**', redirectTo: 'pde' }
  ]
}];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadernosRoutingModule { }
