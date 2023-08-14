import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfeccionComponent } from './confeccion.component';

const routes: Routes = [{
  path: "", component: ConfeccionComponent,
  children: [
    { path: 'kits', loadChildren: () => import(/* webpackChunkName: "kits" */ "./kits/kits.module").then(m => m.KitsModule), },
    { path: 'conteo', loadChildren: () => import(/* webpackChunkName: "conteo" */ "./conteo/conteo.module").then(m => m.ConteoModule) },
    { path: 'cuadernos', loadChildren: () => import(/* webpackChunkName: "cuadernos" */ "./cuadernos/cuadernos.module").then(m => m.CuadernosModule) },
    { path: '**', redirectTo: "cuadernos" },],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfeccionRoutingModule { }
