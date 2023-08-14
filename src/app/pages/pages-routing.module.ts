import { PagesComponent } from './pages.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'calidad', component: PagesComponent,
    children: [{ path: "", loadChildren: () => import( /* webpackChunkName: "calidadModule" */ "../modules/calidad/calidad.module").then(m => m.CalidadModule) }]
  },
  {
    path: 'confeccion', component: PagesComponent, children: [
      { path: 'kits', loadChildren: () => import(/* webpackChunkName: "kitsConfeccion" */ "../modules/confeccion/kits/kits.module").then(m => m.KitsModule), },
      { path: 'conteo', loadChildren: () => import(/* webpackChunkName: "conteoConfeccion" */ "../modules/confeccion/conteo/conteo.module").then(m => m.ConteoModule) },
      { path: 'cuadernos', loadChildren: () => import(/* webpackChunkName: "cuadernosConfeccion" */ "../modules/confeccion/cuadernos/cuadernos.module").then(m => m.CuadernosModule) },
      { path: '**', redirectTo: "cuadernos" },
    ]
  },
  {
    path: '', component: PagesComponent, children: [

      { path: 'pde', loadChildren: () => import(/* webpackChunkName: "PDERegistro" */ "../modules/registro/pde/pde.module").then(m => m.PdeModule) },
      { path: 'kits', loadChildren: () => import(/* webpackChunkName: "kitsRegistro" */ "../modules/registro/kits/kits.module").then(m => m.KitsModule) },
      { path: 'cuadernos', loadChildren: () => import(/* webpackChunkName: "cuadernosRegistro" */ "../modules/registro/cuadernos/cuadernos.module").then(m => m.CuadernosModule) },
      { path: '**', redirectTo: "pde" },
    ]
  },
  { path: '**', redirectTo: '' },
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
