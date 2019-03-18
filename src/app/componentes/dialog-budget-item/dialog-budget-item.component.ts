import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FooterComponent } from '../footer/footer.component';
import { BudgetItem } from '../budget-item/budget-item.component';
import { PERSONAL, MATERIAL, EQUIP, TRANSPORT, GASTRONOMY, COMERCIAL, COMUNICATION, LOCATION, SOFTWARE, OTHER, Expenditure, ITEMS } from '../../modelos/budget';
import { Item } from '../../modelos/budget';
import { ActivityService } from '../../servicios/activity.service';
import { parseValue } from '../budget/budget.component';
import { DialogConfirmComponent, YES_NO_DIALOG } from '../dialog-confirm/dialog-confirm.component';
import { AcademicActivity } from '../../modelos/academicActivity';

@Component({
  selector: 'app-dialog-budget-item',
  templateUrl: './dialog-budget-item.component.html',
  styleUrls: ['./dialog-budget-item.component.css']
})
export class DialogBudgetItemComponent implements OnInit {
  form: FormGroup;

  charged = false;
  page: number;

  currentExpenditure: Expenditure = {
    id: 1,
    comment: '',
    contrated: false,
    description: '',
    fp: 1.6,
    quantity: 0,
    total: 0,
    unityValue: 0,
    totalWithFP: 0,
    totalWithoutFP: 0,
    unityWithFP: 0,
    time: 0,
    dedication: 0
  };

  type: Item;
  timeNeeded: boolean = false;
  dedicationNeeded: boolean = false;
  fpNeeded: boolean = false;
  isEdit: boolean = false;
  isCreate: boolean = false;

  somethingChanged: boolean = false;

