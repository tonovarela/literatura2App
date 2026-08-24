import { FormGroup, FormBuilder, FormArray, Validators, ValidationErrors } from '@angular/forms';
import { CdkDragEnter } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ResponseDetalleKits } from '../../interfaces/kit.interface';
import { KitService } from './../../services/kit.service';
import { CuadernoService } from './../../../../../services/cuaderno.service';
import { UiService } from './../../../../../services/ui.service';
import { of, Subject, Subscription } from 'rxjs';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {
  detallekit!: ResponseDetalleKits;

  debouncer: Subject<number> = new Subject();
  debounceSubscripcion: Subscription;


  mostrarSugerencias: boolean = false;
  skusSugeridos: any[][] = [];

  // Campos removidos del formulario: se envían con valor fijo en cada actualización
  private readonly camposSinCaptura = {
    etiqueta: "1",
    orden_compra: "1",
    clavekit2: "",
    plataforma: "",
    pr: "",
    indice: "",
    cont2: "",
    tipo: "",
  };
  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private uiService: UiService,
    public router: Router,
    private kitService: KitService,
    private cuadernoService: CuadernoService
  ) { }



  ngOnDestroy(): void {
    this.debounceSubscripcion.unsubscribe();    
  }


  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(x => this.kitService.obtenerPorID(x["id_kit"])),
      tap(x => {
        if (!x.success) {
          this.router.navigateByUrl("/pages/kits/inicio");
        }
        return of([]);
      }),
    ).subscribe(data => {
      
      this.kitForm.patchValue(data.kit);
      const detalleOrdenado = [...(data.kit["detalle"] || [])].sort(
        (a, b) => this.valorOrden(a) - this.valorOrden(b)
      );
      detalleOrdenado.forEach((d) => {
        this.detallesArray.push(this.newDetalle(d))
      })
      this.sincronizarOrden();
    }
    );

    this.debounceSubscripcion = this.debouncer
      .pipe(debounceTime(300))
      .subscribe(i => {
        this.mostrarSugerencias = true;
        const detalle = this.detallesArray.at(i);
        const { sku1 } = detalle.value;        
        if (sku1.length == 0) {
          this.skusSugeridos[i] = [];
          detalle.patchValue({ id: '', sku1: '', sku2: '', descripcion: '', clasificacion: '' });

          return;
        }
        

        this.cuadernoService.obtenerParecido(sku1).subscribe(data => {
          this.skusSugeridos[i] = data.cuadernos;
        });
      });

  }



  colocarSugerencia(skuSugerido, i) {
    this.skusSugeridos[i] = [];    
    skuSugerido.id = i;    
    this.detallesArray.at(i).patchValue({ id: i,
                                        sku1: skuSugerido.sku1,
                                        sku2: skuSugerido.sku2,
                                        descripcion: skuSugerido.descripcion,
                                        clasificacion: skuSugerido.clasificacion });
  }
  eliminarSugerencia(i) {
    this.skusSugeridos[i] = [];
  }
  

  kitForm: FormGroup = this.fb.group({
    numparteprod: [""],
    numparte: [""],
    totalPorCaja: ["", [Validators.required, Validators.pattern("^[0-9]*$") ]],
    //totalCajasPorTarima: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    numpart: [""],
    edicion: [""],
    clavekit: [""],
    identifica: [""],
    idioma: ["", [Validators.required, Validators.minLength(3)]],
    cont1: [""],
    vehiculo: [""],
    detalle: this.fb.array([])

  }, {
    validators: [this.validadorSkuDuplicados()]
  });



  validadorSkuDuplicados() {
    return (control: FormGroup): ValidationErrors | null => {
      let detalle = control.get("detalle") as FormArray
      const valores = [];
      for (let c of detalle.controls) {
        const v = c.get("sku1").value
        if (v.length > 0) {
          valores.push(v);
        }
      }
      const uniq = [...new Set(valores)];
      if (valores.length > uniq.length) {
        control.setErrors({ valoresUnicos: false })
        return { valoresUnicos: false }
      }
      return null;
    };
  }




  get detallesArray(): FormArray {
    return this.kitForm.get("detalle") as FormArray
  }

  private newDetalle(d): FormGroup {    
    return this.fb.group({
      id: [d.id || ''],
      sku1: [d.sku1 || '', [Validators.required, Validators.minLength(3)]],
      sku2: [d.sku2 || ''],
      descripcion: [d.descripcion || '', [Validators.required, Validators.minLength(3)]],
      clasificacion: [ d.clasificacion ||'', [Validators.required]],
      orden: [d.orden || ''],

    })
  }


  agregarDetalle() {
    this.kitForm.markAllAsTouched();
    this.detallesArray.push(this.newDetalle({}));
    this.skusSugeridos.push([]);
    this.sincronizarOrden();
    var element = document.getElementById("footer");
    setTimeout(() => { element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }); }, 200);

  }


  eliminarDetalle(i) {
    this.detallesArray.removeAt(i);
    this.skusSugeridos.splice(i, 1);
    this.sincronizarOrden();
  }


  // Cada tarjeta es su propio cdkDropList: al entrar el arrastrado se intercambia
  // la posicion en el momento, que es lo que permite reacomodar sobre un layout que
  // salta de renglon (el CDK 16 no tiene orientacion "mixed").
  alEntrarCuaderno(event: CdkDragEnter<number>) {
    const desde = event.item.data;
    const hacia = event.container.data;
    if (desde === hacia) {
      return;
    }
    this.moverDetalle(desde, hacia);
    event.item.data = hacia;
  }


  private moverDetalle(desde: number, hacia: number) {
    if (hacia < 0 || hacia >= this.detallesArray.length) {
      return;
    }
    const detalle = this.detallesArray.at(desde);
    this.detallesArray.removeAt(desde);
    this.detallesArray.insert(hacia, detalle);
    const [sugerencias] = this.skusSugeridos.splice(desde, 1);
    this.skusSugeridos.splice(hacia, 0, sugerencias);
    this.sincronizarOrden();
    this.kitForm.markAsDirty();
  }


  // El orden que se persiste es siempre la posicion visual del cuaderno (1..n)
  private sincronizarOrden() {
    this.detallesArray.controls.forEach((detalle, i) => {
      detalle.get("orden").setValue(`${i + 1}`, { emitEvent: false });
    });
  }


  // Los cuadernos sin `orden` se van al final conservando el orden que devolvio el servicio
  private valorOrden(d): number {
    const valor = Number(d?.orden);
    return d?.orden === null || d?.orden === undefined || d?.orden === '' || isNaN(valor)
      ? Number.MAX_SAFE_INTEGER
      : valor;
  }

  guardar() {
    this.kitForm.markAllAsTouched();
    this.sincronizarOrden();

    this.kitService.actualizar({ ...this.kitForm.value, ...this.camposSinCaptura }).subscribe(x => {
      if (x["success"] == true) {
        this.uiService.mostrarAlertaSuccess("Kit", "kit actualizado", 1000);
      }
    })

  }


  autofillDescripcion(i) {
    this.debouncer.next(i);
  }

  tieneErrorKit(campo: string): boolean {

    const field = this.kitForm.get(campo)!;
    return field.errors && field.touched;

  }

  tieneErrorDetalle(i: number, campo: string) {
    const field = this.detallesArray!.at(i).get(campo)
    return field.errors && field.touched;

  }









}
