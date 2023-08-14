import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisionKitsGuard } from 'src/app/services/guards/revision-kits.guard';
import { PdeComponent } from './pages/pde/pde.component';
import { RevisionComponent } from './pages/revision/revision.component';


const routes: Routes = [{
  path: "",
  children:[
    {path:'pde',component:PdeComponent,data:{id_configuracion:2}, canActivate:[RevisionKitsGuard]},
    {path:'revision/:id_pde', component:RevisionComponent,data:{id_configuracion:2},canActivate:[RevisionKitsGuard]},
    {path:'**',redirectTo:"pde"}
  ]  
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConteoRoutingModule { }
