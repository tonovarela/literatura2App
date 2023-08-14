

export interface ResponseKits {
  success?: false;
  kits?: KitRegistro[]
}


export interface ResponseDetalleKits {
  success?: false;
  kit?: KitRegistro;
  detalle?: CuadernoRegistro[]
}



export interface ErrorMensaje {
  error: boolean
  mensaje: string
}



export interface KitRegistro {
  id_kit?: string;
  numparteprod?: string;
  totalPorCaja?: number;
  totalCajasPorTarima?:number;
  numparte?: string;
  edicion?: string;
  clavekit?: string;
  clavekit2?: string;  
  identifica?: string;
  plataforma?: string;
  detalle?:any[];
  pr?: string;
  indice?:string;
  idioma?: string;
  cont1?: string;
  cont2?: string;
  vehiculo?: string;
  tipo?: string;
  etiqueta?: string;
  orden_compra?:string;
  //totalCuadernos?: number;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;

}
export interface CuadernoRegistro {
  id?: string;
  numparteprod?: string;
  sku1?: string;
  sku2?: string;
  descripcion?: string;
  clasificacion?: string;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}


