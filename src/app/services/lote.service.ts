import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class LoteService {
  URL: string = environment.URL;
  constructor(public http: HttpClient) { }

  public obtenerDetalleLote(id_pde, id_lote) {

    return this.http.get(`${this.URL}/api/lote/obtenerDetalle/${id_pde}/${id_lote}`);
  }

  public registrarDistribucion(id_lote, distribucion) {

    return this.http.post(`${this.URL}/api/lote/registrarDistribucion`,
      { id_lote, distribucion });
  }


  public obtenerPDES(id_lote) {
    return this.http.get(`${this.URL}/api/lote/obtenerPDES/${id_lote}`);
  }

  public registrar(id_pde, cajas, kitOtrosPDE) {

    return this.http.post(`${this.URL}/api/lote/registrar`,
      {
        id_pde,
        cajas,
        kitOtrosPDE
      });
  }


  public actualizarDistribucion(id_lote, distribucion) {

    return this.http.patch(`${this.URL}/api/lote/actualizarDistribucion`,
      { id_lote, distribucion: distribucion });
  }


  public obtenerDistribucion(id_lote) {

    return this.http.get(`${this.URL}/api/lote/obtenerDistribucion/${id_lote}`);
  }


  public eliminarCaja(cancelacionCaja) {
    return this.http.patch(`${this.URL}/api/confeccion/eliminarCaja`, { cancelacionCaja })

  }

  public eliminarTarimaDistribucion(cancelacionTarima) {
    return this.http.post(`${this.URL}/api/confeccion/eliminarTarimaDistribucion`, { cancelacionTarima });
  }

  public actualizar(lote) {
    return this.http.patch(`${this.URL}/api/lote`,{ lote});
  }


  public listarCalidad(realizados){    
    return this.http.get(`${this.URL}/api/lote/calidad?realizados=${realizados}`);

  }

  



}
