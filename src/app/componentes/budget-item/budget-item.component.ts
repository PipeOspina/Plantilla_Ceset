import { Component, OnInit } from '@angular/core';
import { Item, parseValue } from '../budget/budget.component';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogConfirmarComponent } from '../dialog-confirmar/dialog-confirmar.component';
import { DialogBudgetItemComponent } from '../dialog-budget-item/dialog-budget-item.component';
import { ActivityService } from '../../servicios/activity.service';
import { AcademicActivity } from '../../modelos/academicActivity';
import { PlatformLocation } from '@angular/common';
import { DialogConfirmComponent, YES_NO_DIALOG, OK_DIALOG } from '../dialog-confirm/dialog-confirm.component';
import { Expenditure, Item as ItemBudget, Budget } from '../../modelos/budget';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-budget-item',
  templateUrl: './budget-item.component.html',
  styleUrls: ['./budget-item.component.css']
})
export class BudgetItemComponent implements OnInit {
  itemControl = new FormControl('', [Validators.required]);
  
  displayedColumns = ['name', 'quant', 'value', 'cost'];
  editedItems = [];

  //changes: { id: number, page: number, first: Expenditure }[] = [];

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

  currentActivity: AcademicActivity;

  parseValue(value: string) {
    return parseValue(parseInt(value));
  }

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
    setTimeout(() => {
      if(this.router.url != `/inicio/portafolio/crear/presupuesto/${this.params['budgetItem']}`) {
        if(page !== this.params['budgetItem']) {
          this.router.navigate([`inicio/portafolio/editar/${this.params['code']}/presupuesto/${page}`]);
          this.isOtherSelected = true;
        }
      } else {
        if(page !== this.params['budgetItem']) {
          this.router.navigate([`inicio/portafolio/crear/presupuesto/${page}`]);
          this.isOtherSelected = true;
          if(this.currentActivity.budget.items[this.itemControl.value].expenditures) {
            this.setExpenditures();
            this.budgetItemDataSource = new MatTableDataSource(this.budgetItemData);
            setTimeout(() => {
              this.somethinThere = true;
            }, 100);
          } else {
            this.budgetItemDataSource = new MatTableDataSource(null);
            setTimeout(() => {
              this.somethinThere = false;
            }, 100);
          }
        }
      }
    }, 50);
  }

  somethinThere;

  openDialog(type: string, row?: BudgetItem) {
    const dialogRef = this.dialog.open(DialogBudgetItemComponent, {
      data: {
        page: this.params['budgetItem'],
        type: type,
        row: row,
        activity: this.currentActivity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        const data: Expenditure = result.data.expenditure;
        this.budgetItemData = [];
        if(this.currentActivity.budget.items[this.getPage()].expenditures) {
          if(type == 'edit') {
            this.currentActivity.budget.items[this.getPage()].expenditures.forEach(expenditure => {
              if(result.data.id == expenditure.id) {
                expenditure = data;
                if(this.activityService.changes.length == 0) {
                  this.activityService.changes.push({ id: data.id, page: this.getPage(), first: data.first });
                } else {
                  this.activityService.changes.forEach(change => {
                    if(change.id != data.id && change.page != this.getPage())
                      this.activityService.changes.push({ id: data.id, page: this.getPage(), first: data.first });
                  });
                }
              }
            })
          } else {
            this.currentActivity.budget.items[this.getPage()].expenditures.push(data);
          }
        } else {
          this.currentActivity.budget.items[this.getPage()].expenditures = [data];
        }

        console.log(data);
        console.log(this.activityService.changes);

        this.setExpenditures();
        
        this.budgetItemDataSource = new MatTableDataSource(this.budgetItemData);

        this.somethinThere = true;
        this.isSomethingNew = result.data.changed;
      }
    });
  }

  isSomethingNew = false;

  canShow(): boolean {
    let canShow = false;
    if(this.currentActivity.budget.items[this.itemControl.value].expenditures) {
      this.currentActivity.budget.items[this.itemControl.value].expenditures.forEach(expenditure => {
        if(!expenditure.eliminated) {
          canShow = true;
        }
      });
    }
    return canShow;
  }

  setExpenditures() {
    this.budgetItemData = [];

    if(this.currentActivity.budget.items[this.itemControl.value].expenditures) {
      this.currentActivity.budget.items[this.itemControl.value].expenditures.forEach(expenditure => {
        const budgetItem: BudgetItem = {
          id: expenditure.id,
          name: expenditure.description,
          quantity: expenditure.quantity,
          realCost: 0,
          value: expenditure.total
        };

        let isThere = false;
        let isEliminated = false;
        this.budgetItemData.forEach(item => {
          if(item.id == expenditure.id && !isThere) {
            isThere = true;
          }
          if(expenditure.eliminated) {
            isEliminated = true;
          }
        });

        if(!isThere && !isEliminated) {
          this.budgetItemData.push(budgetItem);
        }
      });
    }
  }

  backClicked = false;

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, public activityService: ActivityService, public location: PlatformLocation) {
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
    if(this.isSomethingNew) {
      let msgs: string[] = [];
      let prevItem: string;
      let title: string;
      this.currentActivity.budget.items.forEach(item => {
        if(item.expenditures) {
          item.expenditures.forEach(expenditure => {
            if(!expenditure.approved || expenditure.created || expenditure.eliminated) {
              title = 'Al volver, eliges deshacer los cambios en los rubros:'
              if(prevItem) {
                if(item.name != prevItem) {
                  msgs.push(`<h4>${item.name}</h4>`);
                }
              } else {
                prevItem = item.name;
                msgs.push(`<h4>${item.name}:</h4>`);
              }
              const type = expenditure.created ? '<i style="color:yellow;">Recién Creado</i>' : expenditure.eliminated ? '<i style="color:red;">Eliminado</>' : '<i>Modificado</i>';
              msgs.push(`- <b>${expenditure.description}</b> por valor de <b>$${parseValue(expenditure.total)}</b> - (${type})<br />`);
            }
          });
          prevItem = null;
        }
      });
      const msg = msgs.join('');
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          type: YES_NO_DIALOG,
          title: title,
          message: msg
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if(res) {
          this.currentActivity.budget.items.forEach(item => {
            if(item.expenditures) {
              item.expenditures = item.expenditures.filter(exp => {
                return exp.approved || !exp.created;
              });
            }
          });
          
          for(let i = 0; i < this.currentActivity.budget.items.length; i++) {
            if(this.currentActivity.budget.items[i].expenditures){
              for(let j = 0; j < this.currentActivity.budget.items[i].expenditures.length; j++) {
                if(this.currentActivity.budget.items[i].expenditures[j]){
                  this.activityService.changes.forEach(change => {
                    if(i == change.page && this.currentActivity.budget.items[i].expenditures[j].id == change.id) {
                      this.currentActivity.budget.items[i].expenditures[j] = {
                        approved: change.first.approved,
                        contrated: change.first.contrated,
                        unityValue: change.first.unityValue,
                        unity: change.first.unity,
                        time: change.first.time,
                        quantity: change.first.quantity,
                        eliminated: change.first.eliminated,
                        description: change.first.description,
                        dedication: change.first.dedication,
                        comment: change.first.comment,
                        realCost: change.first.realCost,
                        totalWithFP: change.first.totalWithFP,
                        fp: change.first.fp,
                        id: change.first.id,
                        logisticComment: change.first.logisticComment,
                        total: change.first.total,
                        totalWithoutFP: change.first.totalWithoutFP,
                        unityWithFP: change.first.unityWithFP,
                        created: change.first.created,
                        first: {
                          approved: change.first.approved,
                          contrated: change.first.contrated,
                          unityValue: change.first.unityValue,
                          unity: change.first.unity,
                          time: change.first.time,
                          quantity: change.first.quantity,
                          eliminated: change.first.eliminated,
                          description: change.first.description,
                          dedication: change.first.dedication,
                          comment: change.first.comment,
                          realCost: change.first.realCost,
                          totalWithFP: change.first.totalWithFP,
                          fp: change.first.fp,
                          id: change.first.id,
                          logisticComment: change.first.logisticComment,
                          total: change.first.total,
                          totalWithoutFP: change.first.totalWithoutFP,
                          unityWithFP: change.first.unityWithFP,
                          created: change.first.created,
                          first: null
                        }
                      }
                    }
                  })
                }
              }
            }
          }
          this.router.navigate(['inicio/portafolio/crear/presupuesto']);
        }
      });
    } else {
      this.router.navigate(['inicio/portafolio/crear/presupuesto']);
    }
  }

  save() {
    this.currentActivity.budget.items.forEach(item => {
      if(item.expenditures) {
        item.expenditures = item.expenditures.filter(exp => {
          return !exp.eliminated;
        });
        item.expenditures.forEach(expenditure => {
          expenditure.approved = true;
        });
      }
    });
    
    this.activityService.activity = this.currentActivity;
    this.router.navigate(['inicio/portafolio/crear/presupuesto']);
  }

  ngOnDestroy() {
    this.currentActivity.budget.items.forEach(item => {
      if(item.expenditures) {
        item.expenditures.forEach(expenditure => {
          item.total && expenditure.approved ? item.total += expenditure.total : item.total = expenditure.total;
        });
      }
    });
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
        this.somethinThere = true;
        this.exist = true;
        for(let i = 0; i < this.currentActivity.budget.items[value].expenditures.length; i++) {
          let currentExp = this.currentActivity.budget.items[value].expenditures[i];
          if(currentExp.approved){
            this.budgetItemData.push({
              id: currentExp.id,
              name: currentExp.description,
              quantity: currentExp.quantity,
              realCost: currentExp.realCost,
              value: currentExp.total
            });
          }
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
            let currentExp = this.currentActivity.budget.items[value].expenditures[i];
            if(currentExp.approved){
              this.budgetItemData.push({
                id: currentExp.id,
                name: currentExp.description,
                quantity: currentExp.quantity,
                realCost: currentExp.realCost,
                value: currentExp.total
              });
            }
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
    this.currentActivity.budget.items.forEach(item => {
      item.total = null;
    });
  }
  exist = false;

}

export interface BudgetItem {
  id: number;
  name: string;
  quantity: number;
  value: number;
  realCost: number;
}