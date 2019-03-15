import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FooterComponent } from '../footer/footer.component';
import { BudgetItem } from '../budget-item/budget-item.component';
import { PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER, Expenditure } from '../../modelos/budget';
import { Item } from '../../modelos/budget';
import { ActivityService } from '../../servicios/activity.service';
import { parseValue } from '../budget/budget.component';

@Component({
  selector: 'app-dialog-budget-item',
  templateUrl: './dialog-budget-item.component.html',
  styleUrls: ['./dialog-budget-item.component.css']
})
export class DialogBudgetItemComponent implements OnInit {
  form: FormGroup;

  charged = false;

  currentExpenditure: Expenditure;

  type: Item;
  timeNeeded: boolean = false;
  dedicationNeeded: boolean = false;
  fpNeeded: boolean = false;
  isEdit: boolean = false;
  isCreate: boolean = false;

  sub: any;
  params: any;

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogBudgetItemComponent>, private activityService: ActivityService) { }

  ngOnInit() {
    setTimeout(() => {
      this.charged = true;
      this.form  = new FormGroup({
        $key: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        unity: new FormControl('', Validators.required),
        time: new FormControl('', Validators.required),
        dedication: new FormControl('', Validators.required),
        unityValue: new FormControl('', Validators.required),
        comment: new FormControl('', Validators.required)
      });
    }, 50);
    switch(this.data.page) {
      case 'personal':
        this.type = PERSONAL;
        this.timeNeeded = true;
        this.dedicationNeeded = true;
        this.fpNeeded = true;
        break;
      case 'materiales':
        this.type = MATERIAL;
        break;
      case 'equipos':
        this.type = EQUIP;
        this.timeNeeded = true;
        break;
      case 'transporte':
        this.type = TRANSPORT;
        this.timeNeeded = true;
        break;
      case 'gastronomia':
        this.type = GASTRONOMY;
        break;
      case 'comercial':
        this.type = COMERCIAL;
        break;
      case 'comunicaciones':
        this.type = COMUNICATION;
        break;
      case 'locaciones':
        this.type = LOCATION;
        this.timeNeeded = true;
        break;
      case 'software':
        this.type = SOFTWARE;
        break;
      case 'otros':
        this.type = OTHER;
        break;
      default:
        this.type = OTHER;
        break;
    };

    this.currentExpenditure = {
      comment: '',
      contrated: false,
      description: '',
      fp: 1.6,
      quantity: 0,
      total: 0,
      unityValue: 0,
      totalWithFP: 0,
      totalWithoutFP: 0,
      unityWithFP: 0
    }

    this.isCreate = this.data.type === 'create' ? true : false;
    this.isEdit = !this.isCreate;
  }

  parseMoney(value: number) {
    return `$${parseValue(value)}`;
  }

  quantityKeyUp() {
    this.currentExpenditure.quantity = isNaN(parseInt(this.form.controls['quantity'].value)) ? 0 : parseInt(this.form.controls['quantity'].value);
    this.setValues();
  }

  timeKeyUp() {
    this.currentExpenditure.time = isNaN(parseInt(this.form.controls['time'].value)) ? 0 : parseInt(this.form.controls['time'].value);
    this.setValues();
  }

  dedicationKeyUp() {
    this.currentExpenditure.dedication = isNaN(parseInt(this.form.controls['dedication'].value)) ? 0 : parseInt(this.form.controls['dedication'].value) / 100;
    this.setValues();
  }

  unityValueKeyUp() {
    this.currentExpenditure.unityValue = isNaN(parseFloat(this.form.controls['unityValue'].value)) ? 0 : parseFloat(this.form.controls['unityValue'].value);
    this.setValues();
  }

  setValues() {
    const current = this.currentExpenditure;
    if(current.time && current.dedication && current.unityValue) {
      this.currentExpenditure.totalWithoutFP = current.quantity * current.time * current.dedication * current.unityValue;
      if(current.fp) {
        this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
        this.currentExpenditure.totalWithFP = current.quantity * current.time * current.dedication * current.unityWithFP;
        this.currentExpenditure.total = current.quantity * current.time * current.dedication * current.unityWithFP;
      } else {
        this.currentExpenditure.totalgi = current.quantity * current.time * current.dedication * current.unityValue;
      }
    } else if(current.time) {
      this.currentExpenditure.totalWithoutFP = current.quantity * current.time * current.unityValue;
      if(current.fp) {
        this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
        this.currentExpenditure.totalWithFP = current.quantity * current.time * current.unityWithFP;
        this.currentExpenditure.total = current.quantity * current.time * current.unityWithFP;
      } else {
        this.currentExpenditure.total = current.quantity * current.time * current.unityValue;
      }
    } else {
      this.currentExpenditure.totalWithoutFP = current.quantity * current.unityValue;
      if(current.fp) {
        this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
        this.currentExpenditure.totalWithFP = current.quantity * current.unityWithFP;
        this.currentExpenditure.total = current.quantity * current.unityWithFP;
      } else {
        this.currentExpenditure.total = current.quantity * current.unityValue;
      }
    }
  }

  createItem() {
    let data: Expenditure = {
      comment: this.form.controls['comment'].value,
      contrated: false,
      description: this.form.controls['description'].value,
      quantity: this.form.controls['quantity'].value,
      unityValue: this.form.controls['unity'].value,
      total: 0
    }

    this.dialogRef.close({
      data: data});
  }

  deleteItem() {
    let dialogRef = this.dialog.open(FooterComponent, {
      data: {
        page: this.params['budgetItem']
      }
    });
  }

}