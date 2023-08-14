
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ContadorComponent } from './contador/contador.component';
import { ErrorIndicadorDirective } from './directives/error-indicador.directive';

@NgModule({
  declarations: [
    FooterComponent,
    SidenavComponent,
    TopbarComponent,    
    ContadorComponent, ErrorIndicadorDirective, 
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[FooterComponent,
    SidenavComponent,
    TopbarComponent,
    ErrorIndicadorDirective,
    ContadorComponent
    
  ]
})
export class SharedModule { }
