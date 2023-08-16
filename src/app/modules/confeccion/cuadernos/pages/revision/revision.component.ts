import { OnDestroy, } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';




import { CuadernoVerificado, AudioRevision, parametros } from '../../interfaces/cuadernos.interfaces';

import { FormBuilder, FormGroup } from '@angular/forms';

import { pasteNotAllowFunc } from 'src/app/utils/utils';
import { CuadernoKit, KitDetalle } from 'src/app/interfaces/shared/kit.interfaces';
import { ConfeccionKitsGeneral, Resumen } from 'src/app/interfaces/shared/confeccion.interface';
import { environment } from 'src/environments/environment.development';
import { ConfeccionService, ConfiguracionService, KitService, UiService, WebsocketService } from '@services/index';
@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css']
})

export class RevisionComponent implements OnInit, OnDestroy {
  DELAYMAX = environment.delayTimeAllowedInput;

  subscriptions: Subscription[] = [];
  kit: KitDetalle;
  resumen: Resumen;
  cuadernos: CuadernoKit[] = [];
  cuadernosVerificados: CuadernoVerificado[] = [];
  blockInput:boolean= false;
  audios: AudioRevision = {
    scan: new Audio(`assets/audio/scan.mp3`),
    error: new Audio(`assets/audio/error.mp3`),
    ok: new Audio(`assets/audio/ok.mp3`)
  };
  formCaptura: FormGroup;
  params: parametros = {};
  constructor(private activatedRoute: ActivatedRoute,
    public router: Router,
    public uiService: UiService,
    private kitService: KitService,
    public configuracionService: ConfiguracionService,
    public webSocketService: WebsocketService,
    private confeccionService: ConfeccionService,
    private formBuilder: FormBuilder
  ) { }



  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }


  resetCuadernos() {
    this.resetKit();
  }

  

  resetSound() {
    this.audios.scan.pause();
    this.audios.scan.currentTime = 0;
    this.audios.error.pause();
    this.audios.error.currentTime = 0;
    this.audios.ok.pause();
    this.audios.ok.currentTime = 0;
  }
  ngOnInit(): void {
    this.cambiar();
    pasteNotAllowFunc("entrada_cuaderno");
    this.formCaptura = this.formBuilder.group({
      entrada: '',
    });
    const subs = this.formCaptura.valueChanges.pipe(
      debounceTime(this.DELAYMAX),
      distinctUntilChanged()
    ).subscribe(val => {      
      if (val.entrada.length < 6) {
        this.formCaptura.get('entrada').setValue("");
        return;
      }
    });

    this.subscriptions.push(subs);



    const subs1 = this.webSocketService.listen("reloadConfiguracion").subscribe(response => {
      const t = this.configuracionService.kitActivo.numpartprod;      
      if (t.length > 0 && t != this.kit.numparteprod) {
        this.irListado();
      }
      this.configuracionService.cargarConfiguraciones();
    });
    const subs2 = this.webSocketService.listen("cambioPDEActivo").subscribe(response => {
      this.router.navigate(['../../pde'], { relativeTo: this.activatedRoute })
    });


    this.subscriptions.push(subs1);
    this.subscriptions.push(subs2);

    this.activatedRoute.params.pipe(
      switchMap(({ id_pde, numpartprod }) => {
        this.params = { id_pde, numpartprod };
        return this.reloadResumen()
      }),
      catchError((e) => {
        this.router.navigate([`../../../resumen/${this.params.id_pde}`], { relativeTo: this.activatedRoute });
        return of({ ok: false } as ConfeccionKitsGeneral)
      })
    ).subscribe((response) => {
      this.cargarSKULibros();
    });
  }

  cargarSKULibros() {
    this.kitService.obtenerDetalle(this.params.numpartprod).subscribe((response) => {
      this.kit = response.kit;
      this.cuadernos = response.kit.detalle;
      this.resetKit();
    });
  }


  reloadResumen() {    
    return this.confeccionService.resumenKit(this.params.id_pde, this.params.numpartprod).pipe(
      tap(response => {
        
        this.resumen = response.resumen[0];        
        if (Number(this.resumen.restantes) == 0) {          
          this.configuracionService.terminarArmado().subscribe(_=> {
            this.webSocketService.emitir("reloadConfiguracion",{});
            this.router.navigate([`../../../resumen/${this.params.id_pde}`], { relativeTo: this.activatedRoute });
          })          
        }else{
          this.blockInput=false;
        }
      })
    );
  }
  resetKit() {
    this.cuadernosVerificados = this.cuadernos.map(c => {
      return { sku1: c.sku1, descripcion: c.descripcion, verificado: false } as CuadernoVerificado
    })
  }
  vefificarKitCompleto() {    
    if (this.cuadernosVerificados.filter(c => c.verificado).length == this.cuadernosVerificados.length) {      
      this.blockInput=true;
      this.confeccionService.verificarKit(this.params.id_pde, this.params.numpartprod).pipe(
        switchMap(response => this.reloadResumen())
      ).subscribe(response => {        
        this.resetKit();          
        this.webSocketService.emitir("actualizarInfo", { modulo: "revisionCuadernos", numpartprod: this.params.numpartprod });
        setTimeout(() => {
          this.uiService.mostrarToaster("", ` Kit  ${this.params.numpartprod} se ha reportado`, true, 1000, "success");
          this.resetSound();
          this.audios.ok.play();
        }, 0)
      });
    }
  }

  irListado() {
    this.router.navigate(["../../../resumen", this.params.id_pde], { relativeTo: this.activatedRoute })
  }


  verificarLibro() {
    if (this.blockInput){
      return;
    }    
    let skuVerificar = this.formCaptura.get("entrada").value;         
    this.resetSound();
    this.audios.scan.play();
    if (skuVerificar.length == 0) {
      return;
    }
    let _cambio = false;
    this.cuadernosVerificados.forEach(c => {
      if (c.sku1 == skuVerificar && c.verificado == false) {
        _cambio = true;
        c.verificado = true;
      }
    });
    if (_cambio) {      
      this.vefificarKitCompleto();
      this.resetSound();
      this.audios.scan.play();
      this.cambiarKitActivo();
    } else {
      this.uiService.mostrarToaster("Atencion!", `Libro ${skuVerificar} no encontrado`, true, 1500, "error");
      this.resetSound();
      this.audios.error.play();
    }
    this.formCaptura.get("entrada").setValue("");
    document.getElementById("entrada_cuaderno").focus();
  }


  cambiarKitActivo() {
    const { numparteprod } = this.kit;      
    if (this.configuracionService.kitActivo.terminoArmado || this.configuracionService.kitActivo.terminoRevision) {
      this.configuracionService.iniciarArmado(numparteprod).subscribe((_) => {        
        this.webSocketService.emitir("reloadConfiguracion", "Informacion desde el cliente");
        this.configuracionService.cargarConfiguraciones();
      });
    }
  }

  cambiar() {
    document.getElementById("entrada_cuaderno").focus();
  }



}
