export interface ResponseReporte {
    reporte: Reporte[];
}

export interface Reporte {
    tipoCarga?:            string;
    numpartprod?:          string;
    claveLitoprocess?:     string;
    cantidad?:             string;
    pallet?:               string;
    tarimas?:              string;
    orden_compra?:         string;
    totalCajas?:           string;
    numerosTarima?: string;    
}
