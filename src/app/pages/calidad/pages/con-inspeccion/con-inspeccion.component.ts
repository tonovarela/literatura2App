import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { LoteService } from '@services/lote.service';
import { GridComponent, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { WindowsService } from 'src/app/services/windows.service';

@Component({
  selector: 'app-con-inspeccion',
  templateUrl: './con-inspeccion.component.html',
  styleUrls: ['./con-inspeccion.component.css']
})
export class ConInspeccionComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
