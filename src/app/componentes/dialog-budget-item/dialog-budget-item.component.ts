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
import { DialogConfirmComponent, YES_NO_DIALOG } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-dialog-budget-item',
  templateUrl: './dialog-budget-item.component.html',
  styleUrls: ['./dialog-budget-item.component.css']
})
export class DialogBudgetItemComponent implements OnInit {
  form: FormGroup;

  charged = false;

  currentExpenditure: Expenditure = {
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

    this.isCreate = this.data.type === 'create' ? true : false;
    this.isEdit = !this.isCreate;
  }

  parseMoney(value: number) {
    return `$${parseValue(value)}`;
  }

  selected() {
    this.currentExpenditure.description = this.form.controls['description'].value;
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
    this.dialogRef.close({
      data: {
        expenditure: this.currentExpenditure,
        page: this.data.page
      }
    });
  }

  ngOnDestroy() {
    //Falta refinar :)
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
        res ? this.dialogRef.close() : null;
      });
  }

}