import { environment } from './../../environments/environment';
import { ResponseKit, ResponseKitDetalle, ResponseRegistroKit, solicitudKit } from './../interfaces/kit.interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ResponseResiduosKit } from '../pages/confeccion/kits/pages/interface/interfaces';


@Injectable({
  providedIn: 'root'
})
export class KitService {


  private URL = environment.URL;
  constructor(private http: HttpClient) { }

  obtenerDetalle(clave: string) {
    return this.http.get<ResponseKitDetalle>(`${this.URL}/api/kit/obtener/${clave}`);
  }
  obtenerDetalleSolicitudes(solicitudes: any[]) {
    return from(solicitudes).pipe(      
      concatMap(({ id, kit }) => this.obtenerDetalle(kit['clave'])      
        .pipe(map(x => {
          return {
            kit: x["kit"] || [],
            success: x["success"],
            mensaje: x["mensaje"] || '',
            id,
            kitSolicitud:kit
          }
        })
        )
      )
    );
  }

  obtenerResiduos(id_pde){
    return this.http.get<ResponseResiduosKit>(`${this.URL}/api/kit/obtenerResiduos/${id_pde}`);
  }




}


