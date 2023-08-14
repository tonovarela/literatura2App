import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ConfeccionService } from 'src/app/services/confeccion.service';
import { PdeService } from 'src/app/services/pde.service';
import { UiService } from 'src/app/services/ui.service';
import { AudioRevision } from '../../../kits/interfaces/interfaces';
import { ResponseRevision, Revision } from '../../interfaces/interfaces';
import { WebsocketService } from '../../../../../services/websocket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { KitService } from 'src/app/services/kit.service';
import { ResumenParte } from 'src/app/interfaces/confeccion.interface';
import { ConfiguracionService } from '../../../../../services/configuracion.service';
import { CajaService } from '@services/caja.service';
import { KitDetalle } from 'src/app/interfaces/kit.interfaces';
import { pasteNotAllowFunc } from 'src/app/utils/utils';



@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css'],
})


export class RevisionComponent implements OnInit, OnDestroy {

  id_pde: string = "";
  cargando: boolean = false;
  pde: any = {};
  subscriptions: Subscription[] = [];
  formCaptura: FormGroup = this.fb.group({ entrada: '' });
  revisiones: Revision[] = [];
  resumenKit: ResumenParte[] = [];
  resumenAlternativo: any;
  DELAYMAX: number = environment.delayTimeAllowedInput;
  vistaToogle: boolean = false;

  blockInput:boolean=false;
  
  esFireFox:boolean = false;


