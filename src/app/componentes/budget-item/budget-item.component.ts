import { Component, OnInit } from '@angular/core';
import { Item } from '../budget/budget.component';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';
import { DialogBudgetItemComponent } from '../dialog-budget-item/dialog-budget-item.component';
import { ActivityService } from '../../servicios/activity.service';
import { AcademicActivity } from '../../modelos/academicActivity';
import { PlatformLocation } from '@angular/common';
import { DialogConfirmComponent, YES_NO_DIALOG, OK_DIALOG } from '../dialog-confirm/dialog-confirm.component';
import { Expenditure } from '../../modelos/budget';

@Component({
  selector: 'app-budget-item',
  templateUrl: './budget-item.component.html',
  styleUrls: ['./budget-item.component.css']
})
export class BudgetItemComponent implements OnInit {
  itemControl = new FormControl('', [Validators.required]);
  
  displayedColumns = ['name', 'quant', 'value', 'cost'];

  sub: any;
  params: any;

  budgetData: Item[]  = [
    { id: 0, name: 'Personal/Recurso Humano', value: 1234567890 },
    { id: 1, name: 'Materiales/Suministros/Obra Fisica', value: 0 },
    { id: 2, name: 'Equipos/Maquinaria', value: 0 },
    { id: 3, name: 'Transporte/Sostenimiento en Campo', value: 0 },
    { id: 4, name: 'Gastronomía', value: 0 },
    { id: 5, name: 'Estrategia Comunicacional/Comercial', value: 0 },
    { id: 6, name: 'Comunicaciones', value: 0 },
    { id: 7, name: 'Locaciones', value: 0 },
    { id: 8, name: 'Software', value: 0 },
    { id: 9, name: 'Otros', value: 0 }
  ];

  budgetItemData: BudgetItem[] = [];

  budgetItemDataSource = new MatTableDataSource(this.budgetItemData);

  isOtherSelected = false;

  showDataForm() {
    let page: string;
    switch (this.itemControl.value) {
      case 0:
        page = 'personal';
        break;
      case 1:
        page = 'materiales';
        break;
      case 2:
        page = 'equipos';
        break;
      case 3:
        page = 'transporte';
        break;
      case 4:
        page = 'gastronomia';
        break;
      case 5:
        page = 'comercial';
        break;
      case 6:
        page = 'comunicaciones';
        break;
      case 7:
        page = 'locaciones';
        break;
      case 8:
        page = 'software';
        break;
      case 9:
        page = 'otros';
        break;
      default:
        page = 'otros';
        break;
    };
    if(this.router.url != `/inicio/portafolio/crear/presupuesto/${this.params['budgetItem']}`) {
      if(page !== this.params['budgetItem']) {
        this.router.navigate([`inicio/portafolio/editar/${this.params['code']}/presupuesto/${page}`]);
        this.isOtherSelected = true;
      }
    } else {
      if(page !== this.params['budgetItem']) {
        this.router.navigate([`inicio/portafolio/crear/presupuesto/${page}`]);
        this.isOtherSelected = true;
      }
    }
  }

  somethinThere;

  auxId = 0;

