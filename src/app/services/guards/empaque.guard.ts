import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EmpaqueGuard implements CanActivate {
  
  constructor(private usuarioService:UsuarioService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {            
      return this.usuarioService.Usuario.empaque==="1";
    }
  
}
