export interface ResponseKit {
    success: boolean;
    kit:     Kit[];
}

export interface Kit {
    edicion:          string;
    clavekit:         string;
    clavekit2:        string;
    IDENTIFICA:       string;
    PLATAFORMA:       string;
    NUMPARTEPROD:     string;
    NUMPARTE:         string;
    PR:               string;
    INDICE:           string;
    Idioma:           string;
    CONT1:            string;
    CONT2:            string;
    VEHICULO:         string;
    tipo:             string;
    ETIQUETA:         string;
    totalComponentes: string;
    numeroComponente: string;
    sku1:             string;
    sku2:             string;
    descripcion:      string;
}


export interface solicitudKit {
    clave: string;
    cantidad: number;    

}


export interface ResponseRegistroKit{
    id: number;
    success: boolean;
    kit:     Kit[];

}



export interface ResponseKitDetalle {
    kit:     KitDetalle;
    success: boolean;
}

export interface KitDetalle {
    id_pde?:              string;
    id_kit?:              string;
    numparteprod?:        string;
    numparte?:            null;
    totalPorCaja?:        string;
    edicion?:             string;
    clavekit?:            string;
    clavekit2?:           string;
    identifica?:          string;
    plataforma?:          string;
    orden_compra?:        string;   
    pr?:                  string;
    indice?:              string;
    idioma?:              string;
    cont1?:               string;
    cont2?:               string;
    vehiculo?:            string;
    tipo?:                string;
    etiqueta?:            string;
    fecha_registro?:      null;
    fecha_actualizacion?: Date;
    detalle?:             CuadernoKit[];
}

export interface CuadernoKit {
    id_kit_cuaderno:     string;
    numparteprod:        string;
    sku1:                string;
    sku2:                null;
    descripcion:         string;
    clasificacion:       string;
    fecha_registro:      null;
    fecha_actualizacion: Date;
}
