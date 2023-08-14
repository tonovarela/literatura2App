import { AfterViewInit, ElementRef, Input ,Component, OnInit, ViewChild,} from '@angular/core';
import { Impresion } from 'src/app/interfaces/impresion.interface';
import  * as printJS  from 'print-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-impresion',
  templateUrl: './view-impresion.component.html',
  styles: [
  ]
})
export class ViewImpresionComponent implements  OnInit,AfterViewInit{

  @ViewChild("container") container: ElementRef<HTMLDivElement>;
  @Input("print") print: Impresion;

  
  
  private  _base64string: string = "";
   pdfURL : string="";
   cargando: boolean = false;
   importados: boolean=false;



  constructor(private http: HttpClient) { }

  ngOnInit(): void {    
    this.cargando = true; 
  }

  ngAfterViewInit(): void {
    
    this.cargarInfo();
          
  }

  cargarInfo(){
    this.cargando = true; 
    this.container.nativeElement.innerHTML="";
    let url = ``;
    if (this.importados){
       url=`${this.print.url}&importado=${this.importados}`;
    }else{
      url = this.print.url;
    }
    this.importados=!this.importados;
    this.http.get(url).subscribe(response => {
      const targetElement = this.container.nativeElement;
      const pdf = `${response["pdf"]}`
      this.pdfURL=pdf;
      const iframe = document.createElement('iframe');
      iframe.style.width = "100%"
      iframe.style.height = "800px";
      iframe.src = pdf;
      targetElement.appendChild(iframe);
      this._base64string = pdf.replace("data:application/pdf;base64,", "");
      this.cargando = false;
    });
  }
  


  imprimir() {
  
    //printJS({ printable: `${this._base64string}`, type: 'pdf', base64: true });
  }


}