  openDialog(type: string, row: any) {
    console.log(this.budgetItemDataSource.data);
    const dialogRef = this.dialog.open(DialogBudgetItemComponent, {
      data: {
        page: this.params['budgetItem'],
        type: type,
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      /*this.budgetItemData.push({
        id: this.auxId,
        name: result.data.controls['description'].value,
        quantity: result.data.controls['quantity'].value,
        realCost: 0,
        value: result.data.controls['unityValue'].value
      });

      this.budgetItemDataSource.data = this.budgetItemData;
      console.log(this.budgetItemDataSource.data);
      console.log(this.budgetItemData, ' el console log'); 
      this.somethinThere = true;*/
      const data: Expenditure = result.data.expenditure;

      if(result) {
        this.budgetItemData = [];
        if(this.currentActivity.budget.items[this.getPage()].expenditures) {
          this.currentActivity.budget.items[this.getPage()].expenditures.push(data);
        } else {
          this.currentActivity.budget.items[this.getPage()].expenditures = [data];
        }
    
        let auxBudgetItemData: BudgetItem[] = [];
        
        this.currentActivity.budget.items[this.getPage()].expenditures.forEach(expenditure => {
          const budgetItem: BudgetItem = {
            id: this.auxId,
            name: expenditure.description,
            quantity: expenditure.quantity,
            realCost: 0,
            value: expenditure.total
          };

          console.log(expenditure.description);

          auxBudgetItemData.push(budgetItem);
        });

        this.budgetItemData = auxBudgetItemData;
        this.budgetItemDataSource = new MatTableDataSource(auxBudgetItemData);

        this.somethinThere = true;

        console.log(this.budgetItemData);

        this.auxId++;
      } else {
        console.log('no hubo resultado');
      }
    });
  }

  backClicked = false;

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private activityService: ActivityService, public location: PlatformLocation) {
    this.location.onPopState(() => {
      if(this.isOtherSelected && !this.backClicked) {
        dialog.open(DialogConfirmComponent, {
          data: {
            type: OK_DIALOG,
            title: 'Atras',
            message: 'Click en el botón <b>Volver</b> para deshacer los cambios'
          }
        })
          .afterClosed()
          .subscribe(res => {
            res || res == undefined ? this.backClicked = false : null;
          });
      }
      this.backClicked = true;
    });
  }

  back() {
    this.router.navigate(['inicio/portafolio/crear/presupuesto']);
  }

  save() {
    this.back();
  }

  getPage() {
    let value: number;
    switch(this.params['budgetItem']) {
      case 'personal':
        value = 0;
        break;
      case 'materiales':
        value = 1;
        break;
      case 'equipos':
        value = 2;
        break;
      case 'transporte':
        value = 3;
        break;
      case 'gastronomia':
        value = 4;
        break;
      case 'comercial':
        value = 5;
        break;
      case 'comunicaciones':
        value = 6;
        break;
      case 'locaciones':
        value = 7;
        break;
      case 'software':
        value = 8;
        break;
      case 'otros':
        value = 9;
        break;
      default:
        value = 9;
        break;
    };
    return value;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => { this.params = params });
    const value = this.getPage();
    this.itemControl.setValue(value);
    if(this.params['code']){
      this.somethinThere = true;
      this.currentActivity = this.activityService.activities[this.params['code'] - 1];

      if(this.currentActivity.budget.items[value].expenditures) {
        this.exist = true;
        for(let i = 0; i < this.currentActivity.budget.items[value].expenditures.length; i++) {
          let currentExp = this.currentActivity.budget.items[value].expenditures[i]
          this.budgetItemData[i].id = i;
          this.budgetItemData[i].name = currentExp.description;
          this.budgetItemData[i].quantity = currentExp.quantity;
          this.budgetItemData[i].realCost = currentExp.realCost;
          this.budgetItemData[i].value = currentExp.total;
        }
      } else {
        this.budgetItemData = [];
      }
    } else if(this.activityService.activity) {
      this.currentActivity = this.activityService.activity;
      if(this.currentActivity.budget) {
        if(this.currentActivity.budget.items[value].expenditures) {
          this.somethinThere = true;
          this.exist = true;
          for(let i = 0; i < this.currentActivity.budget.items[value].expenditures.length; i++) {
            let currentExp = this.currentActivity.budget.items[value].expenditures[i]
            this.budgetItemData[i].id = i;
            this.budgetItemData[i].name = currentExp.description;
            this.budgetItemData[i].quantity = currentExp.quantity;
            this.budgetItemData[i].realCost = currentExp.realCost;
            this.budgetItemData[i].value = currentExp.total;
          }
        }
      } else {
        this.currentActivity.budget = {
          id: this.currentActivity.id,
          items: []
        }
      }
    } else {
      this.somethinThere = false;
    }
  }

  currentActivity: AcademicActivity;
  exist = false;

}

export interface BudgetItem {
  id: number;
  name: string;
  quantity: number;
  value: number;
  realCost: number;
}