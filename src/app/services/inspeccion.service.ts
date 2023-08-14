import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeleccionSugerida } from '../modules/calidad/interfaces/interfaces';
import { TamanioMuesta } from '../modules/calidad/utils/calidad';


@Injectable({
  providedIn: 'root'
})
export class InspeccionService {
   URL = environment.URL;
  constructor(private http:HttpClient) { }
   

  public obtenerPorLote( id_lote:number){
    return this.http.get(`${this.URL}/api/inspeccion/inspeccion/${id_lote}`);
  }


  public guardar(id_lote:number,seleccionSugerida:SeleccionSugerida, tamanioMuestras:TamanioMuesta[], nombreUsuario) {
    return this.http.post(`${this.URL}/api/inspeccion/guardar`, { id_lote,seleccionSugerida, tamanioMuestras,nombreUsuario})
  }
}
