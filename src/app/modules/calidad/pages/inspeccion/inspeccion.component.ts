
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InspeccionService } from '@services/inspeccion.service';
import { LoteService } from '@services/lote.service';
import { PdeService } from '@services/pde.service';
import { UiService } from '@services/ui.service';
import { UsuarioService } from '@services/usuario.service';
import { NivelInspeccion, SeleccionSugerida, StackKits } from '../../interfaces/interfaces';
import { ImpresionInspeccionService } from '../../services/impresion-inspeccion.service';
import { obtenerSeleccionSugerida, ordenarCajas, TamanioMuesta } from '../../utils/calidad';

@Component({
  selector: 'app-inspeccion',
  templateUrl: './inspeccion.component.html',
  styleUrls: ['./inspeccion.component.css']
})


export class InspeccionComponent implements OnInit {
  id_lote: number = 0;
  busquedaDMtxt: string;
  pde: any = { id_pde: 0 };
  nivelesDeInspeccion: NivelInspeccion[] = [{ label: 'I', tamanioMuestra: 0 }, { label: 'II', tamanioMuestra: 0 }, { label: 'III', tamanioMuestra: 0 }];
  seleccionSugerida: SeleccionSugerida = { nivelDeInspeccion: 1, stackKits: [] };  //Se guarda
  tarimas: any = {};
  totalKits: number;
  cargando: boolean = true;
  cambioModel:boolean=false;
  tamanioMuestras: TamanioMuesta[] = [];

  
  usuarioRegistroInspeccion:string="";



