
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cuaderno, ResponseCuaderno } from '../modules/registro/cuadernos/interface/cuaderno.interface';


@Injectable({
  providedIn: 'root'
})
export class CuadernoService {
private URL = environment.URL;
  constructor(private http: HttpClient) { }

  listar(){
    return this.http.get<ResponseCuaderno>(`${this.URL}/api/cuaderno/listar`);
  }

  obtener(sku){
    return this.http.get<ResponseCuaderno>(`${this.URL}/api/cuaderno/obtener/${sku}`);

  }
  obtenerParecido(sku){
    return this.http.get<ResponseCuaderno>(`${this.URL}/api/cuaderno/obtenerparecido/${sku}`);

  }


  actualizar(cuaderno:Cuaderno){
   return this.http.post(`${this.URL}/api/cuaderno/actualizar`,{cuaderno})
  }
}
