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


  


  public revisionesKit(id_pde: string,numpartprodActivo:string) {
    return this.http.get<ResponseRevisionAlt>(`${this.URL}/api/confeccion/obtenerRevisionesAlt/${id_pde}?numpartprodActivo=${numpartprodActivo}`).pipe(
      map(response=>{        
        //Se hizo esta conversion dado que la base de datos tardaba hasta 4 segundos en dar el resultado        
        const responseRevision:ResponseRevision ={
          ok:response.ok,          
          resumenGeneral:response.resumenGeneral.map(r=>{                        
            const resumenParte:ResumenParte ={              
            total:Number(r.total),
            descripcion:r.descripcion,
            totalPorCaja:Number(r.totalPorCaja),
            totalCuadernos:Number(r.totalCuadernos),
            numpartprod:r.numpartprod,
            armados:Number(r.armados),
            revisados:Number(r.revisados),
            empacados:Number(r.empacados),
            pendientes:Number(r.pendientes),
            porEmpacar:Number(r.porEmpacar)            
            };            
            return resumenParte
          }),          
        }        
        return responseRevision;
      })
    )
  }

  public registrarRevisionKit(id_pde: string, numpartprod: string,armados:number) {
    return this.http.post(`${this.URL}/api/confeccion/registrarRevisionKit`, { id_pde, numpartprod ,armados});
  }



  public obtenerPendientesGeneral(){
    return this.http.get(`${this.URL}/api/confeccion/obtenerPendientesGeneral`);
  }


  public obtenerReporte(id_pde){
    return this.http.get<ResponseReporte>(`${this.URL}/api/confeccion/reporte/${id_pde}`);
  }


 










}
