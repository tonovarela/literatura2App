import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ResponseRevisionAlt } from '../modules/confeccion/conteo/interfaces/conteo.revision';
import { ResponseRevision } from '../modules/confeccion/conteo/interfaces/conteo.interfaces';
import { ConfeccionKitsGeneral, ResumenParte } from '../interfaces/shared/confeccion.interface';
import { ResponseReporte } from '../interfaces/shared/reporte.interface';



@Injectable({
  providedIn: 'root'
})
export class ConfeccionService {

  URL: string = environment.URL;
  constructor(private http: HttpClient) { }


  public resumenKitsGeneral(id_pde: string) {
    return this.http.get<ConfeccionKitsGeneral>(`${this.URL}/api/confeccion/resumenKitsGeneral/${id_pde}`)
  }


  public resumenKitsRevisados(id_pde: string) {
    return this.http.get<ConfeccionKitsGeneral>(`${this.URL}/api/confeccion/resumenKitsRevisados/${id_pde}`)
  }

  public resumenKit(id_pde: string, numpartprod: string) {
    return this.http.get<ConfeccionKitsGeneral>(`${this.URL}/api/confeccion/resumenKit/${id_pde}/${numpartprod}`)
  }

  public verificarKit(id_pde: string, numpartprod: string) {
    return this.http.post(`${this.URL}/api/confeccion/verificarKit`, { kit: { id_pde, numpartprod } })
  }


  


  public revisionesKit(id_pde: string) {
    return this.http.get<ResponseRevisionAlt>(`${this.URL}/api/confeccion/obtenerRevisionesAlt/${id_pde}`).pipe(
      map(response=>{
        //Se hizo esta conversion dado que la base de datos tardaba hasta 4 segundos en dar el resultado
        const responseRevision:ResponseRevision ={
          ok:response.ok,
          resumenAlternativo:response.resumenAlternativo,
          revisiones:response.revisiones,
          resumenGeneral:response.resumenGeneral.map(r=>{            
            const empacados= response.enLote.find(x=>x.numpartprod==r.numpartprod)?.enLote || 0;           
            const porEmpacar=response.sinLote.find(x=>x.numpartprod==r.numpartprod)?.sinLote || 0;
            const revisionKit = response.revisionKit.find(x=>x.numpartprod==r.numpartprod)?.revisionKit || 0;
            let armados =   response.armados.find(x=>x.numpartprod==r.numpartprod)?.armados || 0;
            const pendientes=Number(r.total) - (armados-revisionKit)- empacados- porEmpacar  ;
            armados=armados-revisionKit;                     
            const resumenParte:ResumenParte ={              
            total:Number(r.total),
            descripcion:r.descripcion,
            totalPorCaja:Number(r.totalPorCaja),
            totalCuadernos:Number(r.totalCuadernos),
            numpartprod:r.numpartprod,
            armados,
            empacados,
            pendientes,
            porEmpacar      
            }
            return resumenParte
          }),          
        }
        return responseRevision;
      })
    )
  }

  public registrarRevisionKit(id_pde: string, numpartprod: string) {
    return this.http.post(`${this.URL}/api/confeccion/registrarRevisionKit`, { id_pde, numpartprod });
  }



  public obtenerPendientesGeneral(){
    return this.http.get(`${this.URL}/api/confeccion/obtenerPendientesGeneral`);
  }


  public obtenerReporte(id_pde){
    return this.http.get<ResponseReporte>(`${this.URL}/api/confeccion/reporte/${id_pde}`);
  }


 










}
