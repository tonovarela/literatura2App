import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoteService } from 'src/app/services/lote.service';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit {

   data: any =[];
   distribucion:any=null;
   id_pde: string ="";
   id_lote: string ="";
   actualizo: boolean= false;
  constructor(private activatedRoute:ActivatedRoute,
    private router:Router,
    private loteService:LoteService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id_lote,id_pde})=>{      
      this.id_pde = id_pde; 
      this.id_lote= id_lote;     
      this.loteService.obtenerDistribucion(id_lote).subscribe((response)=>{
          this.data= response["data"];
          this.distribucion= JSON.parse(this.data.distribucion);          
      })          
    });
  }

  regresar(){
    this.router.navigate(["../../../resumen",this.id_pde],{ relativeTo:this.activatedRoute});
  }
  movioItem(event){
    this.actualizo=true;
    console.log("Movio item");

  }

  actualizar(){
    
    this.loteService.actualizarDistribucion(this.id_lote,JSON.stringify(this.distribucion)).subscribe(x=>{
      alert("Se actualizo la distribucion");
      this.actualizo=false;
    });


  }

}
