
import swal, { SweetAlertResult } from 'sweetalert2';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class UiService {


  constructor(private toastr: ToastrService) {

  }
  mostrarAlertaError(titulo, mensaje) {
    swal.fire(titulo, mensaje, 'error');
  }

  mostrarToaster(titulo, mensaje,showProgresBar=false,timeOut=4000,tipo="warning") {    
  switch (tipo) {    
    case "success":
        this.toastr.success(mensaje, titulo, { progressBar: showProgresBar, timeOut });     
      break;  
    case "info":
        this.toastr.info(mensaje, titulo, { progressBar: showProgresBar, timeOut });             
      break;  
      case "error":
        this.toastr.error(mensaje, titulo, { progressBar: showProgresBar, timeOut });             
      break;  
    default:
      this.toastr.warning(mensaje, titulo, { progressBar: showProgresBar, timeOut });     
      break;
  }
            
  }

  

  mostrarAlertaConfirmacion(titulo, mensaje,labelAceptar='Aceptar',labelCancelar='Cancelar'): Promise<SweetAlertResult> {
    return swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: labelAceptar,
      cancelButtonText: labelCancelar,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    });
    //.then((result) => {
    //   if (result.value) {
    //     swalWithBootstrapButtons.fire(
    //       'Deleted!',
    //       'Your file has been deleted.',
    //       'success'
    //     )
    //   } else if (
    //     /* Read more about handling dismissals below */
    //     result.dismiss === swal.DismissReason.cancel
    //   ) {
    //     swalWithBootstrapButtons.fire(
    //       'Cancelled',
    //       'Your imaginary file is safe :)',
    //       'error'
    //     )
    //   }
    // })




  }

  mostrarAlertaSuccess(titulo, mensaje, timer=3500) {    
    swal.fire({
      icon: 'success',
      title: titulo,
      text: mensaje,
      showConfirmButton: false,
      timer
    });
  }

  
}
