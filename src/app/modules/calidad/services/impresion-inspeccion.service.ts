import { Injectable } from '@angular/core';
import { b64toBlob } from 'src/app/utils/utils';
import { saveAs } from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TamanioMuesta } from '../utils/calidad';
import { cuerpoDocumento } from '../template/impresionInpeccion';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root'
})
export class ImpresionInspeccionService {

  constructor() { }

  crearDocumento(tamanioMuestras: TamanioMuesta[], pde: any, nivelInspeccion:number, usuarioRegistroInspeccion:string) {          
    const {template,styles,images} = cuerpoDocumento(tamanioMuestras,pde,nivelInspeccion,usuarioRegistroInspeccion);  
    let docDefinition = {
      pageSize: 'A4',
      compress: true,
      content: template,
      // footer: function (currentPage, pageCount) {
      //   return [, {
      //     text: currentPage.toString() + ' de ' + pageCount,
      //     bold: true,
      //     fontSize: 20,
      //     alignment: 'center',
      //     margin: [10, 10, 10, 10]
      //   }];
      // },
      images,
      styles
    };
    const pdf = pdfMake.createPdf(docDefinition);
    pdf.getDataUrl((dataUrl) => {
      let blob: any = b64toBlob(dataUrl.replace("data:application/pdf;base64,", ""), "application/pdf");
      saveAs(blob, "inspeccionCalidad.pdf");
    });
  }



}
