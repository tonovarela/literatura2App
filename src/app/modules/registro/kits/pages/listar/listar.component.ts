
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { WindowsService } from 'src/app/services/windows.service';
import { KitRegistro } from '../../interfaces/kit.interface';
import { KitService } from '../../services/kit.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit, OnDestroy {

  public kits: KitRegistro[] = [];
  public pageSettings: PageSettingsModel = { pageSizes: true, pageSize:20 };
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  height: number = 0;
  resizeSubscription$: Subscription

  constructor(private kitService: KitService,
              private wService:WindowsService,
              private router: Router
              ) { }
  ngOnDestroy(): void {
    this.resizeSubscription$.unsubscribe();
  }

  ngOnInit(): void {
    this.kitService.listar().subscribe(data => {
      this.kits = data.kits;
    })

    this.height = window.innerHeight - 250;
    this.resizeSubscription$ = this.wService.ResizeHeight().subscribe(x => {
      this.height = window.innerHeight - 250;
    });

  }

  verDetalle(id_kit){    
    this.router.navigateByUrl(`/pages/kits/detalle/${id_kit}`);
  }

}
