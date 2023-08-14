import { HomeComponent } from './home.component';
import { InicioComponent } from './inicio/inicio.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'pde', loadChildren: () => import("./pde/pde.module").then(m => m.PdeModule) },
      { path: 'kits', loadChildren: () => import("./kits/kits.module").then(m => m.KitsModule) },
      { path: 'cuadernos', loadChildren: () => import("./cuadernos/cuadernos.module").then(m => m.CuadernosModule) },      
      { path: '**', redirectTo: "pde" },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
