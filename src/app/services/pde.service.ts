import { environment } from './../../environments/environment';
import { SolicitudCuaderno } from 'src/app/interfaces/solicitudCuaderno';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdeService {
  URL: string = environment.URL;
  constructor(public http: HttpClient) {
  }
  public listar(cancelados=true) {
    return this.http.get(`${this.URL}/api/pde?cancelados=${cancelados}`);
  }

  

  public listarPendientes(){
    return this.http.get(`${this.URL}/api/pde/listarPendientes`);
  }
  public obtener(id: string) {
    return this.http.get(`${this.URL}/api/pde/obtener/${id}`);
  }
  public registrarSolicitudAlmacen(solicitudes: SolicitudCuaderno[], pdeInfo: any) {    
    return this.http.post(`${this.URL}/api/pde/registrarAlmacen`, { solicitudes, pdeInfo });
  }
  public registrar(tarimas: any[], resumenConfeccion: any[], pdeInfo: any) {

    return this.http.post(`${this.URL}/api/pde/registrar`,
      {
        tarimas: JSON.stringify(tarimas),
        resumenConfeccion: JSON.stringify(resumenConfeccion),
        pdeInfo,        
      });
  }
  public actualizar(pdeInfo: any) {
    return this.http.patch(`${this.URL}/api/pde/actualizar`, { pdeInfo })
  }

  public obtenerLotes(id_pde) {
    return this.http.get(`${this.URL}/api/pde/obtenerLotes/${id_pde}`);
  }


  public obtenerTarimas(id_pde){
    return this.http.get(`${this.URL}/api/pde/obtenerTarimas/${id_pde}`);
  }

  

}
