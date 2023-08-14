import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './services/guards/usuario.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import(  /* webpackChunkName: "authModule" */  "./auth/auth.module").then(m => m.AuthModule),  },
  { path: 'pages', loadChildren: () => import( /* webpackChunkName: "pagesModule" */ "./pages/pages.module").then(m=>m.PagesModule), canActivate:[UsuarioGuard]},
  { path: '**', redirectTo: 'auth' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
