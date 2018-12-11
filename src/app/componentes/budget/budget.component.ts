import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatDialog} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogFinancialAnalysisComponent } from '../dialog-financial-analysis/dialog-financial-analysis.component';
import { DialogDiscountComponent } from '../dialog-discount/dialog-discount.component';
import { ActivityService } from '../../servicios/activity.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  displayedColumns = ['name', 'value'];

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

  udeaContributions: Item[] = [
    { id: 0, name: 'Manejo y Costos Administración (10%)', value: 0 },
    { id: 1, name: 'Educación Continua', value: 0 }
  ];

  engContributions: Item[] = [
    { id: 0, name: 'Educación Continua', value: 0 }
  ];

  budgetDataSource = new MatTableDataSource(this.budgetData);
  contrUdeaDataSource = new MatTableDataSource(this.udeaContributions);
  contrEngDataSource = new MatTableDataSource(this.engContributions);

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private activityService: ActivityService) {
  }

  parseValue(value: number) {
    return parseValue(value);
  }

  goToBudgetItem(id: number) {
    let page: string;
    switch (id) {
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
    }
    this.router.navigate([`inicio/actividades/editar/${this.params['code']}/presupuesto/${page}`]);
  }

  showFinancialAnalysis() {
    let dialogRef = this.dialog.open(DialogFinancialAnalysisComponent, {} );
  }

  showDiscount() {
    let dialogRef = this.dialog.open(DialogDiscountComponent, {} );
  }

  subTotal: number = 0;
  unexpect: number = 0;
  total: number = 0;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => { this.params = params });
    const budget = this.activityService.activities[this.params['code'] - 1].budget;
    for(let i = 0; i < budget.items.length; i++){
      this.budgetData[i].value = budget.items[i].total != null ? budget.items[i].total : 0;
      this.subTotal += this.budgetData[i].value;
    }

    this.unexpect = Math.round(this.subTotal * 0.03);
    this.total = this.subTotal + this.unexpect;

    this.udeaContributions[0].value = Math.round((this.subTotal - this.budgetData[0].value) * 0.1);
    this.udeaContributions[1].value = Math.round(this.total * 0.06);

    this.engContributions[0].value = Math.round(this.total * 0.14);

    budget.subTotal = this.subTotal;
    budget.total = this.total;
    budget.unexpected = this.unexpect;
    
    this.activityService.activities[this.params['code'] - 1].budget = budget;
  }

}

export interface Item {
  id: number;
  name: string;
  value: number;
}

export function parseValue(value: number): string {
  const strValue: string = value.toString();
  const endSub: string = strValue.substr(strValue.length - 3, 3);
  const midSub: string = strValue.substr(strValue.length - 6, 3);
  const startMidSub: string = strValue.substr(strValue.length - 9, 3);
  const startSub: string = strValue.substr(strValue.length - 12, 3);

  if(value < 1000) {
    return strValue;
  } else if(value < 10000) {
    const auxSub: string = strValue.substr(0, 1);
    return `${auxSub}.${endSub}`;
  } else if(value < 100000) {
    const auxSub: string = strValue.substr(0, 2);
    return `${auxSub}.${endSub}`;
  } else if(value < 1000000) {
    return `${midSub}.${endSub}`;
  } else if(value < 10000000) {
    const auxSub: string = strValue.substr(0, 1);
    return `${auxSub}'${midSub}.${endSub}`;
  } else if(value < 100000000) {
    const auxSub: string = strValue.substr(0, 2);
    return `${auxSub}'${midSub}.${endSub}`;
  } else if(value < 1000000000) {
    return `${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 10000000000) {
    const auxSub: string = strValue.substr(0, 1);
    return `${auxSub}.${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 100000000000) {
    const auxSub: string = strValue.substr(0, 2);
    return `${auxSub}.${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 1000000000000) {
    return `${startSub}.${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 10000000000000) {
    const auxSub: string = strValue.substr(0, 1);
    return `${auxSub}''${startSub}.${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 100000000000000) {
    const auxSub: string = strValue.substr(0, 2);
    return `${auxSub}''${startSub}.${startMidSub}'${midSub}.${endSub}`;
  } else if(value < 1000000000000000) {
    const auxSub: string = strValue.substr(0, 3);
    return `${auxSub}''${startSub}.${startMidSub}'${midSub}.${endSub}`;
  } else {
    return strValue;
  }
}