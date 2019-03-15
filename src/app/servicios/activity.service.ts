import { Injectable, OnInit } from '@angular/core';
import { AcademicActivity } from '../modelos/academicActivity';
import { BudgetItem } from '../componentes/budget-item/budget-item.component';
import { Expenditure } from '../modelos/budget';

@Injectable()
export class ActivityService {
  roles;
  error;
  activities: AcademicActivity[];

  activity: AcademicActivity;

  currentBudgetItems: BudgetItem[];

  getRoles() {
    return this.roles;
  }

}
