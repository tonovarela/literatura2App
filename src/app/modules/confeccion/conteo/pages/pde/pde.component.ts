import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PdeService } from 'src/app/services/pde.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WindowsService } from 'src/app/services/windows.service';

@Component({
  selector: 'app-pde-conteo',
  templateUrl: './pde.component.html',
  styleUrls: ['./pde.component.css']
})
export class PdeComponent implements OnInit,OnDestroy {

  pdes:any[]=[];
  
  height: number = 0;
  cargando:boolean =false;
  tienePdeActivo :boolean =false;
  subscriptions :Subscription[]=[];
  
  constructor(            
    //private wService:WindowsService,
    private router: Router,
    private weSocketService:WebsocketService,
    private activatedRouter: ActivatedRoute,
    private pdeService:PdeService) { }

  ngOnInit(): void {
    this.cargando=true;
    //this.height = window.innerHeight - 250;
    // this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
    //   this.height = window.innerHeight - 250;
    // });
    this.subscriptions.push(this.weSocketService.listen('cambioPDEActivo').subscribe(_=>{
      this.cargarData();
    }));    
    this.cargarData();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(x=>x.unsubscribe());
  }

  cargarData(){
    this.cargando=true;
    this.pdeService.listarPendientes()
    .pipe(
      tap(response => {
        this.cargando=false;
        this.pdes = response["pde"];
        const pdeActivoParaConfeccion = this.pdes.filter(p => Number(p["id_estado"]) == 1);
        this.tienePdeActivo =pdeActivoParaConfeccion.length > 0;        
        if (this.tienePdeActivo) {
          const { id_pde } = pdeActivoParaConfeccion[0];          
          this.router.navigate(['../revision', id_pde], { relativeTo: this.activatedRouter })
        }
      })
    )
    .subscribe(_=>{      
      this.cargando=false;
      //this.pdes=response["pde"];            
      //this.pdes =this.pdes.filter(p=>Number(p["revisionKits"])>0);
    })
  }

}
