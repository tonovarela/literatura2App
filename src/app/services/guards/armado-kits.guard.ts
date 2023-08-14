import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ArmadoKitsGuard implements CanActivate {

  constructor(private usuarioService:UsuarioService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {      

      // if (this.usuarioService.Usuario.armadoKits!=="1"){
        
      // }
      // return true;
      return this.usuarioService.Usuario.armadoKits==="1";
    }
  
}
