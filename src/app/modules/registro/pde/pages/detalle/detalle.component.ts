
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { delay } from 'rxjs/operators';


import { ConfeccionService } from '@services/confeccion.service';
import { ExcelService } from '@services/excel-service.service';

import { PdeService } from '@services/pde.service';
import { Reporte } from 'src/app/interfaces/shared/reporte.interface';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  pde: any = {};  
  selectedIndex = 1;
  resumenConfeccion: any[] = [];
  cargando: boolean = false;
  actualizo: boolean = false;
  reporteConfeccion: Reporte[]=[];
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,
    public confeccionService:ConfeccionService,
    private _excelService:ExcelService,
    private pdeService: PdeService,    
  ) { }
  
  cargarReporteConfeccion(){
    this.confeccionService.obtenerReporte(this.pde.id_pde).subscribe(x=>this.reporteConfeccion=x.reporte);
  }
  descargarReporteExcel(){
    this._excelService.exportAsExcelFile(this.reporteConfeccion, "Reporte");
  }
  ngOnInit(): void {
    this.cargando = true;
    
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.pdeService.obtener(id)),
      catchError(e => {
        this.router.navigate(['/pages/pde/inicio']);
        return of();
      }),
      delay(500),
    ).subscribe(response => {
      this.cargando = false;
      this.pde = response["pde"];
      this.cargarReporteConfeccion();
      const {  resumenConfeccion } = this.pde;      
      this.resumenConfeccion = JSON.parse(resumenConfeccion);      
    });
  }

  irListado() {
    this.router
      .navigate(['../../inicio'], { relativeTo: this.activatedRoute });
  }


  movioItem(event) {
    this.actualizo = true;
  }

}
