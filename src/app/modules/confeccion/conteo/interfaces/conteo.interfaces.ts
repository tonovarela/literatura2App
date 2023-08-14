//import {  ResumenParte } from "src/app/interfaces/confeccion.interface";

import { ResumenParte } from "src/app/interfaces/shared/confeccion.interface";




export interface ResponseRevision {
    revisiones?: Revision[];
    resumenAlternativo:any;
    resumenGeneral?:ResumenParte[];
    ok:boolean
}

export interface Revision {
    total:number;
    disponibles: string;
    revisados:   string;
    descripcion: string;
    numpartprod: string;
    id_pde:      string;
    totalPorCaja:number;
    totalCuadernos:number;
}

export interface Configuracion {
    id_configuracion:Number;
    descripcion:string;
    habilitada: boolean;
  }


 export interface KitActivo {
     numpartprod?:string;
     terminoArmado?:boolean;
     terminoRevision?:boolean;
 } 


 export interface ResponsePreEtiqueta {
    ok:   boolean;
    caja: Caja;
    resumenTotal: ResumenTotal[];
}


export interface ResumenTotal {
    totalCajas: string;
    id_tarima:  string;
}

export interface Caja {
    id_caja:      string;
    numpartprod:  string;
    id_pde:       string;
    id_tarima:    string;
    numeroCaja:   string;
    numeroTarima: string;
    impreso:      null;
}


  
