import { PagesComponent } from './pages.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  // {
  //   path: 'calidad', component: PagesComponent,
  //   children: [{ path: "", loadChildren: () => import( /* webpackChunkName: "calidadModule" */ "./calidad/calidad.module").then(m => m.CalidadModule) }]
  // },
   {
    path: 'confeccion', component: PagesComponent,
    children: [{ path: "", loadChildren: () => import(/* webpackChunkName: "confeccionModule" */ "./confeccion/confeccion.module").then(m => m.ConfeccionModule) }]
  },
  {
    path: '', component: PagesComponent,
    children: [{ path: "", loadChildren: () => import(/* webpackChunkName: "homeModule" */ "./home/home.module").then(m => m.HomeModule) }],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
