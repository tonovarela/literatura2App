import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdeService } from 'src/app/services/pde.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})
export class EntregaComponent implements OnInit {

  cargando:boolean=false;
  pde:any ={ id_pde:0};
  lotesDetalle:any=[];
  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
            private pdeService:PdeService) { }
  ngOnInit(): void {
  
    this.activatedRoute.params.subscribe(params=>{      
      this.pde.id_pde = params['id_pde'];
      this.pdeService.obtenerLotes(this.pde.id_pde).subscribe(response=>{      
        this.lotesDetalle=response["detalle"]
      })
    })
  }

  irInspeccion(id_lote){
  this.router.navigate(['../../inspeccion',this.pde.id_pde,id_lote],{relativeTo:this.activatedRoute })
  }

  regresar(){
    this.router.navigate(['../../'],{relativeTo:this.activatedRoute})
  }

}
