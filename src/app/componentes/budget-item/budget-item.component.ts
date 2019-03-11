import { Component, OnInit } from '@angular/core';
import { Item } from '../budget/budget.component';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';
import { DialogBudgetItemComponent } from '../dialog-budget-item/dialog-budget-item.component';
import { ActivityService } from '../../servicios/activity.service';
import { AcademicActivity } from '../../modelos/academicActivity';

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
    if(this.router.url != `/inicio/actividades/crear/presupuesto/${this.params['budgetItem']}`) {
      if(page !== this.params['budgetItem'])
        this.router.navigate([`inicio/actividades/editar/${this.params['code']}/presupuesto/${page}`]);
    } else {
      if(page !== this.params['budgetItem'])
        this.router.navigate([`inicio/actividades/crear/presupuesto/${page}`]);
    }
  }

  auxId = 0;

  openDialog(type: string, row: any) {
    let dialogRef = this.dialog.open(DialogBudgetItemComponent, {
      data: {
        page: this.params['budgetItem'],
        type: type,
        row: row
      }
    });

    this.budgetItemData.push({
      id: 1,
      name: 'aksjdb',
      quantity: 546,
      realCost: 0,
      value: 54
    });

    let data;
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.budgetItemData.push({
        id: this.auxId,
        name: result.data.controls['description'].value,
        quantity: result.data.controls['quantity'].value,
        realCost: 0,
        value: result.data.controls['unityValue'].value
      });

      this.budgetItemDataSource.data = this.budgetItemData;
    });

    this.auxId++;
  }

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private activityService: ActivityService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => { this.params = params });
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
    this.itemControl.setValue(value);
    if(this.params['code']){
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