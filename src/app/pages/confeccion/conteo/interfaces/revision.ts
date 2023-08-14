import { Revision } from "./interfaces";

export interface ResponseRevisionAlt {
    ok:                 boolean;
    resumenAlternativo: any[];
    armados:            Armado[];
    revisionKit:        RevisionKit[];

    enLote:             EnLote[];
    sinLote:            SinLote[];
    resumenGeneral:     ResumenGeneral[];
    revisiones:         Revision[];
}

export interface Armado {
    armados:     number;
    id_pde:      string;
    numpartprod: string;
}

export interface EnLote {
    enLote:      number;
    id_pde:      string;
    numpartprod: string;
}





export interface ResumenGeneral {
    id_pde:         string;
    descripcionPDE: string;
    numpartprod:    string;
    totalPorCaja:   string;
    descripcion:    string;
    totalCuadernos: string;
    total:          string;
}


export interface RevisionKit {
    revisionKit: number;
    numpartprod: string;
    id_pde:      string;
}







export interface SinLote {
    sinLote:     number;
    id_pde:      string;
    numpartprod: string;
}
