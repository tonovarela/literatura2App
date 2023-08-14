import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Observable } from 'rxjs';
import { CajaImpresion } from '../componentes/impresion/template/caja';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {



  cuerpo = []
  cargando: boolean=false;

  constructor() { }

  obtenerCuerpo() {
    return new Observable((obs) => {
      let cuerpo = []
      const totalPaginas = 12;
      
      for (let i = 0; i < totalPaginas; i++) {                      
        const page = CajaImpresion();
        cuerpo.push(page, { text: '', pageBreak: i < (totalPaginas - 1) ? 'before' : '' });                
      }
      obs.next(cuerpo);      
      obs.complete();
    });

  }

  obtenerArchivo() {
    this.cargando = true;
    this.obtenerCuerpo().subscribe(cuerpo => {
      this.cargando = false;
      //console.log(cuerpo);
      let docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        compress: true,
        content: cuerpo,
        footer: function (currentPage, pageCount) {
          return [, {
            text: currentPage.toString() + ' de ' + pageCount,
            bold: true,
            fontSize: 20,
            alignment: 'center',
            margin: [10, 10, 10, 10]
          }];
        },
        styles: {
          textoNormal: {
            fontSize: 8,
          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 8,
            margin: [0, 0, 0, 0]
          }
        }
      };

      
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.open();
      // pdf.getDataUrl((dataUrl) => {
      //   const targetElement = document.querySelector('#iframeContainer');
      //   targetElement.innerHTML = "";
      //   const iframe = document.createElement('iframe');
      //   iframe.style.width = "50%"
      //   iframe.style.height = "600px";
      //   iframe.src = dataUrl;
      //   targetElement.appendChild(iframe);
      // });

    });

    // pdf.getBlob((blob) => {
    //   let fileURL = window.URL.createObjectURL(blob);
    //   window.open(fileURL, "_blank")
    // });

  }

}
