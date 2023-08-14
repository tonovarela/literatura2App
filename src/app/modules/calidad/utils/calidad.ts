import { mdColors } from "src/app/interfaces/shared/colors";
import { groupBy } from "src/app/utils/utils";
import { SeleccionSugerida, StackKits } from "../interfaces/interfaces";


export interface LoteInspeccion {
  minTamanio?: Number;
  maxTamanio?: Number;
  inspeccion?: Inspeccion[];

}
export interface Inspeccion {
  nivel?: Number;
  letrasClave?: String;
}
export interface TamanioMuesta {
  letra?: String;
  tamanioMuestra?: number;
  nombreCaja?: string;
  totalKits?:number,
  toleranciaRechazados?: number,
  toleranciaAceptados?: number,
  aceptadosInspeccion?:number,
  rechazadosInspeccion?:number,
  colorHexadecimal?:string,
}


// function random_hex_color_code()  {
//   let n = (Math.random() * 0xfffff * 1000000).toString(16);
//   return '#' + n.slice(0, 6);
// };

//Retorna tamano de la muestra recomendada
export function obtenerNivelInspeccion(totalKits: number, nivelInspeccion: number): TamanioMuesta {
  if (totalKits > 10000000) {
    return { letra: "Q", tamanioMuestra: 1250, toleranciaAceptados: 21, toleranciaRechazados: 22 };
  }
  let lotesInpeccion: LoteInspeccion[] = [
    { minTamanio: 1, maxTamanio: 8, inspeccion: [{ nivel: 1, letrasClave: "A" }, { nivel: 2, letrasClave: "A" }, { nivel: 3, letrasClave: "B" }] },
    { minTamanio: 9, maxTamanio: 15, inspeccion: [{ nivel: 1, letrasClave: "A" }, { nivel: 2, letrasClave: "B" }, { nivel: 3, letrasClave: "C" }] },
    { minTamanio: 16, maxTamanio: 25, inspeccion: [{ nivel: 1, letrasClave: "B" }, { nivel: 2, letrasClave: "C" }, { nivel: 3, letrasClave: "D" }] },
    { minTamanio: 26, maxTamanio: 50, inspeccion: [{ nivel: 1, letrasClave: "C" }, { nivel: 2, letrasClave: "D" }, { nivel: 3, letrasClave: "E" }] },
    { minTamanio: 51, maxTamanio: 90, inspeccion: [{ nivel: 1, letrasClave: "C" }, { nivel: 2, letrasClave: "E" }, { nivel: 3, letrasClave: "F" }] },
    { minTamanio: 91, maxTamanio: 150, inspeccion: [{ nivel: 1, letrasClave: "D" }, { nivel: 2, letrasClave: "F" }, { nivel: 3, letrasClave: "G" }] },
    { minTamanio: 151, maxTamanio: 280, inspeccion: [{ nivel: 1, letrasClave: "E" }, { nivel: 2, letrasClave: "G" }, { nivel: 3, letrasClave: "H" }] },
    { minTamanio: 281, maxTamanio: 500, inspeccion: [{ nivel: 1, letrasClave: "F" }, { nivel: 2, letrasClave: "H" }, { nivel: 3, letrasClave: "J" }] },
    { minTamanio: 501, maxTamanio: 1200, inspeccion: [{ nivel: 1, letrasClave: "G" }, { nivel: 2, letrasClave: "J" }, { nivel: 3, letrasClave: "K" }] },
    { minTamanio: 1201, maxTamanio: 3200, inspeccion: [{ nivel: 1, letrasClave: "H" }, { nivel: 2, letrasClave: "K" }, { nivel: 3, letrasClave: "L" }] },
    { minTamanio: 3201, maxTamanio: 10000, inspeccion: [{ nivel: 1, letrasClave: "J" }, { nivel: 2, letrasClave: "L" }, { nivel: 3, letrasClave: "M" }] },
    { minTamanio: 10001, maxTamanio: 35000, inspeccion: [{ nivel: 1, letrasClave: "K" }, { nivel: 2, letrasClave: "M" }, { nivel: 3, letrasClave: "N" }] },
    { minTamanio: 35001, maxTamanio: 150000, inspeccion: [{ nivel: 1, letrasClave: "L" }, { nivel: 2, letrasClave: "N" }, { nivel: 3, letrasClave: "P" }] },
    { minTamanio: 150001, maxTamanio: 500000, inspeccion: [{ nivel: 1, letrasClave: "N" }, { nivel: 2, letrasClave: "P" }, { nivel: 3, letrasClave: "Q" }] },
    { minTamanio: 500001, maxTamanio: 10000000, inspeccion: [{ nivel: 1, letrasClave: "N" }, { nivel: 2, letrasClave: "Q" }, { nivel: 3, letrasClave: "R" }] },
  ];
  let tamanioMuestras: TamanioMuesta[] = [
    { letra: "A", tamanioMuestra: 2, toleranciaRechazados: 1, toleranciaAceptados: 0 },
    { letra: "B", tamanioMuestra: 3, toleranciaRechazados: 1, toleranciaAceptados: 0 },
    { letra: "C", tamanioMuestra: 5, toleranciaRechazados: 1, toleranciaAceptados: 0 },
    { letra: "D", tamanioMuestra: 8, toleranciaRechazados: 2, toleranciaAceptados: 1 },
    { letra: "E", tamanioMuestra: 13, toleranciaRechazados: 2, toleranciaAceptados: 1 },
    { letra: "F", tamanioMuestra: 20, toleranciaRechazados: 3, toleranciaAceptados: 2 },
    { letra: "G", tamanioMuestra: 32, toleranciaRechazados: 4, toleranciaAceptados: 3 },
    { letra: "H", tamanioMuestra: 50, toleranciaRechazados: 6, toleranciaAceptados: 5 },
    { letra: "J", tamanioMuestra: 80, toleranciaRechazados: 8, toleranciaAceptados: 7 },
    { letra: "K", tamanioMuestra: 125, toleranciaRechazados: 11, toleranciaAceptados: 10 },
    { letra: "L", tamanioMuestra: 200, toleranciaRechazados: 15, toleranciaAceptados: 14 },
    { letra: "M", tamanioMuestra: 315, toleranciaRechazados: 22, toleranciaAceptados: 21 },
    { letra: "N", tamanioMuestra: 500, toleranciaRechazados: 22, toleranciaAceptados: 21 },
    { letra: "P", tamanioMuestra: 800, toleranciaRechazados: 22, toleranciaAceptados: 21 },
    { letra: "Q", tamanioMuestra: 1250, toleranciaRechazados: 22, toleranciaAceptados: 21 },
  ];  
  const [_loteInspeccionSugerido] = lotesInpeccion.filter(lote => isBetween(totalKits, lote.minTamanio, lote.maxTamanio));
  const [_letraInpeccionSugerido] = _loteInspeccionSugerido.inspeccion.filter(i => i.nivel == nivelInspeccion);
  const [_tamanioMuestraSugerida] = tamanioMuestras.filter(t => t.letra == _letraInpeccionSugerido.letrasClave);
  if (totalKits < _tamanioMuestraSugerida.tamanioMuestra) {
    _tamanioMuestraSugerida.tamanioMuestra = totalKits;
  }
  return _tamanioMuestraSugerida;
}

