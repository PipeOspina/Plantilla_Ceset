import { Component, OnInit, Input, Output } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AcademicActivity, createNewActivity } from '../../modelos/academicActivity';
import { ActivityService } from '../../servicios/activity.service';
import * as XLSX from 'xlsx';
import { User } from '../../modelos/user';
import { parseValue } from '../budget/budget.component';
import { PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER, Budget, ITEMS, Expenditure } from '../../modelos/budget';
import { MatDialog } from '@angular/material';
import { DialogConfirmComponent, OK_DIALOG } from '../dialog-confirm/dialog-confirm.component';

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

    if(!this.activityService.activity) {
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
    } else {
      this.activityService.activity = {
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
        investigationGroup: this.generalForm.controls['resGroup'].value,
        budget: this.activityService.activity.budget
      }
    }

    if(this.createView)
      this.router.navigate([`inicio/portafolio/crear/presupuesto`]);
    else
      this.router.navigate([`inicio/portafolio/editar/${this.params['code']}/presupuesto`]);
  }

  anyError() {
    return false;
  }

  cancel() {
    this.activityService.activity = null;
    this.router.navigate(['inicio/portafolio']);
  }

  /** createActivity() {
    this.router.navigate['inicio/cohortes/crear'];
  }**/

  constructor(private router: Router, private route: ActivatedRoute, private activityService: ActivityService, public dialog: MatDialog) { }

  ngOnInit() {
    let activity: AcademicActivity = this.activityService.activity;
    this.currentActivity = activity;
    this.sub = this.route.params.subscribe(params => { this.params = params });

    this.createView = this.router.url.includes('crear');

    if(!activity && !this.createView) {
      activity = this.activityService.activities[parseInt(this.params['code']) - 1];
    }

    if(activity) {
      let form: FormGroup = this.generalForm;
      form.controls['name'].setValue(activity.name);
      form.controls['type'].setValue(activity.type);
      form.controls['dependency'].setValue(activity.dependency);
      form.controls['resGroup'].setValue(activity.investigationGroup || '');
      form.controls['coordinator'].setValue(activity.coordinatorName);
      form.controls['phone'].setValue(activity.coordinatorPhone);
      form.controls['email'].setValue(activity.coordinatorEmail);
      form.controls['duration'].setValue(activity.duration);
      if(activity.budget) {
        if(activity.budget.total && !this.createView) {
          const budgetForm: FormGroup = this.budgetForm;
          budgetForm.controls['value'].setValue(`$ ${parseValue(activity.budget.total)}`);
        }
      }
    }
  }

  submit() {
    this.router.navigate(['inicio/portafolio']);
  }

  data: any[] = [];

  onFileChange(evt: any) {
    this.data = [];
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    const data = [];

    let msg = '';
    let title;

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
        const ret = this.setFormData(data, i);
        if(ret.canImport) {
          msg += ret.msg + '<br>';
          if(ret.name) {
            title = ret.name;
          }
        }
        this.data = data;
      };
      reader.readAsBinaryString(target.files[i]);
    }

    setTimeout(() => {
      if(!title) {
        title = 'Importar Documentos'
      }

      this.dialog.open(DialogConfirmComponent, {
        data: {
          message: msg,
          title: title,
          type: OK_DIALOG
        }
      });
    }, 1000);
  }

  setFormData(data: Array<Array<Array<any>>>, i: number): {msg:string, canImport: boolean, name?: any} {
    if(data[i][0][1]) {
      if(data[i][0][1].toString() == TEACHER_INFO_FORMAT) {
        console.log(data[i][0][1]);
        return;
      } else if(data[i][0][1] == START_FORMAT) {
        return this.setStartFormat(data[i]);
      }
    }

    if(data[i][0][3]) {
      if(data[i][0][3].toString() == BUDGET_FORMAT) {
        return this.setBudgetFormat(data[i]);
      }
    }

    if(data[i][0][6]) {
      if(data[i][0][6].toString() == TIMELINE_FORMAT) {
        console.log(data[i][0][6]);
        return;
      }
    }
    return {msg: '<h2>No se reconoce el Formato que deseas Importar :(</h2>', canImport: false}
  }

  setBudgetFormat(data: Array<Array<any>>): {msg: string, canImport: boolean} {
    PERSONAL.expenditures = [];
    MATERIAL.expenditures = [];
    EQUIP.expenditures = [];
    TRANSPORT.expenditures = [];
    GASTRONOMY.expenditures = [];
    COMERCIAL.expenditures = [];
    COMUNICATION.expenditures = [];
    LOCATION.expenditures = [];
    SOFTWARE.expenditures = [];
    OTHER.expenditures = [];

    const items = [
      PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER
    ]

    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    if(!this.activityService.activity) {
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
    } else {
      this.activityService.activity = {
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
        investigationGroup: this.generalForm.controls['resGroup'].value,
        budget: this.activityService.activity.budget
      }
    }

    this.activityService.activity.budget = {
      id: this.activityService.activity.id,
      items: items
    }

    this.currentActivity = this.activityService.activity;
    
    let ii = 19;
    let sumas = 0;
    for(let i = 0; i < 10; i++) {
      for(let j = 0; j < 19; j++){
        if((i == 1 && j == 0) || (i == 3 && j == 0) || (i == 9 && j == 0)) {
          sumas += 5;
        } else if(j == 0 && i != 0) {
          sumas += 6;
        }

        ii = ((19 * (i + 1)) + j + sumas);

        if(data[ii][2] && data[ii][3] && data[ii][4] && data[ii][7]) {
          console.log(data[ii]);
          const isFP = data[ii][9] ? true : false;
          const isTime = data[ii][5] ? true : false;
          const isDedication = data[ii][6] ? true : false;
          let unityWithFP = 0;
          let totalWithFP = 0;
          let totalWithoutFP = 0;
          let total = 0;

          if(isDedication) {
            if(isTime) {
              totalWithoutFP = data[ii][3] * data[ii][5] * data[ii][6] * data[ii][7];
              if(isFP) {
                unityWithFP = data[ii][7] * data[ii][9];
                totalWithFP = data[ii][3] * unityWithFP * data[ii][5] * data[ii][6];
                total = totalWithFP;
              } else {
                total = totalWithoutFP;
              }
            } else {
              totalWithoutFP = data[ii][3] * data[ii][6] * data[ii][7]
              if(isFP) {
                unityWithFP = data[ii][7] * data[ii][9];
                totalWithFP = data[ii][3] * unityWithFP * data[ii][6];
                total = totalWithFP;
              } else {
                total = totalWithoutFP;
              }
            }
          } else if(isTime) {
            totalWithoutFP = data[ii][3] * data[ii][5] * data[ii][7];
            if(isFP) {
              unityWithFP = data[ii][7] * data[ii][9];
              totalWithFP = data[ii][3] * unityWithFP * data[ii][5];
              total = totalWithFP;
            } else {
              total = totalWithoutFP;
            }
          } else {
            totalWithoutFP = data[ii][3] * data[ii][7];
            if(isFP) {
              unityWithFP = data[ii][7] * data[ii][9];
              totalWithFP = data[ii][3] * unityWithFP;
              total = totalWithFP;
            } else {
              total = totalWithoutFP;
            }
          }

          const currentExp: Expenditure = {
            description: data[ii][2],
            quantity: data[ii][3],
            unity: data[ii][4],
            unityValue: data[ii][7],
            comment: data[ii][12] ? data[ii][12] : '',
            contrated: false,
            id: data[ii][1],
            approved: true,
            created: false,
            dedication: data[ii][6] ? data[ii][6] : 0,
            eliminated: false,
            fp: data[ii][9] ? data[ii][9] : 0,
            logisticComment: '',
            time: data[ii][5] ? data[ii][5] : 0,
            realCost: 0,
            total: total,
            totalWithFP: totalWithFP,
            totalWithoutFP: totalWithoutFP,
            unityWithFP: unityWithFP,
            first: {
              description: data[ii][2],
              quantity: data[ii][3],
              unity: data[ii][4],
              unityValue: data[ii][7],
              comment: data[ii][12] ? data[ii][12] : '',
              contrated: false,
              id: data[ii][1],
              approved: true,
              created: false,
              dedication: data[ii][6] ? data[ii][6] : 0,
              eliminated: false,
              fp: data[ii][9] ? data[ii][9] : 0,
              logisticComment: '',
              time: data[ii][5] ? data[ii][5] : 0,
              realCost: 0,
              total: total,
              totalWithFP: totalWithFP,
              totalWithoutFP: totalWithoutFP,
              unityWithFP: unityWithFP,
              first: null
            }
          }
          if(this.currentActivity.budget.items[i].expenditures) {
            this.currentActivity.budget.items[i].expenditures.push(currentExp);
          } else {
            this.currentActivity.budget.items[i].expenditures = [currentExp];
          }
        }
      }
    }

    let msg: string = '';
    let count = 0;
    this.currentActivity.budget.items.forEach(item => {
      if(item.expenditures) {
        if(item.expenditures.length == 0) {
          count++;
        }
      }
    });

    if(count != 0) {
      let total = 0;
      msg = `<h3>Se ha importado el presupuesto con:</h3>`
      this.currentActivity.budget.items.forEach(item => {
        if(item.expenditures.length > 0) {
          let cost = 0;
          item.expenditures.forEach(expenditure => {
            cost += expenditure.total;
            total += expenditure.total;
          });
          msg += `- <b>${item.name}</b> por valor de <b>$ ${parseValue(cost)}</b><br>`
        }
      });
      this.budgetForm.controls['value'].setValue(`$ ${parseValue(total  + Math.round(total * 0.03))}`);
      return {msg: msg, canImport: true};
    } else {
      return {msg: 'No se ha detectado ningun rubro o gasto en el presupuesto', canImport: false}
    }
  }

  setStartFormat(data: Array<Array<any>>): {msg:string, canImport: boolean, name?: any} {
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

    const controlsContract: { [key: string]: AbstractControl } = this.contractForm.controls;
    const typeContract = data[28][0] ? data[28][0] : '';
    const entity = data[28][1] ? data[28][1] : '';
    const startDateContract = data[28][4] ? dateFromXlToJs(data[28][4]) : '';
    const finishDateContract = data[28][7] ? dateFromXlToJs(data[28][7]) : '';
    controlsContract['type'].setValue(typeContract);
    controlsContract['entity'].setValue(entity);
    controlsContract['startDate'].setValue(startDateContract);
    controlsContract['endDate'].setValue(finishDateContract);

    const controlsCofinance: { [key: string]: AbstractControl } = this.cofinancingForm.controls;
    if(data[34][1]) {
      const entityCofinance = data[34][4] ? data[34][4] : '';
      const concept = data[34][6] ? data[34][6] : '';
      const value = data[34][8] ? data[34][8] : '';
      controlsCofinance['entity'].setValue(entityCofinance);
      controlsCofinance['concept'].setValue(concept);
      controlsCofinance['value'].setValue(value);
    }

    const controlsCohort: { [key: string]: AbstractControl } = this.cohortForm.controls;
    const startDateCohort = data[24][1] ? dateFromXlToJs(data[24][1]) : '';
    const finishDateCohort = data[24][6] ? dateFromXlToJs(data[24][6]) : '';
    const REUNE = data[9][3] ? data[9][3] : '';
    const SIGEP = data[10][3] ? data[10][3] : '';
    controlsCohort['startDate'].setValue(startDateCohort);
    controlsCohort['endDate'].setValue(finishDateCohort);
    controlsCohort['reuneCode'].setValue(REUNE);
    controlsCohort['sigepCode'].setValue(SIGEP);

    if(this.currentActivity) {
      this.currentActivity.contract = {
        creationDate: new Date(),
        endDate: finishDateContract,
        entity: entity,
        startDate: startDateContract,
        type: typeContract
      }

      if(this.currentActivity.budget) {
        this.currentActivity.budget.cofinancing = {
          concept: controlsCofinance['concept'].value,
          entity: controlsCofinance['entity'].value,
          value: parseFloat(controlsCofinance['value'].value != '' ? controlsCofinance['value'].value : 0)
        }
      }

      this.currentActivity.activityCohort = {
        endDate: finishDateCohort,
        reune: REUNE,
        sigep: SIGEP,
        startDate: startDateCohort
      }
    }

    if(data[12][1]) {
      return {msg: `<h3>Se han importado los datos de <b>"${name}"</b><h3>`, canImport: true, name: name};
    } else {
      return {msg: '<h3>Se han importado los datos de la actividad<h3>', canImport: true};
    }
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