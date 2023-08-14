import { FormGroup, FormBuilder, FormArray, Validators, ValidationErrors } from '@angular/forms';
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
      data.kit["detalle"].forEach((d) => {
        this.detallesArray.push(this.newDetalle(d))
      })
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
          detalle.setValue({ id: '', sku1: '', sku2: '', descripcion: '', clasificacion:'' });

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
    this.detallesArray.at(i).setValue({ id: i, 
                                        sku1: skuSugerido.sku1, 
                                        sku2: skuSugerido.sku2, 
                                        descripcion: skuSugerido.descripcion, 
                                        clasificacion:skuSugerido.clasificacion });
  }
  eliminarSugerencia(i) {
    this.skusSugeridos[i] = [];
  }
  

  kitForm: FormGroup = this.fb.group({
    numparteprod: [""],
    numparte: [""],
    totalPorCaja: ["", [Validators.required, Validators.pattern("^[0-9]*$") ]],
    orden_compra:["",Validators.required],
    //totalCajasPorTarima: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    numpart: [""],
    edicion: [""],
    clavekit: [""],
    clavekit2: [""],
    identifica: [""],
    plataforma: [""],
    pr: [""],
    indice: [""],
    idioma: ["", [Validators.required, Validators.minLength(3)]],
    cont1: [""],
    cont2: [""],
    vehiculo: [""],
    tipo: [""],
    etiqueta: [""],
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

    })
  }


  agregarDetalle() {
    this.kitForm.markAllAsTouched();
    this.detallesArray.push(this.newDetalle({}));
    var element = document.getElementById("footer");
    setTimeout(() => { element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }); }, 200);

  }


  eliminarDetalle(i) {
    this.detallesArray.removeAt(i);
  }

  guardar() {
    this.kitForm.markAllAsTouched();

    this.kitService.actualizar(this.kitForm.value).subscribe(x => {
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