  nivelDeInspeccionActiva: NivelInspeccion; 
  stackKitRevision: StackKits = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private impresionInspeccionService:ImpresionInspeccionService,
    private usuarioService:UsuarioService,
    private pdeService:PdeService,
    private uiService: UiService,
    private loteService: LoteService,
    private inspeccionService: InspeccionService
  ) { }


  ngOnInit(): void {
    this.cargando = true;
    this.activatedRoute.params.subscribe(params => {
      const { id_lote, id_pde } = params;
      this.id_lote = id_lote;      
      this.obtenerDetallePDE(id_pde);
      this.obtenerDistribucion(id_lote);      
    })
  }


  get tieneDataMatrixCapturado() {
    return this.seleccionSugerida.stackKits.some(x => x.dataMatrixCode == x.id_caja);
  }

  get NivelDeinspeccion() {
    return this.nivelesDeInspeccion[this.seleccionSugerida.nivelDeInspeccion - 1].label;
  }

  //Solo cuando haya inpseccionado como minimo un elemento de cada numero de parte
  get puedeImprimirComprobante(){  
    const tamanoMuestras=this.tamanioMuestras.length;
    if (tamanoMuestras==0){
      return false;
    }    
    const totalInspeccionados =this.tamanioMuestras.filter(muestra =>muestra.aceptadosInspeccion>0 || muestra.rechazadosInspeccion>0).length;      
    return totalInspeccionados== tamanoMuestras;
}

  async regresar() {
    let ruta="";
    if (this.tieneDataMatrixCapturado){
        ruta= "../../../con-inspeccion"
    }else{
      ruta ="../../../sin-inspeccion";
    }
    if (this.cambioModel){
      const { isConfirmed } =await this.uiService.mostrarAlertaConfirmacion("Calidad","Desea salir sin guardar los cambios realizados?","Si, salir sin hacer cambios","No");
      if (isConfirmed){      
        this.router.navigate([ruta], { relativeTo: this.activatedRoute })    
      }    
    }else{
      this.router.navigate([ruta], { relativeTo: this.activatedRoute })    
    }
    
  }

  private crearStack() {
    let stackKits: StackKits[] = [];

    this.tarimas.completas.forEach(d => {
      let n = 1;
      d.cajas.forEach(x => {
        stackKits.push({
          id_tarima: d["id"],
          numeroCaja: n++,
          tipo: "completa",
          nombreTarima: d["nombre"],
          nombreCaja: x["nombre"],
          id_caja: x["id"],
          totalKits: x["totalKits"]
        })
      });
    });

    this.tarimas.mezcladas.forEach(d => {
      let n = 1;
      d.cajas.forEach(x => {
        stackKits.push({
          id_tarima: d["id"],
          numeroCaja: n++,
          tipo: "mezclada",
          nombreTarima: d["nombre"],
          nombreCaja: x["nombre"],
          id_caja: x["id"],
          totalKits: x["totalKits"]
        })
      });
    });

    return stackKits;
  }
  //Refactorizar debido a que se usa en dos componentes    --Tarimador component y este
  private obtenerTotalKits() {
    let total = 0;
    this.tarimas.completas.forEach(d => {
      d.cajas.forEach(x => { total += Number(x.totalKits) });
    });
    this.tarimas.mezcladas.forEach(d => {
      d.cajas.forEach(x => { total +=Number(x.totalKits) });
    });
    return total;
  }


  obtenerDistribucion(id_lote){
    this.loteService.obtenerDistribucion(id_lote).subscribe((response) => {
      this.cargando = false;
      this.tarimas = JSON.parse(response["distribucion"]["distribucion"])
      this.totalKits = this.obtenerTotalKits();
      if (response['inspeccion']) {        
        this.usuarioRegistroInspeccion= response["inspeccion"]["usuario"];
        this.seleccionSugerida = JSON.parse(response["inspeccion"]["seleccionSugerida"]);
        this.seleccionSugerida.stackKits.forEach(x=>x.activo=false);
        this.tamanioMuestras = JSON.parse(response["inspeccion"]["tamanioMuestras"]);
        this.nivelDeInspeccionActiva = this.nivelesDeInspeccion[this.seleccionSugerida.nivelDeInspeccion - 1];
      }
      this.calcularTotalKitPorInspeccion();
    });
    //this.imprimir();
  }
  obtenerDetallePDE(id_pde){
    this.pdeService.obtener(id_pde).subscribe(response=>{
      this.pde= response["pde"];      
    });
  }

  imprimir(){   
    if (this.usuarioRegistroInspeccion.length==0){
      this.usuarioRegistroInspeccion= this.usuarioService.Usuario.login;
    }

      this.impresionInspeccionService.crearDocumento(this.tamanioMuestras, this.pde, this.seleccionSugerida.nivelDeInspeccion, this.usuarioRegistroInspeccion);
  }

  calcularTotalKitPorInspeccion() {
    this.nivelesDeInspeccion.forEach((x, index) => {
      const stack = this.crearStack();
      const seleccionSugerida = obtenerSeleccionSugerida(stack, index + 1);
      let total = 0
      seleccionSugerida.stackKits.forEach(x => total += x.totalKits);
      x.tamanioMuestra = total;
    })
  }

  buscarCode(){
    this.seleccionSugerida.stackKits.forEach(x=>x.activo=false);
    const [caja] = this.seleccionSugerida.stackKits.filter(x => x.id_caja == this.busquedaDMtxt);
    if (caja != undefined) {      
        caja.activo=true;
        this.stackKitRevision=caja;        
    } else {      
      this.uiService.mostrarAlertaError("Calidad", "No se encontró información de la caja");
    }
    this.busquedaDMtxt = ""
  }

  buscarCodeMatrix(event) {
    if (event.keyCode != 13) {
      return;
    }    
    this.buscarCode();

  }


  actualizarKitRevisado(stackKit:StackKits){      
    
    this.stackKitRevision=null;          
    this.cambioModel=true;
    this.calculoInspeccion(stackKit.nombreCaja,true);
    this.calculoInspeccion(stackKit.nombreCaja,false);
  }



  

  public obtenerMuestras() {
    this.nivelDeInspeccionActiva = this.nivelesDeInspeccion[this.seleccionSugerida.nivelDeInspeccion - 1]
    const stack = this.crearStack();
    const s = obtenerSeleccionSugerida(stack, this.seleccionSugerida.nivelDeInspeccion);
    this.tamanioMuestras = s.tamanioMuestras;
    this.tamanioMuestras.forEach(x => {
      x.rechazadosInspeccion = 0;
      x.aceptadosInspeccion = 0;      
    })
    let seleccioneSugeridas: StackKits[] = s.stackKits;
    this.seleccionSugerida.stackKits = ordenarCajas(seleccioneSugeridas);
    this.seleccionSugerida.stackKits.forEach(x=>x.activo=false);
    this.cambioModel=true;
  }
  private totalInspeccion(nombreCaja: string, aceptados: boolean = true) {
    let total = 0
    this.seleccionSugerida
      .stackKits
      .filter(x => x.nombreCaja == nombreCaja)
      .forEach(s => {
        total += (aceptados ? Number(s.aceptados) : Number(s.rechazados)) || 0
      })

    return total;
  }

  calculoInspeccion(nombreCaja, aceptados) {
    const [caja] = this.tamanioMuestras.filter(x => x.nombreCaja == nombreCaja);
    const total = this.totalInspeccion(nombreCaja, aceptados);
    aceptados
      ? caja.aceptadosInspeccion = total
      : caja.rechazadosInspeccion = total;
  }

  


  async guardar() {  
    
      this.cambioModel=false;
      const nombreUsuario =this.usuarioService.Usuario.login;
      this.usuarioRegistroInspeccion= nombreUsuario;
      this.inspeccionService.guardar(this.id_lote, this.seleccionSugerida, this.tamanioMuestras,nombreUsuario)
        .subscribe(x => this.uiService.mostrarAlertaSuccess("Listo", "Inspección guardada con exito"));
  
  }




}

