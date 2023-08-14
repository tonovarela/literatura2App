import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfeccionService, ConfiguracionService, WebsocketService } from '@services/index';

import { Subject, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { catchError,  delay } from 'rxjs/operators';
import { ConfeccionKitsGeneral } from 'src/app/interfaces/confeccion.interface';


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit, OnDestroy {
  @ViewChild("btnEnLote") btnEnLote: ElementRef;
  @ViewChild("textBusqueda") textBusqueda: ElementRef;
  selectedIndex = 1;
  resumenKit: ConfeccionKitsGeneral = {};
  

  pde: any = {}
  lotes: any = [];
  cargando: boolean = false;
  mostrarBack: boolean = true;
  textChangedSubject: Subject<string> = new Subject<string>();
  vistaToogle:boolean =false;

  subscriptions: Subscription[] = [];
  textoPatron: string = '';

  setSelected(id: number) {
    this.selectedIndex = id;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private webSocketService: WebsocketService,
    public configuracionService: ConfiguracionService,
    private confeccionService: ConfeccionService) {
  }

  cambiarVista(){
    this.vistaToogle=!this.vistaToogle;
  }
  ngOnInit(): void {
    const subs1 = this.webSocketService.listen("reloadConfiguracion").subscribe(_ => this.configuracionService.cargarConfiguraciones());
    const subs2 = this.webSocketService.listen('cambioPDEActivo').subscribe(_ =>this.router.navigate(["../../pde"], { relativeTo: this.activatedRoute }));
    const subs3 = this.webSocketService.listen('actualizarInfo').subscribe(_ => {      
      if (this.noHaTerminadoConfecccion()){
        this.obtenerData(this.pde.id_pde)
      }      
    });
    const subs4 = this.textChangedSubject.subscribe(text => this.textoPatron = text);
    this.activatedRoute.params.subscribe(({id_pde})=>this.obtenerData(id_pde));
    

    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);
    this.subscriptions.push(subs3);
    this.subscriptions.push(subs4);
  }




  private noHaTerminadoConfecccion(){
    return this.resumenKit.resumenGeneral.some(x=> x.armados!==x.total);
  }


  obtenerData(id_pde) {
    this.cargando = true;
    return this.confeccionService.resumenKitsGeneral(id_pde).pipe(
      catchError((e) => {
        this.router.navigate(['/pages/confeccion/cuadernos/pde']);
        return of({} as ConfeccionKitsGeneral);
      }),
      delay(500),
    )
      .subscribe((response: ConfeccionKitsGeneral) => {
        this.cargando = false;
        this.resumenKit = response;
        this.pde = response.pde;
        
        const { id_estado } = this.pde;
        if (id_estado == "1") {
          this.mostrarBack = false;
        }
      });
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  irListado() {
    this.router.navigate(["../../pde"], { relativeTo: this.activatedRoute })
  }

  buscarPatron() {
    this.textChangedSubject.next(this.textBusqueda.nativeElement.value);

  }

  puedeConfeccionarse(numpartprod){
    
    if (this.configuracionService.kitActivo.numpartprod.length==0){
      return true;
    }    
    return this.configuracionService.kitActivo.numpartprod == numpartprod;

  }











}
