import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfiguracionService } from '@services/configuracion.service';
import { LoteService } from '@services/lote.service';
import { WebsocketService } from '@services/websocket.service';
import { WindowsService } from '@services/windows.service';
import { GridComponent, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado-inspeccion',
  templateUrl: './listado-inspeccion.component.html',
  styleUrls: ['./listado-inspeccion.component.css']
})
export class ListadoInspeccionComponent implements OnInit {

  @Input('realizados') realizados:number =0;
  @ViewChild('grid') grid: GridComponent;
  public lotes: any[] = [];
  public pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  public subscriptions: Subscription[] = [];
  public filterSettings: FilterSettingsModel = { type: 'CheckBox' };
  public height: number = 0;
  public cargando: boolean = false;
  public estados: any[] = [];
  

  constructor(
    
    private wService: WindowsService,
    public loteService:LoteService, 
    public configuracionService: ConfiguracionService,
    private webSocketService: WebsocketService,
  ) {

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }



  ngOnInit(): void {
  
    const sb1$ = this.webSocketService.listen('reloadConfiguracion')
    .subscribe(_ => {      
      this.configuracionService.cargarConfiguraciones();      
    });
    this.subscriptions.push(sb1$);
    this.cargando = true;    
    this.height = window.innerHeight - 250;    
    const sb2$ = this.wService.ResizeHeight().subscribe((x) => {
      this.height = window.innerHeight - 250;
    })
    this.subscriptions.push(sb2$);
    this.cargarData();
  }



  cargarData() {
    this.cargando = true;
    this.loteService.listarCalidad(this.realizados).subscribe(response=>{
       this.lotes=response["lotes"];
       this.cargando=false;
    });
    
  }

}
