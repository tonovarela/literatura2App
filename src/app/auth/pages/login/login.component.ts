import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UiService } from 'src/app/services/ui.service';
import { catchError } from 'rxjs/operators';
import { of,  } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup ;
  year: number = new Date().getFullYear();
  constructor(private router: Router,
    private uiService: UiService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.usuarioService.leerStorage();
    if (this.usuarioService.Usuario) {
      this.router.navigateByUrl("/pages");
    }
    this.loginForm = this.fb.group({
      usuario: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.loguearseConStorage();
  }

  loguearseConStorage() {
    if (sessionStorage.getItem("User")) {
      this.loginForm.setValue({
        usuario: sessionStorage.getItem("User"),
        password: sessionStorage.getItem("Pass")
      });
    }
    this.ingresar();
  }

  get f() {
    return this.loginForm.controls;
  }

  ingresar() {
    if (this.loginForm.invalid) {
      return;
    }    
    this.usuarioService.login({ login: this.loginForm.get("usuario").value, password: this.loginForm.get("password").value })
      .pipe(
        catchError(e => {
          this.uiService.mostrarAlertaError("Login", " Error de comunicacion con el server, intente mas tarde");
          return of({})
        })
      )
      .subscribe(response => {
        if (response["success"]) {
          this.router.navigate(["/pages/"]);
        } else {
          this.uiService.mostrarAlertaError("Login", " Usuario o contraseña incorrectos")
        }
      });
  }

}
