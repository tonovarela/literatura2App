import { CellModel, SpreadsheetComponent } from "@syncfusion/ej2-angular-spreadsheet";
//import { ModelError, Registro } from "../interfaces/models";
import { DateTime } from "luxon";
//import { solicitudKit } from "../interfaces/kit.interfaces";
import { ErrorMensaje } from "../modules/registro/kits/interfaces/kit.interface";
import { solicitudKit } from "../interfaces/shared/kit.interfaces";
//import { ErrorMensaje } from "../pages/home/kits/interfaces/kit.interface";


const obtenerValorColumna = (spreadsheetObj: SpreadsheetComponent, i: number, j: number) => {
    if (spreadsheetObj.getCell(i, 0) == undefined) {
        return "";
    }
    return spreadsheetObj.getCell(i, j).firstChild!.nodeValue?.valueOf();

}

export const MaxUsedRange = (spreadsheetObj: SpreadsheetComponent, numberSheet: number) => {
    return spreadsheetObj?.sheets[numberSheet].usedRange?.rowIndex;
}

export const mostrarMensaje = (spreadsheetObj: SpreadsheetComponent, mensaje: string, position: string, color = "black") => {
    const cell: CellModel = { style: {} };
    cell.value = mensaje;
    cell.style!.color = color;
    spreadsheetObj.updateCell(cell, position);
}

export const irPosicion = (spreadsheetObj: SpreadsheetComponent, position: string) => {
    return new Promise((resolve, reject) => {
        spreadsheetObj.goTo(position)
        setTimeout(() => {
            resolve(true);
        }, 1);
    })
}



export const  obtenerSolicitudKit =(spreadsheetObj: SpreadsheetComponent,i: number): solicitudKit | ErrorMensaje =>{
  let row: solicitudKit = {
    clave: obtenerValorColumna(spreadsheetObj, i, 1) || "",
    cantidad: Number(obtenerValorColumna(spreadsheetObj, i, 2)) 
  };  
  if (row.clave.length == 0 ){
    return { error: true, mensaje: "" }
  }
  if (row.clave.length > 0 && Number.isNaN(row.cantidad)  || row.cantidad<= 0   ) {
    return { error: true, mensaje: "Cantidad no válida" }
  }
  return row;
}



// export const  obtenerRegistro=(spreadsheetObj: SpreadsheetComponent,i: number): Registro | ModelError=> {
  
//     let row: Registro = {
//       index: i,
//       numOrden: Number(obtenerValorColumna(spreadsheetObj, i, 0)) ,
//       nomTrabajo: obtenerValorColumna(spreadsheetObj, i, 1) || "",
//       maquina: obtenerValorColumna(spreadsheetObj, i, 2) || "",
//       keyProceso: Number(obtenerValorColumna(spreadsheetObj, i, 3)) ,
//       proceso: obtenerValorColumna(spreadsheetObj, i, 4) || "",
//       clasificacion: obtenerValorColumna(spreadsheetObj, i, 5) || "",
//       fecProd: DateTime.fromFormat(obtenerValorColumna(spreadsheetObj, i, 6)!,'dd/MM/yyyy').toFormat('yyyy-MM-dd'),
//       tiempo: Number(obtenerValorColumna(spreadsheetObj, i, 7)) ,
//       cantidad: Number(obtenerValorColumna(spreadsheetObj, i, 8)),
//       numAjustes: Number(obtenerValorColumna(spreadsheetObj, i, 9)),
//       tipoOp: obtenerValorColumna(spreadsheetObj, i, 10) || "",
//       numEmpleado: Number(obtenerValorColumna(spreadsheetObj, i, 11) ),
//       turno: Number(obtenerValorColumna(spreadsheetObj, i, 12)),
//       keyDepartamento: obtenerValorColumna(spreadsheetObj, i, 13) || ""
//     };
//     return validarPropiedades(row,i);
//   }


//   const validarPropiedades = (row:Registro,i:number):Registro | ModelError=>{
//     let mapProperties = Reflect.ownKeys(row);
//     for (const index in mapProperties) {
//       const property = mapProperties[index];
//       if (property === 'index') {
//         continue;
//       }
//       const value = Reflect.get(row, property);

//       if (property == "numOrden" && value== 0) {
//         return { mensaje: "", position: "",requerido:false };
//       }      
//       const col = String.fromCharCode("A".charCodeAt(0) + Number(index) - 1);
//       const position = `${col}${i + 1}`;     
//       if (Number.isNaN(value)){
//         return { mensaje: `El campo ${property.toString()} debe ser númerico`, position,requerido:false };
//       }      
//       if (property == "fecProd" && value=="Invalid DateTime") {
//         return { mensaje: `El campo ${property.toString()} es invalido`, position ,requerido:false};
//       }
//       if (value.length == 0 || value == "*") {                
//         return { mensaje: `El campo ${property.toString()}  no puede estar vacío`, position,requerido:true };
//       }
//     }
//     return row;
//   }

  export const cambiarCamelUpperCase=(obj:any)=>{        
    const newObj = Object.fromEntries(    
      Object.entries(obj).map(([k, v]) => [`${k[0].toUpperCase()}${k.slice(1)}`, v])
    );
    return newObj;    
  }



 export const instanceOfModeError=(data: any): data is ErrorMensaje =>{
    return 'mensaje' in data;
  }



