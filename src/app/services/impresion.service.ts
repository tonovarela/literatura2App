import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { b64toBlob, groupBy } from '../utils/utils';
import * as alasql  from 'alasql';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ImpresionService {
  modelImpresion: any;
  pde: any;
  URL_IMPRESIONES: string = environment.URL_IMPRESIONES;

  constructor(private http: HttpClient) { }

  generarPorCaja(id: string) {
    let models = {}
    models = this.modelImpresion.cajas.filter(x => x.id == id);
    if (id == "ALL") {
      models = this.modelImpresion.cajas;
    }


    this.http.post(`${this.URL_IMPRESIONES}/api/impresion/caja?esBase=SI`, { models }).subscribe((response) => {
      if (!response["ok"])
        return;
      const pdf = `${response["pdf"]}`;
      const blob = b64toBlob(pdf.replace("data:application/pdf;base64,", ""), "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl as any, '_blank');
    });
  }

 async generarPorTarima(id: string) {

    const { serial, lote } = this.pde;
    let models = [];
    models = this.modelImpresion.tarimas.filter(x => x.id == id);
    if (id == "ALL") {
      models = this.modelImpresion.tarimas;
    }
    let paraImprimir = [];
    models.forEach(m => {
      const _cajas = this.modelImpresion.cajas.filter(c => c.idTarima === m.id);
      let totalKits = 0;
      _cajas.forEach(e => totalKits += Number(e.totalKits));
      const { tipo, nombre, orden_compra, label, nombrePallet } = m;
      paraImprimir.push({
        tipo,
        nombrePallet,
        cajas: _cajas,
        orden_compra,
        nombreTarima: `${label}`,
        totalKits
      });
    })


    let _models = paraImprimir.map(t => {
      const [p] = t.cajas;


      let porPDE = groupBy(t.cajas, "id_pde");
      let cajasPorPDE = [];
      porPDE.forEach(p => {
        let total = 0;
        groupBy(p, 'numpartprod').forEach(g => {
          g.forEach(t => total += Number(t.totalKits));
          const [kit] = g;
          cajasPorPDE.push({
            totalKits: total,
            id_pde: kit.id_pde,
            descripcionPDE: kit.pdeDescripcion,
            numpartprod: kit.numpartprod,
            orden_compra: kit.orden_compra
          });
          total = 0;
        });
      });

      let cajas = [];
      let total2 = 0;
      groupBy(t.cajas, "numpartprod").forEach(g => {
        g.forEach(t => total2 += Number(t.totalKits));
        const [kit] = g;
        cajas.push({ totalKits: total2, numpartprod: kit.numpartprod });
        total2 = 0;
      });


    const agrupadosPorOrdenCompra =  alasql('SELECT numpartprod,orden_compra,sum(totalKits) AS totalKits FROM ? GROUP BY numpartprod,orden_compra',[cajasPorPDE]);
    
      return {
        numpartprod: p.numpartprod || "",
        cantidad: t.totalKits,
        nombrePallet: t.nombrePallet,
        nombreTarima: t.nombreTarima,
        tipo: t.tipo == "Completa" ? "C" : "M",
        lote: lote,
        cont1: p.cont1,
        cont2: p.cont2,
        supplier: 6001006741,
        purchase: t.orden_compra,
        serial: serial,
        fechaProduccion: p.fechaImpresion,
        fechaCaducidad: "NO APLICA",
        idLabel: p.idTarima,
        cajas,
        cajasPorPDE,
        agrupadosPorOrdenCompra
      };
    });

    //console.log(_models);


    this.http.post(`${this.URL_IMPRESIONES}/api/impresion/tarima?esBase=SI`, { _models }).subscribe((response) => {
      if (!response["ok"])
        return;
      const pdf = `${response["pdf"]}`;
      const blob = b64toBlob(pdf.replace("data:application/pdf;base64,", ""), "application/pdf");
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl as any, '_blank');
    });

  }




}
