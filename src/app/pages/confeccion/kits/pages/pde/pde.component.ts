import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PdeService } from 'src/app/services/pde.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WindowsService } from 'src/app/services/windows.service';

@Component({
  selector: 'app-pde',
  templateUrl: './pde.component.html',
  styleUrls: ['./pde.component.css']
})
export class PdeComponent implements OnInit,OnDestroy {


  pdes: any[] = [];
  //public pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  //filterSettings: FilterSettingsModel = { type: "CheckBox", };
  //height: number = 0;
  cargando: boolean = false;
  subscriptions:Subscription[] = [];
  //resizeSubscription$: Subscription;
  tienePdeActivo :boolean =false;
  constructor(private router: Router,
    private activatedRouter: ActivatedRoute,
    private webSocketService:WebsocketService,
    //private wService: WindowsService,
    private pdeService: PdeService
  ) { }
  
  ngOnDestroy(){    
    this.subscriptions.forEach(x=>x.unsubscribe());    
  }

  ngOnInit(): void {
    this.subscriptions.push(this.webSocketService.listen('cambioPDEActivo').subscribe(_=>{
      this.cargarData();
    }));
    this.cargando = true;
    //this.height = window.innerHeight - 250;
    // this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
    //   this.height = window.innerHeight - 250;
    // });
    this.cargarData();
  }

  cargarData() {
    this.cargando = true;
    this.pdeService.listarPendientes()
      .pipe(
        tap(response => {
          this.cargando = false;
          this.pdes = response["pde"];          
          const pdeActivoParaConfeccion = this.pdes.filter(p => Number(p["id_estado"]) == 1);          
          this.tienePdeActivo = pdeActivoParaConfeccion.length>0;
          if ( this.tienePdeActivo ) {
            const { id_pde } = pdeActivoParaConfeccion[0];
            this.router.navigate(['../resumen', id_pde], { relativeTo: this.activatedRouter })
          }
        })
      )
      .subscribe(response => {
        this.cargando = false;        
        //this.pdes = this.pdes.filter(p => Number(p["totalEmpaque"]) > 0);
      })
  }

}
