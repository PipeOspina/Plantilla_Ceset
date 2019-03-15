import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import { AppRoutingModule } from './app-routing/app-routing.module';
import {
  MatSidenavModule,
  MatInputModule,
  MatButtonModule,
  MatDatepickerModule,
  MatCardModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule,
  MatProgressBar,
  MatProgressBarModule,
  MatFormFieldModule,
  MatIconModule,
  MatOptionModule,
  MatAutocompleteModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatPaginatorIntl,
  MatSortModule,
  MatExpansionModule,
  MatTooltipModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from './auth/auth-guard.service';
import { CifradoService } from './servicios/cifrado.service';

import { RestangularModule, Restangular } from 'ngx-restangular';
import { RestangularConfigFactory } from './auth/restConfig';
import { InicioRoutingModule } from './componentes/inicio/inicio-routing.module';
import { JwtService } from './servicios/jwt.service';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { LoginComponent } from './componentes/login/login.component';
import { RegisterComponent } from './componentes/register/register.component';
import { RolService }from './servicios/rol.service';
import { UserService }from './servicios/user.service';
import { NotificationCardComponent } from './componentes/notification-card/notification-card.component';
import { ActivityListComponent, MatPaginatorIntlSpanish } from './componentes/activity-list/activity-list.component';
import { ActivityDetailComponent } from './componentes/activity-detail/activity-detail.component';
import { BudgetComponent } from './componentes/budget/budget.component';
import { BudgetItemComponent } from './componentes/budget-item/budget-item.component';
import { DialogConfirmarComponent } from './componentes/dialog-confirmar/dialog-confirmar.component';
import { DialogBudgetItemComponent } from './componentes/dialog-budget-item/dialog-budget-item.component';
import { DialogFinancialAnalysisComponent } from './componentes/dialog-financial-analysis/dialog-financial-analysis.component';
import { DialogDiscountComponent } from './componentes/dialog-discount/dialog-discount.component';
import { RoleComponent } from './componentes/role/role.component';
import { DialogConfirmComponent } from './componentes/dialog-confirm/dialog-confirm.component';
import { ActivityService } from './servicios/activity.service';
import { PersonService } from './servicios/person.service';
import { ThemeListComponent } from './componentes/theme-list/theme-list.component';
import { DialogThemeComponent } from './componentes/dialog-theme/dialog-theme.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    NotificationCardComponent,
    ActivityListComponent,
    ActivityDetailComponent,
    BudgetComponent,
    BudgetItemComponent,
    DialogBudgetItemComponent,
    DialogFinancialAnalysisComponent,
    DialogDiscountComponent,
    RoleComponent,
    DialogConfirmComponent,
    ThemeListComponent,
    DialogThemeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSelectModule,
    InicioRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    RestangularModule.forRoot( [JwtService], RestangularConfigFactory),
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatCheckboxModule,
    MatCardModule,
    RecaptchaModule.forRoot(),
    MatListModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  providers: [
    CifradoService,
    AuthGuard,
    JwtService,
    RolService,
    ActivityService,
    PersonService,
    UserService,
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlSpanish
    }
  ],
  entryComponents: [
    DialogBudgetItemComponent,
    DialogFinancialAnalysisComponent,
    DialogDiscountComponent,
    DialogConfirmComponent,
    DialogThemeComponent
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
