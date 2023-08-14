export interface ResponseCuaderno {

    success?: boolean;
    cuadernos?: Cuaderno[]
}


export interface Cuaderno {

    sku1?:string;
    sku2?:string;
    descripcion?:string;    
}