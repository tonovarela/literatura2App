import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configuracion, KitActivo } from '../modules/confeccion/conteo/interfaces/conteo.interfaces';




@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  URL: string = environment.URL;
  //watcherSkuActivo= new Subject();
  pausarSeleccion: Configuracion = { habilitada: false, id_configuracion: 0, descripcion: '' };
  kitActivo:KitActivo= {numpartprod:'',terminoArmado:false, terminoRevision:false};  
  configuraciones: any[] = [];
  puedeCambiarPDE: boolean = false;


  constructor(private http: HttpClient) { }


  listar() {
    return this.http.get(`${this.URL}/api/configuracion`);
  }

  cargarKitActivo(){
    const {descripcion}  = this.configuraciones.find(c=>c["id_configuracion"]==4);      
      if (descripcion!=undefined){
        this.kitActivo= JSON.parse(descripcion);        
      }
  }

  cargarConfiguraciones() {
    this.listar().subscribe(response => {      
      this.configuraciones = response["configuraciones"];            
      this.cargarKitActivo(); 
      const configuracion = this.configuraciones.filter(c => c["id_configuracion"] == this.pausarSeleccion.id_configuracion);
      if (configuracion.length > 0) {
        const c = configuracion[0];
        this.pausarSeleccion = { descripcion: c["descripcion"], id_configuracion: Number(c["id_configuracion"]), habilitada: c["habilitada"] == "1" };
      }  
      
      this.puedeCambiarPDE = !this.kitActivo.terminoArmado || !this.kitActivo.terminoRevision;      
    });

    
  }

  actualizar() {  
    this.pausarSeleccion.habilitada = !this.pausarSeleccion.habilitada;
    return this.http.patch(`${this.URL}/api/configuracion`, { configuracion: this.pausarSeleccion });
  }

   


  iniciarArmado(numpartprod){             
    this.kitActivo = { numpartprod,terminoArmado:true, terminoRevision:false}        
    return this.actualizarKitActivo();    
  }

  terminarArmado(){
    this.kitActivo.terminoArmado=true;    
    if (this.kitActivo.terminoArmado && this.kitActivo.terminoRevision){
      this.kitActivo.numpartprod="";
    }
    return this.actualizarKitActivo();    
  }

  terminoRevision(){
    this.kitActivo.terminoRevision=true;
    if (this.kitActivo.terminoArmado && this.kitActivo.terminoRevision){
      this.kitActivo.numpartprod="";
    }
    return this.actualizarKitActivo();
  }

  private actualizarKitActivo(){      
    const descripcion = JSON.stringify(this.kitActivo);    
    const configuracion:Configuracion = {id_configuracion:4, descripcion, habilitada:true};
     //this.watcherSkuActivo.next(true);
     return this.http.patch(`${this.URL}/api/configuracion`, { configuracion })
   }







}
