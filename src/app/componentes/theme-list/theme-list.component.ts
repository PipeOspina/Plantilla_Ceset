import { Component, OnInit } from '@angular/core';
import { Item } from '../budget/budget.component';
import { BudgetItem } from '../budget-item/budget-item.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivityService } from '../../servicios/activity.service';
import { AcademicActivity } from '../../modelos/academicActivity';
import { DialogThemeComponent } from '../dialog-theme/dialog-theme.component';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.css']
})
export class ThemeListComponent implements OnInit {

  itemControl = new FormControl('', [Validators.required]);

  displayedColumns = ['name', 'quant', 'value'];
  
  sub: any;
  params: any;

  showDataForm() {
    if(this.itemControl.value != this.params['code'])
      this.router.navigate([`inicio/portafolio/editar/${this.itemControl.value}/temas`]);
  }

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private activityService: ActivityService) { }

  activity: AcademicActivity;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => { this.params = params });
    this.activity = this.activityService.activities[this.params['code'] - 1];
    this.itemControl.setValue(this.activity.id);
  }

  openDialog(type: String, row?) {
    let dialogRef;
    switch(type) {
      case 'create':
        break;
      case 'edit':
        dialogRef = this.dialog.open(DialogThemeComponent, {});
        break;
      default:
        break;
    }
  }

  budgetData: AcademicActivity[] = this.activityService.activities;


  budgetItemData: BudgetItem[] = [
    { id: 1, name: 'Holiwis', quantity: 1, value: 5000, realCost: 4500 }
  ]

  budgetItemDataSource = new MatTableDataSource(this.budgetItemData);

}
