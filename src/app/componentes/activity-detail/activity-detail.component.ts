import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {

  generalForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    dependency: new FormControl('', [Validators.required]),
    resGroup: new FormControl('', [Validators.required]),
    coordinator: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    duration: new FormControl('', [Validators.required])
  });

  contractForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    type: new FormControl('', [Validators.required]),
    entity: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required])
  });

  budgetForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    value: new FormControl('', [Validators.required])
  });

  cofinancingForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    entity: new FormControl('', [Validators.required]),
    concept: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  cohortForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    reuneCode: new FormControl('', [Validators.required]),
    sigepCode: new FormControl('', [Validators.required])
  });

  types = ['Consultoría Profesional', 'Servicio Técnico de Laboratorio', 'Educación no Formal', 'Gestión Tecnológica'];

  getNameErr() {
    return '';
  }
  getTypeErr() {
    return '';
  }

  anyError() {
    return false;
  }

  constructor() { }

  ngOnInit() {
  }

}