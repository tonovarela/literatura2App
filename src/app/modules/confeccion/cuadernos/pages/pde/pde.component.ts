import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Router, ActivatedRoute } from '@angular/router';
import { FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PdeService } from 'src/app/services/pde.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WindowsService } from 'src/app/services/windows.service';

@Component({
  selector: 'app-pde-cuadernos',
  templateUrl: './pde.component.html',
  styleUrls: ['./pde.component.css']
})
export class PdeComponent implements OnInit,OnDestroy {


  pdes: any[] = [];
  //public pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  //filterSettings: FilterSettingsModel = { type: "CheckBox", };
  //resizeSubscription$: Subscription;
  height: number = 0;
  cargando: boolean = false;
  
  tienePdeActivo:boolean =false;
  subcripcionWS : Subscription;
  constructor(
    private wService: WindowsService,
    private router: Router,
    private webSocketService:WebsocketService,
    private activatedRouter: ActivatedRoute,
    private pdeService: PdeService) { }

  ngOnInit(): void {
    this.subcripcionWS=this.webSocketService.listen("cambioPDEActivo").subscribe(_=>{
       this.cargarData();
    });
    this.cargando = true;
    //this.height = window.innerHeight - 250;
    // this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
    //   this.height = window.innerHeight - 250;
    // });
    this.cargarData();
  }
  ngOnDestroy(){
    this.subcripcionWS.unsubscribe();
  }


  cargarData() {
    this.cargando = true;
    this.pdeService.listarPendientes()
      .pipe(
        tap(response => {
          this.cargando=false;
          this.pdes = response["pde"];
          const pdeActivoParaConfeccion = this.pdes.filter(p => Number(p["id_estado"]) == 1);
          this.tienePdeActivo= pdeActivoParaConfeccion.length>0;
          if (this.tienePdeActivo) {
            const { id_pde } = pdeActivoParaConfeccion[0];
            this.router.navigate(['../resumen', id_pde], { relativeTo: this.activatedRouter })
          }
        })
      )
      .subscribe(response => {
        this.cargando = false;        
        this.pdes = this.pdes.filter(p => Number(p["armadoKits"]) > 0);

      })
  }

}
