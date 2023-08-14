export interface ResponseResiduosKit {
    residuos: Residuo[];
}

export interface Residuo {
    porEmpacar:   string;
    numpartprod: string;
    id_pde:      string;
    descripcionPDE: string;
    descripcionKit: string;
    seleccionado?:boolean;
}


export interface CajaEmpaque{
    id_pde?:string;
    seleccionado?:boolean;
    nombrePDE?:string;
    numpartprod?:string;
    descripcion?:string;
    totalPorCaja?:number;
    id?:string;
}

