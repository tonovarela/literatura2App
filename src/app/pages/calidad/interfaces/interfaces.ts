export  interface NivelInspeccion {
    label:string;
    tamanioMuestra: number;
   // muestras?:Muestra[];
  }
  
 export interface StackKits {
    colorHexadecimal?:string;
    id_tarima: string;
    tipo: string;
    nombreTarima: string;
    id_caja: string;
    totalKits: number;
    aceptados?:number,
    rechazados?:number,
    dataMatrixCode?:string,    
    comentarios?:string;
    numeroCaja:number;
    nombreCaja: string;        
    activo?:boolean
    
  }


  export interface SeleccionSugerida{
    stackKits:StackKits[],
    
    nivelDeInspeccion?:number,

  }


  //  export interface Muestra {
  //   tamanioMuestra:Number,
  //   nombreCaja:string;
  //   totalKits:number;
  //   stackKits:StackKits[];
    
    
  //  }
