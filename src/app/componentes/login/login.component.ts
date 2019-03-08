import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Router } from '@angular/router';
import { UserService } from '../../servicios/user.service';
import { LoginService } from '../../auth/login.service';
import { AuthUser } from '../../modelos/user';
import { RolService } from '../../servicios/rol.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //Controlador del formulario y sus campos
  //Variable &key genera un identificador al formulario
  form: FormGroup = new FormGroup({
    $key: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required, responseValidator(this)])
  });

  captchaResolved: boolean = false;
  credentialError: {status: number, message: string} | null = null;

  blur: boolean = false;
  hide: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private loginService : LoginService
  ) { }

  //Mensaje tipo PopUp en el boton de inicio (cuando está inhabilitado)
  buttonInfo() {
    const emailControl: AbstractControl = this.form.controls['email'];
    const passControl: AbstractControl = this.form.controls['pass'];
    const msg = passControl.hasError('credentials') ?
                this.credentialError ? this.credentialError.message : '' :
                emailControl.hasError('required') ? 'El campo "Email" es requerido' :
                emailControl.hasError('email') ? 'Digita un email valido' :
                passControl.hasError('required') ? 'El campo "Contraseña" es requerido' :
                !this.captchaResolved ? 'Comprueba que eres humano' : '';
    return msg;
  }

  //Mensaje sí el campo email del form tiene algun error
  getEmailErr(): string {
    const control: AbstractControl = this.form.controls['email']; 
    const msg = control.hasError('required') ? 'Digita tu Correo Electrónico' :
                control.hasError('email') ? 'Digita correctamente tu Correo Electronico' : ''; 
    return msg;
  }

  //Mensaje sí el campo pass del fomr tiene algun error
  getPassErr(): string {
    const control: AbstractControl = this.form.controls['pass']; 
    const msg = control.hasError('credentials') ?
                this.credentialError ? this.credentialError.message : '' :
                control.hasError('required') ? 'Digita tu Contraseña' : '';
    return msg;
  }

  goToRegister() {
     this.router.navigateByUrl('/registro');
  }

  //Cambia el color del icono (ocultar/ver) de pass, sí hay un error
  iconColor() {
    return this.form.controls['pass'].invalid && this.blur ? 'warn' : '';
  }

  ngOnInit() { }

  onSubmit() {
    const form = this.form.controls;

    const user: AuthUser = {
      nameUser: form['email'].value,
      password: form['pass'].value
    }
    
    this.userService.getAuth(user)
    .subscribe(res => {
      if(!res.status) {
        this.loginService.guardarDatosUsuario(res.token);
        this.router.navigate(['/inicio']);
      } else {
        this.credentialError = {status: res.status, message: 'Email y/o contraseña no concuerdan'};
        console.log(`Error status: ${res.status} - ${res.message}`);
        console.log(res);
      }
    }, err => {
      switch(err.status) {
        case 0:
          console.log(`No hay respuesta del servidor - error status: ${err.status}`);
          break;
        case 400:
          console.log(`Pagina no encontrada - error status: ${err.status}`);
          break;
        case 403:
          console.log(`Credenciales no concuerdan - Desde el error status: ${err.status}`);
          break;
        default:
          console.log(`Error status: ${err.status}`);
          break;
      }
      this.credentialError = {status: err.status, message: 'Email y/o contraseña no concuerdan'}
      this.form.controls['pass'].setValue('');
    });
  }

  //Se borra el mensaje de error (credentialError) cuando se digita nuevamente en los inputs
  resetCredential() {
    this.credentialError = null;
    this.form.controls['pass'].setValue(this.form.controls['pass'].value);
  }

  resolved() {
    this.captchaResolved = true;
    setTimeout(() => {
      this.captchaResolved = false;
    }, 120000);
  }
}

//Validador personalizado de credenciales para el form
export function responseValidator(parent: LoginComponent | any) : ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
      return parent.credentialError ? { 'credentials': true } : null;
  }
}
