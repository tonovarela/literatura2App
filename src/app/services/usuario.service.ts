import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/shared/usuario.interface';
//import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _usuario: Usuario;
  private URL = environment.URL

  constructor(private http: HttpClient,
              private router:Router
    ) {
      this.leerStorage();
     }

  leerStorage(){
    if (localStorage.getItem("usuarioLiteratura")!=undefined){
      this._usuario= JSON.parse(localStorage.getItem("usuarioLiteratura"));
    }
  }


  get Usuario(){
    return this._usuario;
  }

  guardarStorage(usuario:Usuario){
   localStorage.setItem("usuarioLiteratura",JSON.stringify(usuario));
  }

  logout(){
    this._usuario=undefined;
    localStorage.removeItem("User");
    localStorage.removeItem("Pass");
    localStorage.removeItem("usuarioLiteratura");
    sessionStorage.clear();
    this.router.navigateByUrl("/auth/login");
  }

  login(usuario:Usuario){
    return this.http.post(`${this.URL}/api/usuario/login`,{ usuario})
                    .pipe(
                      tap(response=>{                                              
                        if (response["success"]){                          
                          this._usuario= response["data"];                                                  
                          this.guardarStorage(this._usuario);
                        }                        
                      })
                    );
  }






}
