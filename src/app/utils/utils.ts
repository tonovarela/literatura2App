//import  * as  bwipjs from 'bwip-js';
import JsBarcode from 'jsbarcode/bin/JsBarcode';

import { v4 as uuidv4 } from 'uuid';
import { Stack } from '../class/Stack';
import { environment } from 'src/environments/environment.development';

export function textToBase64Barcode(text) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, text, { format: "QRCODE", lineColor: "#f5325c" });
  return canvas.toDataURL("image/png");
}

export function obtenerMatrix() {
  // let canvas = document.createElement('canvas');
  // bwipjs.toCanvas(canvas, {
  //   bcid: 'code128',       // Barcode type
  //   text: '583b3bbc-6ae1-4e54-8895-33ad7a920fce',    // Text to encode
  //   scale: 5,               // 3x scaling factor        
  //   includetext: true,            // Show human-readable text        
  //   //backgroundcolor:'ff0000',
  //   //barcolor:'047886'
  // });
  // return canvas.toDataURL("image/png");
}

export function NewID() {
  return uuidv4();
}

export function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

function formarCajas(numparteprod, totalCompletas, totalKitCompletas, totalKitsIncompletas,id_pde,origen) {    
  let stack = new Stack();
  if (origen=="mezcladas"){
    for (let i = 0; i < totalCompletas; i++) {
      stack.push({ id: NewID(), nombre: numparteprod,id_pde:id_pde, totalKits: totalKitCompletas });
    }
  }else{
    for (let i = 0; i <= totalCompletas; i++) {
      stack.push({ id: NewID(), nombre: numparteprod,id_pde:id_pde, totalKits: totalKitCompletas });
    }
  }

  if (totalKitsIncompletas > 0) {
    stack.push({ id: NewID(), nombre: numparteprod,id_pde:id_pde ,totalKits: totalKitsIncompletas });
  }
  
  return stack;
}

export function generarLote(dto: any,
                            maximoCajasPorTarima: number,
                            contadorTarimas:number=1,
                            todoEnUnaTarima:boolean=false,
                            origen
                            ) {
  //{ reportados ,maxCaja, numparteprod}
  let tarimas = [];
  const max = Number(maximoCajasPorTarima);
  dto.forEach(d => {    
    const totalCajas = d.reportados / d.maxCaja  //(reportados) (Maximo de kits por caja);
    if (d.distribucion == undefined) {
      d.distribucion = { Caja: { detalle: {} } };
    }
    d.distribucion.Caja.detalle = formarCajas(d.numparteprod,Math.trunc(totalCajas),Number(d.maxCaja),(d.reportados % d.maxCaja),d.id_pde || '',origen);        
    //console.log(formarCajas(d.numparteprod,Math.trunc(totalCajas),Number(d.maxCaja),(d.reportados % d.maxCaja),d.id_pde || '') );
    let stack: Stack = d.distribucion.Caja.detalle;
    while (stack.size() > 0) {     
      if (stack.size() >= max) {        
        const r = stack.obtener(max);
       // console.log(r);
        tarimas.push({ id: NewID(), tipo: "completa", cajas: r });
      }    
      if (stack.size() < max && stack.size() > 0) {        
        const r = stack.obtener(stack.size());
        tarimas.push({ id: NewID(), tipo: "mezclada", cajas: r, });
      }
    }
    
  });

  let _i = contadorTarimas;  
  const tarimasMezcladas = tarimas.filter(t => t.tipo == "mezclada")
  let _tarimas = {
    completas: tarimas.filter(t => t.tipo == "completa"),
    mezcladas: tarimasMezcladas,
    mezcladasBKP: []
  };  
  _tarimas.completas.forEach(t => t.nombre = `Tarima ${_i++}`);
  _tarimas.mezcladas.forEach(t => t.nombre = `Tarima ${_i++}`);
  if (todoEnUnaTarima){
   let  _cajas=[];
   let [_tarima] =_tarimas.mezcladas;
    _tarimas.mezcladas.forEach(t=>{
         t.cajas.forEach(c=> _cajas.push(c));
    });
    _tarima.cajas=_cajas;
    _tarimas.mezcladas=[_tarima];
  }
  _tarimas.mezcladasBKP = JSON.parse(JSON.stringify(_tarimas.mezcladas));  
  return _tarimas;
}

export function groupBy(arr, prop) {
  const map = new Map(Array.from(arr, obj => [obj[prop], []]));
  arr.forEach(obj => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
}
export function pasteNotAllowFunc(xid) {
  if (!environment.puederPegarTexto) {  
    let input = document.getElementById(xid);    
    if (input==null){      
      return;
    }
    
    input.onpaste = (e) => e.preventDefault();
  }
}