import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConfeccionService } from '@services/confeccion.service';
import { WebsocketService } from '@services/websocket.service';
import { Subscription } from 'rxjs';
import { ResumenParte } from 'src/app/interfaces/confeccion.interface';

@Component({
  selector: 'app-progreso-confeccion',
  templateUrl: './progreso-confeccion.component.html',
  styleUrls: ['./progreso-confeccion.component.css']
})
export class ProgresoConfeccionComponent implements OnInit,OnDestroy {

  @Input("pde") pde;
  subscription:Subscription;
  resumenKit:ResumenParte[]=[];
  constructor(public confeccionService:ConfeccionService,
              public webSocketService:WebsocketService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {    
    this.cargarData();
     this.subscription=this.webSocketService.listen("actualizarInfo").subscribe(_=>this.cargarData());
  }
  cargarData(){
    this.confeccionService.resumenKitsGeneral(this.pde.id_pde).subscribe(x=>this.resumenKit= x.resumenGeneral);
  }

}
