import { Router } from '@angular/router';
import { CuadernoService } from './../../../../../services/cuaderno.service';
import { WindowsService } from 'src/app/services/windows.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { Cuaderno } from '../../interface/cuaderno.interface';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit, OnDestroy {

  constructor(private wService: WindowsService,
             private cuadernoService: CuadernoService,
             private router: Router
             ) { }


  cuadernos: Cuaderno[] =[];
  public pageSettings: PageSettingsModel = { pageSizes: true, pageSize: 20 };
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  height: number = 0;
  resizeSubscription$: Subscription

  ngOnInit(): void {
    this.height = window.innerHeight - 250;
    this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
      this.height = window.innerHeight - 250;
    });

    this.cuadernoService.listar().subscribe(data=>{
        this.cuadernos= data.cuadernos
    })
    
  }


  verDetalle(sku:string){
    
    this.router.navigateByUrl(`pages/cuadernos/detalle/${sku}`);

  }

  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

}
