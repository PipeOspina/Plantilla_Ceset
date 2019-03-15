import { Component, OnInit, Input, Output } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcademicActivity, createNewActivity } from '../../modelos/academicActivity';
import { ActivityService } from '../../servicios/activity.service';
import * as XLSX from 'xlsx';
import { User } from '../../modelos/user';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  currentActivity: AcademicActivity;
  createView: boolean;

  params: any;

  private sub: any;

  generalForm: FormGroup = new FormGroup({
    $key: new FormControl(null),
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    dependency: new FormControl('', [Validators.required]),
    resGroup: new FormControl(),
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
    value: new FormControl({value: '000', disabled: true}, [Validators.required])
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

  goToBudget() {
    const general = this.generalForm.controls;

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const activity: AcademicActivity = {
      id: (this.activityService.activities.length + 1),
      name: this.generalForm.controls['name'].value,
      coordinatorEmail: this.generalForm.controls['email'].value,
      coordinatorName: this.generalForm.controls['coordinator'].value,
      coordinatorPhone: this.generalForm.controls['phone'].value,
      creationDate: today,
      dependency: this.generalForm.controls['dependency'].value,
      duration: this.generalForm.controls['duration'].value,
      state: 'created',
      type: this.generalForm.controls['type'].value,
      investigationGroup: this.generalForm.controls['resGroup'].value
    };
    this.activityService.activity = activity;
    this.router.navigate([`inicio/portafolio/crear/presupuesto`]);
  }

  anyError() {
    return false;
  }

  cancel() {
    this.router.navigate(['inicio/portafolio']);
  }

  /** createActivity() {
    this.router.navigate['inicio/cohortes/crear'];
  }**/

  constructor(private router: Router, private route: ActivatedRoute, private activityService: ActivityService) { }

  ngOnInit() {
    let activity: AcademicActivity = this.activityService.activity;
    this.currentActivity = activity;
    this.sub = this.route.params.subscribe(params => { this.params = params });

    this.createView = this.router.url.includes('crear');

    if(!activity && !this.createView)
      activity = this.activityService.activities[parseInt(this.params['code']) - 1];

    if(!this.createView) {
      let form: FormGroup = this.generalForm;
      form.controls['name'].setValue(activity.name);
      form.controls['type'].setValue(activity.type);
      form.controls['dependency'].setValue(activity.dependency);
      form.controls['resGroup'].setValue(activity.investigationGroup || '');
      form.controls['coordinator'].setValue(activity.coordinatorName);
      form.controls['phone'].setValue(activity.coordinatorPhone);
      form.controls['email'].setValue(activity.coordinatorEmail);
      form.controls['duration'].setValue(activity.duration);
    }
  }

  data: any[] = [];

  onFileChange(evt: any) {
    this.data = [];
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    const data = [];

    for(let i = 0; i < target.files.length; i++) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data.push(XLSX.utils.sheet_to_json(ws, {header: 1}));
        this.setFormData(data, i);
        this.data = data;
      };
      reader.readAsBinaryString(target.files[i]);
    }
  }

  setFormData(data: Array<Array<Array<any>>>, i: number) {
    if(data[i][0][1]) {
      if(data[i][0][1].toString() == TEACHER_INFO_FORMAT) {
        console.log(data[i][0][1]);
        return;
      } else if(data[i][0][1] == START_FORMAT) {
        this.setStartFormat(data[i]);
        return;
      }
    }

    if(data[i][0][3]) {
      if(data[i][0][3].toString() == BUDGET_FORMAT) {
        console.log(data[i][0][3]);
        return;
      }
    }

    if(data[i][0][6]) {
      if(data[i][0][6].toString() == TIMELINE_FORMAT) {
        console.log(data[i][0][6]);
        return;
      }
    }

    console.log('No se reconoce el formato que quieres importar :(');
  }

  setStartFormat(data: Array<Array<any>>) {
    const controls: { [key: string]: AbstractControl } = this.generalForm.controls;
    const name = data[12][1] ? data[12][1].toString() : '';
    const type = this.getTypeOfActivity(data);
    const dependency = data[17][1] ? data[17][1].toString() : '';
    const resGroup = data[18][1] ? data[18][1].toString() : '';
    const coordinator = data[19][1] ? data[19][1].toString() : '';
    const phone = data[20][1] ? this.parseNumber(data[20][1].toString()) : '';
    const email = data[20][7] ? data[20][7].toString() : '';
    const duration = data[24][0] ? this.parseNumber(data[24][0].toString()) : '';
    controls['name'].setValue(name);
    controls['type'].setValue(type);
    controls['dependency'].setValue(dependency);
    controls['resGroup'].setValue(resGroup);
    controls['coordinator'].setValue(coordinator);
    controls['phone'].setValue(phone);
    controls['email'].setValue(email);
    controls['duration'].setValue(duration);
  }

  getTypeOfActivity(data: Array<Array<any>>): string {
      return  data[14][1] ? this.types[0]:
              data[14][5] ? this.types[1]:
              data[15][1] ? this.types[2]:
              data[15][5] ? this.types[3] : '';
  }

  parseNumber(number: string): number {
    const regExp = /\d+/g;
    return parseInt(number.match(regExp).join(''));
  }

  console() {
    console.log(this.data);
  }

  createActivity() {
    const user: User = {
      email: 'juanfgallo94@gmail.com',
      id: 8,
      idType: 'Cedula de Ciudadania',
      lastName: 'Gallo',
      name: 'Juan'
    }

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const activity: AcademicActivity = {
      id: (this.activityService.activities.length + 1),
      name: this.generalForm.controls['name'].value,
      coordinatorEmail: this.generalForm.controls['email'].value,
      coordinatorName: this.generalForm.controls['coordinator'].value,
      coordinatorPhone: this.generalForm.controls['phone'].value,
      creationDate: today,
      dependency: this.generalForm.controls['dependency'].value,
      duration: this.generalForm.controls['duration'].value,
      state: 'created',
      type: this.generalForm.controls['type'].value,
      user: user,
      investigationGroup: this.generalForm.controls['resGroup'].value
    };
    this.activityService.activities.unshift(activity);
    this.router.navigate(['inicio/portafolio']);
  }

}

export function dateFromXlToJs(xlDate: number): Date {
  return new Date((xlDate - (25567 + 1))*86400*1000);
}

export const TEACHER_INFO_FORMAT = "Solicitud de información Docentes";
export const BUDGET_FORMAT = "PRESUPUESTO EDUCACIÓN CONTINUA ";
export const START_FORMAT = "ACTA DE INICIO ";
export const TIMELINE_FORMAT = "CRONOGRAMA DE SERVICIOS EDUCACIÓN CONTINUA";