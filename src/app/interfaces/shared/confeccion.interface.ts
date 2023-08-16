export interface ConfeccionKitsGeneral {
    ok?:      boolean;
    resumen?: Resumen[];    
    //resumenAlternativo?:any,
    resumenGeneral?:ResumenParte[];
    pde?:any
}

export interface Resumen {
    total:       string;
    enRevision: number;
    totalCuadernos :string;
    
    reportados:  string;
    restantes:   string;
    numpartprod: string;
    enLote: number;
    sinLote: number;
    clavekit:    string;
    cont1:       string;
    cont2:       string;
}


export interface ResumenParte {
    total?:number;
    numpartprod?: string;
    descripcion?:string;
    totalPorCaja?:number;
    revisados?:number;
    totalCuadernos?:number;
    pendientes?:number;
    armados?:number;    
    porEmpacar?:number;
    empacados?:number
}

