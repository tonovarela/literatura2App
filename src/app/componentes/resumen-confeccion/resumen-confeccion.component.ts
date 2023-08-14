import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
//import  * as moment from 'moment';

//import * as printJS from 'print-js';
import { saveAs } from 'file-saver';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiService } from 'src/app/services/ui.service';
import { b64toBlob, NewID } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

import { KitService } from 'src/app/pages/home/kits/services/kit.service';



@Component({
  selector: 'app-resumen-confeccion',
  templateUrl: './resumen-confeccion.component.html',
  styleUrls: ['./resumen-confeccion.component.css']
})
export class ResumenConfeccionComponent implements OnInit {

  @Input("resumenConfeccion") resumenConfeccion: any[] = [];
  cargandoImpresion: boolean = false;
  modoReimpresion: boolean = false;

  id: string = NewID();
  URL: string = environment.URL_IMPRESIONES;
  d: any;
  constructor(private http: HttpClient, private uiService: UiService,
    private kitService: KitService
  ) {
  }

  ngOnInit(): void {
    // Se muta el modelo, agregando dos propiedades 
    this.resumenConfeccion.forEach(e => {
      e.seleccionado = false;
      e.reimpresion = 0;
    });
  }

  // existenSeleccionados() {
  //   return this.resumenConfeccion.filter(c => c.seleccionado).length > 0;
  // }
  existenConValor() {
    return this.resumenConfeccion
      .filter(c => (c.reimpresion.length > 0 && Number(c.reimpresion) > 0))
      .length > 0;
  }
  onReimpresionChange() {
    if (this.modoReimpresion) {
      this.resumenConfeccion.forEach(c => c.reimpresion = 0);
    } else {
      this.resumenConfeccion.forEach(c => c.seleccionado = false);
    }


  }
  onCheckboxChange(e) {
    this.resumenConfeccion.forEach(c => c.seleccionado = e.target.checked);
  }

  esNumero(t) {
    return Number(t) > 0;
  }

  descargar(resumen, esReimpresion = false) {
    let _modelsSKUS = [];
    //Obtener Detalle de kits
    const { numparteprod } = resumen;    
    this.kitService.obtener(numparteprod).subscribe(response => {
      const detalle: any[] = response.kit.detalle;
      const contenido= detalle.map(cuaderno => { return { sku: cuaderno.sku1, descripcion: cuaderno.descripcion }; })
      _modelsSKUS.push(
        {
          numparteprod: resumen.numparteprod || "--",
          contenido,
          idioma: resumen.idioma || "--",
          cont1: resumen.cont1 || "--",
          cont2: resumen.cont2 || "--",
          etiqueta: resumen.etiqueta || "--",
          fechaImpresion: '21-08-2021',//moment().format("DD-MM-YYYY"),
          vehiculo: resumen.vehiculo || "--",
          edicion: resumen.edicion || "--",
          indice: resumen.indice || "--",
          pr: resumen.pr || "--",
          clavekit: resumen.clavekit || "--",
          clavekit2: resumen.clavekit2 || "--",
          identifica: resumen.identifica || "--",
          plataforma: resumen.plataforma || "--",
          total: esReimpresion ? Number(resumen.reimpresion) : Number(resumen.confeccion) || 0,
          nombrePDE: resumen.nombrePDE || "--",
          totalComponentes: resumen.totalComponentes || 0,
        })
      this.descargarPDF(_modelsSKUS);

    })
   


  }


  private descargarPDF(modelsSKUS) {
    this.cargandoImpresion = true;
    this.http.post(`${this.URL}/api/impresion/kit?esBase=SI&importado=true`, { modelsSKUS })
      .pipe(
        catchError((e) => {
          this.cargandoImpresion = false;
          this.uiService.mostrarAlertaError("Atención", "Se presentó un error en la generacion de archivo")
          return of({ ok: false, pdf: "" });
        })
      )
      .subscribe(response => {
        if (!response["ok"]) {
          return;
        }
        const pdf = `${response["pdf"]}`;
        const blob = b64toBlob(pdf.replace("data:application/pdf;base64,", ""), "application/pdf");
        const [kit] = modelsSKUS;
        saveAs(blob, `kits_${kit.numparteprod}.pdf`);
        // printJS({
        //          printable: pdf.replace("data:application/pdf;base64,", ""), 
        //          showModal:true,
        //          modalMessage:"Creando el documento espere un momento ",
        //          type: 'pdf', base64: true})
        //window.open(blobUrl as any, '_blank');
        this.cargandoImpresion = false
      });
  }

}