  sub: any;
  params: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { activity?: AcademicActivity, row?: BudgetItem, page?: any, type?: any },
    private dialogRef: MatDialogRef<DialogBudgetItemComponent>,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.charged = true;
      this.form  = new FormGroup({
        $key: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required),
        unity: new FormControl('', Validators.required),
        time: new FormControl(''),
        dedication: new FormControl(''),
        unityValue: new FormControl('', Validators.required),
        comment: new FormControl('')
      });
    }, 50);
    switch(this.data.page) {
      case 'personal':
        this.type = PERSONAL;
        this.timeNeeded = true;
        this.dedicationNeeded = true;
        this.fpNeeded = true;
        this.page = 0;
        break;
      case 'materiales':
        this.type = MATERIAL;
        this.page = 1;
        break;
      case 'equipos':
        this.type = EQUIP;
        this.timeNeeded = true;
        this.page = 2;
        break;
      case 'transporte':
        this.type = TRANSPORT;
        this.timeNeeded = true;
        this.page = 3;
        break;
      case 'gastronomia':
        this.type = GASTRONOMY;
        this.page = 4;
        break;
      case 'comercial':
        this.type = COMERCIAL;
        this.page = 5;
        break;
      case 'comunicaciones':
        this.type = COMUNICATION;
        this.page = 6;
        break;
      case 'locaciones':
        this.type = LOCATION;
        this.timeNeeded = true;
        this.page = 7;
        break;
      case 'software':
        this.type = SOFTWARE;
        this.page = 8;
        break;
      case 'otros':
        this.type = OTHER;
        this.page = 9;
        break;
      default:
        this.type = OTHER;
        this.page = 9;
        break;
    };


    if(this.data.row) {
      if(this.data.activity) {
        this.data.activity.budget.items.forEach(item => {
          if(item.expenditures) {
            item.expenditures.forEach(expenditure => {
              if(expenditure.id == this.data.row.id && item.id == this.page) {
                setTimeout(() => {
                  console.log('settimeout', expenditure);
                  this.form.controls['description'].setValue(expenditure.description);
                  this.form.controls['quantity'].setValue(expenditure.quantity);
                  this.form.controls['time'].setValue(expenditure.time);
                  this.form.controls['dedication'].setValue(expenditure.dedication * 100);
                  this.form.controls['unity'].setValue(expenditure.unity);
                  this.form.controls['unityValue'].setValue(expenditure.unityValue);
                  this.form.controls['comment'].setValue(expenditure.comment);
                  this.currentExpenditure = expenditure;
                }, 50);
              }
            });
          }
        });
      }
    }
    this.isCreate = this.data.type === 'create' ? true : false;
    this.isEdit = !this.isCreate;
  }

  parseMoney(value: number) {
    return `$${parseValue(value)}`;
  }

  selectedDescription() {
    this.somethingChanged = true;
    this.currentExpenditure.description = this.form.controls['description'].value;
  }

  selectedUnity() {
    this.somethingChanged = true;
    this.currentExpenditure.unity = this.form.controls['unity'].value;
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

  commentKeyUp() {
    this.currentExpenditure.comment = this.form.controls['comment'].value;
    this.setValues();
  }

  setValues() {
    this.somethingChanged = true;
    const current = this.currentExpenditure;
    if(this.dedicationNeeded && current.dedication != 0) {
      if(this.timeNeeded && current.time != 0) {
        this.currentExpenditure.totalWithoutFP = current.quantity * current.time * current.dedication * current.unityValue;
        if(this.fpNeeded) {
          this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
          this.currentExpenditure.totalWithFP = current.quantity * current.time * current.dedication * current.unityWithFP;
          this.currentExpenditure.total = current.quantity * current.time * current.dedication * current.unityWithFP;
        } else {
          this.currentExpenditure.total = current.quantity * current.time * current.dedication * current.unityValue;
        }
      } else {
        this.currentExpenditure.totalWithoutFP = current.quantity * current.dedication * current.unityValue;
        if(this.fpNeeded) {
          this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
          this.currentExpenditure.totalWithFP = current.quantity * current.dedication * current.unityWithFP;
          this.currentExpenditure.total = current.quantity * current.dedication * current.unityWithFP;
        } else {
          this.currentExpenditure.total = current.quantity * current.dedication * current.unityValue;
        }
      }
    } else if(this.timeNeeded && current.time != 0) {
      this.currentExpenditure.totalWithoutFP = current.quantity * current.time * current.unityValue;
      if(this.fpNeeded) {
        this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
        this.currentExpenditure.totalWithFP = current.quantity * current.time * current.unityWithFP;
        this.currentExpenditure.total = current.quantity * current.time * current.unityWithFP;
      } else {
        this.currentExpenditure.total = current.quantity * current.time * current.unityValue;
      }
    } else {
      this.currentExpenditure.totalWithoutFP = current.quantity * current.unityValue;
      if(this.fpNeeded) {
        this.currentExpenditure.unityWithFP = current.unityValue * current.fp;
        this.currentExpenditure.totalWithFP = current.quantity * current.unityWithFP;
        this.currentExpenditure.total = current.quantity * current.unityWithFP;
      } else {
        this.currentExpenditure.total = current.quantity * current.unityValue;
      }
    }
  }

  canSubmit() {
    return  !this.form.controls['description'].hasError('required') &&
            !this.form.controls['quantity'].hasError('required') &&
            !this.form.controls['unity'].hasError('required') &&
            !this.form.controls['unityValue'].hasError('required');
  }

  createItem() {
    if(this.data.activity.budget.items[this.page].expenditures) {
      let bigger: number = 0;
      this.data.activity.budget.items[this.page].expenditures.forEach(expenditure => {
        if(expenditure.id > bigger) {
          bigger = expenditure.id;
        } else {
          bigger++;
        }

        if(this.currentExpenditure.id > bigger) {
          bigger = this.currentExpenditure.id;
        } else {
          bigger++;
        }
      });
      this.currentExpenditure.id = bigger;
      console.log('bigger: ', bigger, ' id: ', this.currentExpenditure.id);
      this.currentExpenditure.approved = false;
    }

    const auxExpenditure: Expenditure = {
      approved: this.currentExpenditure.approved,
      comment: this.currentExpenditure.comment,
      contrated: this.currentExpenditure.contrated,
      dedication: this.currentExpenditure.dedication,
      description: this.currentExpenditure.description,
      eliminated: this.currentExpenditure.eliminated,
      fp: this.currentExpenditure.fp,
      id: this.currentExpenditure.id,
      logisticComment: this.currentExpenditure.logisticComment,
      quantity: this.currentExpenditure.quantity,
      realCost: this.currentExpenditure.realCost,
      time: this.currentExpenditure.time,
      total: this.currentExpenditure.total,
      totalWithFP: this.currentExpenditure.totalWithFP,
      totalWithoutFP: this.currentExpenditure.totalWithoutFP,
      unity: this.currentExpenditure.unity,
      unityValue: this.currentExpenditure.unityValue,
      unityWithFP: this.currentExpenditure.unityWithFP,
      created: true,
      first: {
        approved: this.currentExpenditure.approved,
        comment: this.currentExpenditure.comment,
        contrated: this.currentExpenditure.contrated,
        dedication: this.currentExpenditure.dedication,
        description: this.currentExpenditure.description,
        eliminated: this.currentExpenditure.eliminated,
        fp: this.currentExpenditure.fp,
        id: this.currentExpenditure.id,
        logisticComment: this.currentExpenditure.logisticComment,
        quantity: this.currentExpenditure.quantity,
        realCost: this.currentExpenditure.realCost,
        time: this.currentExpenditure.time,
        total: this.currentExpenditure.total,
        totalWithFP: this.currentExpenditure.totalWithFP,
        totalWithoutFP: this.currentExpenditure.totalWithoutFP,
        unity: this.currentExpenditure.unity,
        unityValue: this.currentExpenditure.unityValue,
        unityWithFP: this.currentExpenditure.unityWithFP,
        created: true,
        first: null
      }
    }

    this.dialogRef.close({
      data: {
        expenditure: auxExpenditure,
        page: this.page,
        id: auxExpenditure.id,
        changed: true
      }
    });
  }

  editItem() {
    this.currentExpenditure.approved = false;
    this.currentExpenditure.created = false;
    this.dialogRef.close({
      data: {
        expenditure: this.currentExpenditure,
        page: this.page,
        id: this.currentExpenditure.id,
        changed: this.somethingChanged
      }
    });
  }

  deleteItem() {
    const title = `Eliminar ${this.currentExpenditure.description}`
    const msg = `¿Está seguro que desea eliminar el gasto de <b>${this.currentExpenditure.description}</b> con valor de ${this.currentExpenditure.total}?`
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        type: YES_NO_DIALOG,
        title: title,
        message: msg
      }
    });
    dialogRef
      .afterClosed()
      .subscribe(res => {
        if(res) {
          this.currentExpenditure.eliminated = true;
          this.currentExpenditure.created = false;
          this.dialogRef.close({
            data: {
              expenditure: this.currentExpenditure,
              page: this.page,
              id: this.currentExpenditure.id,
              changed: this.somethingChanged
            }
          });
        }
      });
  }

}