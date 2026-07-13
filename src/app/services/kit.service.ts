

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ResponseResiduosKit } from '../modules/confeccion/kits/pages/interface/interfaces';
import { ResponseKitDetalle } from '../interfaces/shared/kit.interfaces';
import { environment } from 'src/environments/environment.development';

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


