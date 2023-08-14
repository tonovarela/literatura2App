import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { ResponseDetalleKits, ResponseKits } from '../interfaces/kit.interface';

@Injectable({
  providedIn: 'root'
})
export class KitService {


   private URL= environment.URL;
  constructor(private http: HttpClient) { }



   public listar(){
     return this.http.get<ResponseKits>(`${this.URL}/api/kit/obtener`);
   }


   public obtener(numPartProd){
     return this.http.get<ResponseDetalleKits>(`${this.URL}/api/kit/obtener/${numPartProd}`);
   }

   public obtenerPorID(id){     
    return this.http.get<ResponseDetalleKits>(`${this.URL}/api/kit/obtenerporID/${id}`);
  }



   public actualizar(kit){
    return this.http.post(`${this.URL}/api/kit/actualizar`,{kit});
   }



   public procesarKit(registros){
    return from(registros).pipe(      
      //concatMap(({ id, registro }) => this.http.post(`http://localhost:3000/Respuesta`,{ ...registro })
      concatMap(({ id, registro, tipo }) => this.http.post(`${this.URL}/api/kit/registrar`,{registro})
        .pipe(map(x => {
          return {
            mensaje: x["mensaje"] || "Kit dado de alta",
            id,
            registro,
            success:  x["success"] || false,
            tipo
          }
        }),
          catchError(e => {
            return of({
              mensaje: e.error.mensaje || 'Error en el sevidor',
              id,
              registro,
              success: false,
              tipo

            })
          })
        )
      )
    );

   }


   public procesarKitDetalle(registros){
    return from(registros).pipe(
      concatMap(({ id, registro,tipo }) => this.http.post(`${this.URL}/api/kit/registrarDetalle`, {registro})
        .pipe(map(x => {
          return {
            mensaje: x["mensaje"],
            id,
            registro,
            success: x["success"] || false,
            tipo
          }
        }),
          catchError(e => {
            return of({
              mensaje: e.error.mensaje ||'Error en el sevidor',
              id,
              registro,
              success: false,
              tipo
            })
          })
        )
      )
    );

   }

}