export function ordenarCajas(seleccioneSugeridas) {
  let ordenados = [];
    groupBy(seleccioneSugeridas, "colorHexadecimal")  //Ordena por parte       
    .map(x => x.sort((a: StackKits, b: StackKits) => a.numeroCaja - b.numeroCaja))                                                           //Ordena por Caja
    .map(x=>x.sort((a, b) => Number(a.nombreTarima.replace("Tarima", "")) - Number(b.nombreTarima.replace("Tarima", ""))))                    //Ordena por tarima
    .map(x => x.forEach(a => ordenados.push(a)));                                                                                         //Lo inserta en el arreglo de ordenados
  return ordenados
}

export function obtenerSeleccionSugerida(stack, nivelInspeccion): {stackKits:StackKits[], tamanioMuestras:TamanioMuesta[] } {
  let seleccioneSugeridas: StackKits[] = [];
  let tamanioMuestras: TamanioMuesta[]=[];
  const stackAgrupado = groupBy([...stack], "nombreCaja");
  stackAgrupado.forEach((s,index) => {
    let totalKits = 0;
    s.forEach(x => totalKits += Number(x['totalKits']));
    const muestra = obtenerNivelInspeccion(totalKits, nivelInspeccion);    
    muestra.nombreCaja=s[0]["nombreCaja"];
    muestra.totalKits=totalKits;
    const color= mdColors[index];
    //random_hex_color_code();
    muestra.colorHexadecimal=color;
    const _seleccionAleatoria = seleccionAleatoria(muestra.tamanioMuestra, muestra.tamanioMuestra > 5 ? 5 : 1, s);
    _seleccionAleatoria.stackKits.forEach(x => {
      x.colorHexadecimal= color;
      seleccioneSugeridas.push(x)
    });
    tamanioMuestras.push(muestra);
  });
  return  { stackKits:seleccioneSugeridas,tamanioMuestras};
}

export function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function isBetween(n: Number, min: Number, max: Number) {
  return n >= min && n <= max;
}

function seleccionAleatoria(tamanioMuestraSugerida, maxPorTomar, stackKits): SeleccionSugerida {
  let seleccionSugerida: StackKits[] = [];
  const max = stackKits.length
  let contador = 0;
  while (contador < tamanioMuestraSugerida) {
    const aleatorio = generateRandomIntegerInRange(0, max - 1);
    let kit = stackKits[aleatorio];
    if (tamanioMuestraSugerida - contador < maxPorTomar) {
      maxPorTomar = tamanioMuestraSugerida - contador;
    }
    if (kit.totalKits > 0 && kit.totalKits >= maxPorTomar) {
      seleccionSugerida.push({
        id_caja: kit.id_caja,
        id_tarima: kit.id_tarima,        
        tipo: kit.tipo,
        numeroCaja: kit.numeroCaja,
        comentarios: "",        
        totalKits: maxPorTomar,
        nombreCaja: kit.nombreCaja,
        nombreTarima: kit.nombreTarima,
      });
      kit.totalKits = kit.totalKits - maxPorTomar;
      contador = contador + maxPorTomar;
    }
  }
  const groupByCaja = groupBy(seleccionSugerida, "id_caja");
  const seleccionAgrupada: StackKits[] = groupByCaja.map(x => {
    let total = 0;
    x.forEach(t => total += t["totalKits"]);
    const [kit] = x;
    return {
      id_caja: kit.id_caja,
      id_tarima: kit.id_tarima,
      tipo: kit.tipo,
      numeroCaja: kit.numeroCaja,
      totalKits: total,
      dataMatrixCode:kit.id_caja,
      comentarios: "",
      aceptados: 0,
      rechazados: 0,
      nombreCaja: kit.nombreCaja,
      nombreTarima: kit.nombreTarima
    };
  });
  return {
    stackKits: seleccionAgrupada
  }
}









