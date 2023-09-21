import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResponsePreEtiqueta } from '../modules/confeccion/conteo/interfaces/conteo.interfaces';
import { environment } from 'src/environments/environment.development';
//import { ResponsePreEtiqueta } from '../pages/confeccion/conteo/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class CajaService {

  URL: string = environment.URL;
  constructor(private http:HttpClient) { }


  public  obtenerPreEtiqueta(id_pde:string,numpartprod:string){
      return this.http.get<ResponsePreEtiqueta>(`${this.URL}/api/caja/preEtiqueta/${id_pde}/${numpartprod}`);
  }
}
