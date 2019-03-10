import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { ValidateMatch } from '../../validators/matchValidator';
import { Rol } from '../../modelos/rol';
import { ROLES } from '../../modelos/role';
import { ID_TYPES, Userer } from '../../modelos/user';
import { Person } from '../../modelos/person';
import { PersonService } from '../../servicios/person.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent, OK_DIALOG } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private personService: PersonService, private router: Router, private dialog: MatDialog) { }

  rol: Rol = new Rol();

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    id: new FormControl('', [Validators.required]),
    idType: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    confirmEmail: new FormControl(''),
    pass: new FormControl('', [Validators.required]),
    confirmPass: new FormControl(''),
    role: new FormControl('', [Validators.required])
  });

  hide = true;
  blur = false;
  submited = false;

  roles = ROLES;
  idTypes = ID_TYPES;

  iconColor() {
    return this.form.controls['confirmPass'].invalid && this.blur ? 'warn' : '';
  }

  anyError(): boolean {
    return this.form.invalid;
  }

  getNameErr(): string {
    return this.form.controls['name'].hasError('required') ? 'Digita tus Nombres' : '';
  }

  getLastNameErr(): string {
    return this.form.controls['lastName'].hasError('required') ? 'Digita tus Appelidos' : '';
  }

  getIdErr(): string {
    return this.form.controls['id'].hasError('required') ? 'Digita el Número de tu Documento' : '';
  }

  getIdTypeErr(): string {
    return this.form.controls['idType'].hasError('required') ? 'Elige un Tipo de Documento' : '';
  }

  getEmailErr(): string {
    const errMsg: string = this.form.controls['email'].hasError('required') ?
    'Digita tu Correo Electrónico' : this.form.controls['email'].hasError('email') ?
    'Digita correctamente tu Correo Electronico' : this.form.controls['confirmEmail'].hasError('match') ?
    'Los Correos Electronicos no concuerdan' : '';
    return errMsg;
  }

  getConfirmEmailErr(): string {
    const errMsg: string = this.form.controls['confirmEmail'].hasError('required') ?
    'Digita tu Correo Electrónico' : this.form.controls['confirmEmail'].hasError('email') ?
    'Digita correctamente tu Correo Electronico' : this.form.controls['confirmEmail'].hasError('match') ?
    'Los Correos Electrónicos no concuerdan' : '';
    return errMsg;
  }

  getPassErr(): string {
    return this.form.controls['pass'].hasError('required') ? 'Digita tu Contraseña' : '';
  }

  getConfirmPassErr(): string {
    return this.form.controls['confirmPass'].hasError('required') ?
    'Digita tu Contraseña' : this.form.controls['confirmPass'].hasError('match')  ?
    'Las Contraseñas no concuerdan' : '';
  }

  getRoleErr(): string {
    return this.form.controls['role'].hasError('required') ? 'Elige un rol' : '';
  }

  submit() {
    let form = this.form.controls;
    let dateParsed : string = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let person = {
      email: form['email'].value,
      completeName: form['name'].value + ' ' + form['lastName'].value,
      document: form['id'].value,
      documentType: form['idType'].value,
      idPerson: 1,
      userCollection: {
        idUser: 1,
        dateCreation: dateParsed,
        nameUser: form['confirmEmail'].value,
        password: form['confirmPass'].value,
        state: ''
      },
      idUser: {
        idUser: 1,
        dateCreation: dateParsed,
        nameUser: form['confirmEmail'].value,
        password: form['confirmPass'].value,
        state: ''
      }
    };

    let user = {
      idUser: 2,
      nameUser: form['confirmEmail'].value,
      password: form['confirmPass'].value,
      dateCreation: dateParsed,
      state: '',
      idPerson: {
        email: form['email'].value,
        completeName: form['name'].value + ' ' + form['lastName'].value,
        document: form['id'].value,
        documentType: form['idType'].value,
        idPerson: 1,
        userCollection: {
          idUser: 2,
          nameUser: form['confirmEmail'].value,
          password: form['confirmPass'].value,
          dateCreation: dateParsed,
          state: ''
        }
      }
    }
    
    this.personService.create(user)
      .subscribe(res => {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          data: {
            title: `Registro Exitoso`,
            message: `Se ha registrado exitosamente al usuario <b>${this.form.controls.name.value} ${this.form.controls.lastName.value}</b>, se enviará un email de verificacion a <a href="mailto:${this.form.controls.email.value}">${this.form.controls.email.value}</a>`,
            type: OK_DIALOG
          }
        });
        dialogRef.afterClosed().subscribe(res => {
          this.router.navigate(['login']);
        }); 
      }, err => {
        console.log(`Error status: ${err.status} - ${err.message}`);
      });
    this.submited = false;
  }

  refreshEmail() {
    this.form.controls.confirmEmail.setValue(this.form.controls.confirmEmail.value);
  }

  refreshPass() {
    this.form.controls.confirmPass.setValue(this.form.controls.confirmPass.value);
  }

  ngOnInit() {
    this.form.controls.confirmPass.setValidators([Validators.required, ValidateMatch(this.form.controls.pass)]);
    this.form.controls.confirmEmail.setValidators([Validators.required, Validators.email, ValidateMatch(this.form.controls.email)]);

    document.getElementById('confirmEmail').onpaste = (object) => {
      object.preventDefault();
      alert('Acción prohibida');
    };

    document.getElementById('email').oncopy = (object) => {
      object.preventDefault();
      alert('Acción prohibida');
    };
  }
}

export const idTypes: string[] = [
  'Tarjeta de Identidad',
  'Cedula de Ciudadanía',
  'Cedula de Extranjería',
  'Otro'
];
