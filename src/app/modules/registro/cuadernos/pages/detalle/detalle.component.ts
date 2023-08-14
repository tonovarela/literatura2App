import { UiService } from './../../../../../services/ui.service';
import { CuadernoService } from './../../../../../services/cuaderno.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {




  constructor(private activatedRouter: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private uiService: UiService,
    private cuadernoService: CuadernoService) { }

  cuadernoForm: FormGroup = this.fb.group(
    {
      sku1: [""],
      sku2: [""],
      descripcion: ["", Validators.required],
      clasificacion: ["", Validators.required]
    }
  );

  ngOnInit(): void {

    this.activatedRouter.params.pipe(
      switchMap(x=> this.cuadernoService.obtener(x["sku"])),
      tap(x => {
        if (!x.success) {
          this.router.navigateByUrl("/pages/cuaderno/listado");
        }
        return of([]);
      })
    ).subscribe(response=>{
    this.cuadernoForm.patchValue(response.cuadernos[0])     
    });
    
  }



  tieneError(campo: string): boolean {

    const field=this.cuadernoForm.get(campo)!;
    return field.errors && field.touched;

    
  }

  guardar(){

    this.cuadernoService.actualizar(this.cuadernoForm.value).subscribe(x=>{
     this.uiService.mostrarAlertaSuccess("Producto","Producto actualizado",1000)
     this.router.navigateByUrl("/pages/cuadernos/listado");
    })
    



  }


}
