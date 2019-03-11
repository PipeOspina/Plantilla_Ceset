import { Routes } from '@angular/router';
import { InicioComponent } from '../componentes/inicio/inicio.component';
import { LoginComponent } from '../componentes/login/login.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { RegisterComponent } from '../componentes/register/register.component';
import { FooterComponent } from '../componentes/footer/footer.component';
import { NotificationCardComponent } from '../componentes/notification-card/notification-card.component';
import { ActivityListComponent } from '../componentes/activity-list/activity-list.component';
import { ActivityDetailComponent } from '../componentes/activity-detail/activity-detail.component';
import { BudgetComponent } from '../componentes/budget/budget.component';
import { BudgetItemComponent } from '../componentes/budget-item/budget-item.component';
import { RoleComponent } from '../componentes/role/role.component';
import { DialogConfirmComponent } from '../componentes/dialog-confirm/dialog-confirm.component';
import { Component } from '@angular/core';
import { ThemeListComponent } from '../componentes/theme-list/theme-list.component';
import { DialogThemeComponent } from '../componentes/dialog-theme/dialog-theme.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegisterComponent
  },
  {
   path: 'inicio',
   component: InicioComponent,

   children: [
     {
       path: 'actividades',
       component: ActivityListComponent,
       canLoad: [AuthGuard] // Ubicar en las rutas necesarias
     },
     {
      path: 'actividades/crear',
      component: ActivityDetailComponent
    },
    {
     path: 'actividades/crear/presupuesto',
     component: BudgetComponent
    },
    {
     path: 'actividades/crear/presupuesto/:budgetItem',
     component: BudgetItemComponent
    },
    {
      path: 'actividades/editar/:code',
      component: ActivityDetailComponent
    },
    {
      path: 'actividades/editar/:code/temas',
      component: ThemeListComponent
    },
    {
      path: 'actividades/editar/:code/presupuesto',
      component: BudgetComponent
    },
    {
      path: 'actividades/editar/:code/presupuesto/:budgetItem',
      component: BudgetItemComponent
    },
    {
      path: 'cohortes',
      component: ActivityListComponent
    },
    {
      path: 'cohortes/crear',
      component: ActivityDetailComponent
    },
    {
      path: 'cohortes/editar/:code',
      component: ActivityDetailComponent
    },
    {
      path: 'cohortes/editar/:code/presupuesto/grupo/:group',
      component: BudgetComponent
    },
    {
      path: 'cohortes/editar/:code/presupuesto/:budgetItem/grupo/:group',
      component: BudgetItemComponent
    },
    {
      path: 'roles',
      component: RoleComponent
    }
   ]
  },
  {
    path: 'administrador',
    loadChildren: 'app/administrador/administrador.module#AdministradorModule',
    canLoad: [AuthGuard],
    data: { preload: true }
  },
  {
    path: 'dev',
    component: DialogThemeComponent
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }

];