  audios: AudioRevision = {
    scan: new Audio(`assets/audio/scan.mp3`),
    error: new Audio(`assets/audio/error.mp3`),
    ok: new Audio(`assets/audio/ok.mp3`)
  };




  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private kitService: KitService,
    public configuracionService: ConfiguracionService,
    private confeccionService: ConfeccionService,
    private pdeService: PdeService,
    private cajaService: CajaService,
    private webSocketService: WebsocketService,
    private uiService: UiService) {
      const agent = window.navigator.userAgent.toLowerCase()
      this.esFireFox=agent.indexOf('firefox') > -1;
     }

  regresar() {
    this.router.navigate(['../../pde'], { relativeTo: this.activatedRoute })
  }


  

  ngOnInit(): void {
    
    const subs1 = this.formCaptura.valueChanges.pipe(
      debounceTime(this.DELAYMAX),
      distinctUntilChanged()
    ).subscribe(val => {
      if (val.entrada.length < 6) {
        this.formCaptura.get('entrada').setValue("");
        return;
      }
    });
    const subs2 = this.webSocketService.listen("cambioPDEActivo").subscribe(_ => this.regresar());
    const subs3 = this.webSocketService.listen('actualizarInfo')
      .subscribe((payload: any) => {      
        
        if (payload.modulo === "revisionKits") {
        this.cargarRevisiones(payload.numparteprod, false);
        } else {
          this.cargarRevisiones();
        }

      });
    const subs4 = this.activatedRoute.params.subscribe((params: Params) => {
      this.id_pde = params['id_pde'];
      this.pdeService.obtener(this.id_pde).subscribe(response => {
        this.pde = response["pde"];
      });
      this.cargarRevisiones();
    });

    const subs5 = this.webSocketService.listen('reloadConfiguracion').subscribe(_ => {      
      if (this.configuracionService.kitActivo.terminoRevision ==false){
        this.cargarRevisiones();
      }
      
    });
    // const subs6 = this.configuracionService.watcherSkuActivo.subscribe(_ => {
    //   console.log("rrr");
    // });
    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);
    this.subscriptions.push(subs3);
    this.subscriptions.push(subs4);
    this.subscriptions.push(subs5);
    //this.subscriptions.push(subs6);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  get kitActivo() {
    return this.configuracionService.kitActivo;
  }



  cambiarVista() {
    this.vistaToogle = !this.vistaToogle;
  }
  animarContador(numparteprod) {
    
    const element = document.getElementById(numparteprod);
    element.classList.add("flipInY", "animated", "contadorActivo");
    setTimeout(() => {
      element.classList.remove("flipInY", "animated", "contadorActivo");
    }, 600);
  }

  revisionPreEtiqueta(numparteprod) {
    const { revisados, totalPorCaja, total } = this.revisiones.find(r => r.numpartprod.toUpperCase() == numparteprod.toUpperCase());

    const _revisados = Number(revisados);
    const _totalPorCaja = Number(totalPorCaja);
    const _restantes = _revisados % _totalPorCaja;
    if (_restantes === 0 || revisados == total.toString()) {      
      const totalKits = _restantes === 0 ? totalPorCaja : _restantes;
      this.uiService.mostrarToaster("Caja", "Imprimiendo caja", false, 500, "info");
      this.imprimirPreEtiqueta(numparteprod, totalKits);
    }
    
    //console.log({_restantes,revisados,total});
  }
  imprimirPreEtiqueta(numpartprod, totalKits) {
    let kit:KitDetalle ={};    
    this.kitService.obtenerDetalle(numpartprod).pipe(
      switchMap(kitResponse=>{
        kit = kitResponse.kit;
      return  this.cajaService.obtenerPreEtiqueta(this.id_pde, numpartprod)
      })).subscribe(response=>{
        let caja ={};
        if (!response.ok){
           caja = {
            cont1: kit.cont1,
            cont2: kit.cont2,
            contenido: `${kit.cont1} ${kit.cont2 || ""}`,
            etiqueta: "Pre-etiqueta",
            fechaImpresion: "",
            id: "#################",
            idioma: kit.idioma,
            idLabel: "#############",
            idTarima: "############",
            importado: kit.edicion.toUpperCase() == "IMPORTADOS",
            indice: kit.indice,
            nombre: numpartprod,
            numpartprod: numpartprod,
            pr: kit.pr,
            sku: kit.clavekit,
            sku2: kit.clavekit2,                        
            totalKits: totalKits,
            vehiculo: kit.vehiculo || kit.identifica
          };
          
          this.webSocketService.emitir("imprimirPreEtiqueta", caja);
          
        }else{
          const {id_caja, id_tarima,numeroTarima, numeroCaja} = response.caja;          
          const resumenTotal= response.resumenTotal;
          const {totalCajas}=resumenTotal.find(x=>x.id_tarima==id_tarima)           
          caja={
            cont1: kit.cont1,
            cont2: kit.cont2,
            contenido: `${kit.cont1} ${kit.cont2 || ""}`,
            etiqueta: `Caja [${numeroCaja} de ${totalCajas} ] Tarima [${numeroTarima}}]`,
            fechaImpresion: "",
            id: id_caja,
            idioma: kit.idioma,
            idLabel: id_caja,
            idTarima: id_tarima,
            importado: kit.edicion.toUpperCase() == "IMPORTADOS",
            indice: kit.indice,
            nombre: numpartprod,
            numpartprod: numpartprod,
            pr: kit.pr,
            sku: kit.clavekit,
            sku2: kit.clavekit2,            
            totalKits: totalKits,
            vehiculo: kit.vehiculo || kit.identifica
            
          };     
          this.cargarRevisiones();   
          this.webSocketService.emitir("imprimirPreEtiqueta", caja);
          this.webSocketService.emitir("imprimirPreEtiqueta", caja);
        }        
        //console.log(caja);
      
    });
    
    
  }



  // verificarTerminoRevision(revision) {    
  //   if (revision.porEmpacar == revision.total) {
  //     this.configuracionService.terminoRevision().subscribe(_ => {
  //       this.webSocketService.emitir("reloadConfiguracion", {});
  //     })
  //   }
  // }

  cargarRevisiones(numparteprod = "", imprimirPreEtiqueta = true) {
    this.cargando = true;
    //const comparator = (a: ResumenParte, b: ResumenParte) => (Number(b.total) - Number(b.porEmpacar)) - (Number(a.total) - Number(a.porEmpacar));    
    this.confeccionService.revisionesKit(this.id_pde).subscribe((response) => {
      
      this.cargando = false;
      this.revisiones = [];
      this.resumenAlternativo = [];
      this.revisiones = response.revisiones;
      this.resumenAlternativo = [...response.resumenAlternativo];
      let revisiones = [...response.resumenGeneral];
      const numpartActivo = this.kitActivo.numpartprod;
      if (numpartActivo.length > 0) {
        this.resumenAlternativo = this.resumenAlternativo.filter(x => x.numpartprod == numpartActivo);
        this.revisiones = this.revisiones.filter(x => x.numpartprod == numpartActivo);        
        revisiones = revisiones.filter(x => x.numpartprod == numpartActivo);        
        //this.verificarTerminoRevision(revision);
        const [revision] = revisiones;
        if (revision.porEmpacar > 0 && revision.armados == 0) {
          revisiones = [...response.resumenGeneral];
          this.configuracionService.terminoRevision().subscribe(_ => {
            this.webSocketService.emitir("reloadConfiguracion", {});
          })
        }
      }
      if (numparteprod.length > 0) {
        setTimeout(() => this.animarContador(numparteprod), 1);
        //this.animarContador(numparteprod);
        if (imprimirPreEtiqueta) {
          this.revisionPreEtiqueta(numparteprod);
        }
      }
      // if (revision.armados.toString() === "0") {                  
      //   this.configuracionService.terminoRevision().subscribe(()=>{
      //     this.webSocketService.emitir('reloadConfiguracion', "Actualizar desde el cliente");
      //     this.configuracionService.cargarConfiguraciones();
      //   });          
      // }
      
      this.resumenKit = revisiones;
      if (document.getElementById("entrada")!=null){
        pasteNotAllowFunc("entrada");
        this.formCaptura.get("entrada").setValue("");
        document.getElementById("entrada").focus();  
        
      }      

    });
  }

  
  verificarKit() {
    
    
    const kitVerificar = this.formCaptura.get('entrada').value;
    if (this.blockInput){      
      return;
    }
    if (kitVerificar.length == 0) {
      return;
    }
    if (kitVerificar.toUpperCase().trim() != this.kitActivo.numpartprod.toUpperCase().trim()) {
      //this.uiService.mostrarToaster("Atención", "Este kit es erroneo o  no es el activo", true, 400, "error");
      //this.audios.error.play();
      this.formCaptura.get("entrada").setValue("");
      document.getElementById("entrada").focus();
      return;
    }
  this.blockInput=true;
    this.confeccionService.registrarRevisionKit(this.id_pde, kitVerificar)
      .pipe(
        catchError(err => {
          this.uiService.mostrarToaster("Atencion!", err.error.mensaje, true, 400, "error");
          this.audios.error.play();
          return of({ ok: false })
        }),
      )
      .subscribe(response => {
        this.blockInput=false
        if (response["ok"] == false) {
          return;
        }
        
        this.webSocketService.emitir('actualizarInfo', { modulo: "revisionKits", numparteprod: kitVerificar });
        this.audios.ok.play();
        this.uiService.mostrarToaster("OK", response['result'], true, 400, "success");
        this.cargarRevisiones(kitVerificar);
        this.formCaptura.get("entrada").setValue("");
         document.getElementById("entrada").focus();
      })
    
  }

}
