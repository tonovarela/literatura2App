import { PdeService } from 'src/app/services/pde.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterSettingsModel, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { from, Subscription } from 'rxjs';

import { concatMap } from 'rxjs/operators';
import { ConfiguracionService, UsuarioService, WebsocketService, WindowsService } from '@services/index';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: GridComponent;
  pdes: any[] = [];
  public pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  filterSettings: FilterSettingsModel = { type: 'CheckBox' };
  subscriptions: Subscription[] = [];
  height: number = 0;
  cargando: boolean = false;
  estados: any[] = [];
  mostrarCancelados: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public usuarioService: UsuarioService,
    private wService: WindowsService,
    public configuracionService: ConfiguracionService,
    private webSocketService: WebsocketService,
    private pdeService: PdeService
  ) {

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }



  ngOnInit(): void {
    

    const sb1$ = this.webSocketService
      .listen('reloadConfiguracion')
      .subscribe(_ => this.configuracionService.cargarConfiguraciones());
    this.subscriptions.push(sb1$);
    this.cargando = true;
    this.height = window.innerHeight - 250;
    const sb2$ = this.wService
      .ResizeHeight()
      .subscribe((x) => {
        this.height = window.innerHeight - 250;
      })
    this.subscriptions.push(sb2$);

    const sb3$ = this.webSocketService
      .listen('cambioPDEActivo')
      .subscribe(_ => this.cargarData());
    this.subscriptions.push(sb3$);


    this.cargarData();


  }






  cargarData(todos = false) {
    this.cargando = true;
    this.mostrarCancelados = todos;
    this.pdeService.listar(todos).subscribe((response) => {
      this.cargando = false;
      this.pdes = response['pde'];
      this.estados = response['estados'];
    });
  }

  agregar() {
    this.router.navigate(['agregar'], { relativeTo: this.route });
  }

  get seleccionHabilitada() {
    return this.configuracionService.puedeCambiarPDE;
  }

  onChangeState(e, data) {
    const { id_pde, id_estado } = data;
    let pdeActualizarEstado = [];
    if (Number(e) == 1) {
      this.pdes.forEach(p => {
        if (p.id_estado == 1 && p.id_pde != id_pde) {
          pdeActualizarEstado.push({ id_estado: 2, id_pde: p.id_pde });
          p.id_estado = 2;
        }
      });
    }
    let pdeActivo = this.pdes.filter(p => p.id_pde == id_pde)[0];
    pdeActualizarEstado.push({ id_estado: Number(e), id_pde: id_pde });
    pdeActivo.id_estado = e;

    const obs = {
      next: () => {

      },
      error: () => { },
      complete: () => {
        if (pdeActualizarEstado.length > 0) {
          this.webSocketService.emitir("cambioPDEActivo", "");
          this.grid.refresh();
        }     //Finalizar
      },

    }
    from(pdeActualizarEstado)
      .pipe(concatMap(p => this.pdeService.actualizar(p)))
      .subscribe(obs);


  }
}
