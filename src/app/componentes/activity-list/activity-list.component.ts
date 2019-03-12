import { Component, OnInit, ViewChild , Injectable, Output, EventEmitter} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl, MatButtonToggleGroupMultiple } from '@angular/material';
import { Router } from '@angular/router';
import { AcademicActivity, createNewActivity } from '../../modelos/academicActivity';
import { ActivityService } from '../../servicios/activity.service';
import { Restangular } from 'ngx-restangular';
import { createPerson } from '../../modelos/person';
import { createNewUserer } from '../../modelos/user';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    search: new FormControl(''),
    start: new FormControl(''),
    finish: new FormControl('')
  });

  displayedColumns = ['id', 'date', 'name', 'coordinatorName'];
  dataSource: MatTableDataSource<AcademicActivity>;
  activities: AcademicActivity[];
  auxActivities: AcademicActivity[];

  startDate: Date;
  finishDate: Date;

  searched: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private activityService: ActivityService, private restangular: Restangular) {
    const activities: AcademicActivity[] = [];
    for(let i = 0 ; i < activityService.activities.length; i++) {
      activities.push(activityService.activities[i]);
    }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(activities);
    this.activities = activities;
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  startErr;
  tryStartErr = false;

  startInput(input) {
    input.value.length == 0 ? this.startDate = null : this.startDate = new Date(input.value);
    this.applyFilter(this.form.controls['search'].value);
  }

  finishInput(input) {
    input.value.length == 0 ? this.finishDate = null :  this.finishDate = new Date(input.value);
    this.applyFilter(this.form.controls['search'].value);
  }

  clicked(row: AcademicActivity) {
    this.activityService.activity = row;
    this.router.navigate(['/inicio/actividades/editar/' + row.id]);
  }

  parseDate(date: Date) {
    const day = this.parseCero(date.getDate());
    const month = this.parseCero(date.getMonth() + 1);
    const year = this.parseCero(date.getFullYear());
    const auxDate = `${day}/${month}/${year}`;
    return auxDate;
  }

  parseCero(num: number) {
    return num < 10 ? `0${num}` : num;
  }

  applyFilter(filterValue: string) {
    filterValue ? this.searched = true : this.searched = false;
    let filterNumber: number;
    //Error de TypeScrip pero funciona por la definicion de ECMAScript 6+ isNaN(val: any), no isNaN(val: number)
    !isNaN(filterValue) ? filterNumber = parseInt(filterValue) : filterNumber = 32;

    // Resetea la fecha de hoy para ser comparable con las demas fechas de datos dummies
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    let auxiliarActivities: AcademicActivity[] = [];

    if((this.startDate > today || this.finishDate > today || (!this.startDate && !this.finishDate)) && filterNumber <= 31) {
      //this.startErr = "La fecha debe ser antes de hoy";
     // this.tryStartErr = true;
      console.log(filterNumber + ' en el if');
      this.dataSource = new MatTableDataSource(this.activities);
    } else {
      for(let i = 0 ; i < this.activities.length; i++) {
        if(filterNumber > 31) {
          if(this.activities[i].id == filterNumber) {
            auxiliarActivities = [this.auxActivities[i]];
            console.log('Es mayor a 31');
          }
        } else if((this.activities[i].creationDate >= this.startDate && this.activities[i].creationDate <= this.finishDate) ||
                  (this.activities[i].creationDate >= this.startDate && !this.finishDate) ||
                  (this.activities[i].creationDate <= this.finishDate && !this.startDate)) {
          auxiliarActivities.push(this.activities[i]);
        }
      }
      console.log(auxiliarActivities);
      this.dataSource = new MatTableDataSource(auxiliarActivities);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //Función para descartar los datos de busqueda
  clearData(input: FormControl) {
    input.setValue('');
    this.searched = false;
    if(input == this.form.controls['start']) {
      this.startDate = null;
    } else if(input == this.form.controls['finish']) {
      this.finishDate = null;
    }
    this.applyFilter(this.form.controls['search'].value);
  }

  createActivity() {
    this.router.navigate(['/inicio/actividades/crear']);
  }

  ngOnInit() {
    //console.log('Se cargó la vista de Lista de Actividades', this.activityService.roles);
  }

  getStartErr() {
    return this.startErr;
  }
}

/*export interface UserData {
  code: string;
  name: string;
  attendant: string;
}*/

@Injectable()
export class MatPaginatorIntlSpanish extends MatPaginatorIntl {
    itemsPerPageLabel = 'Actividades por página: ';
    nextPageLabel = 'Siguiente Página';
    previousPageLabel = 'Página Anterior';

    getRangeLabel = (page: number, pageSize: number, length: number) => {
      const from = (page * pageSize) + 1;
      const to = ((page * pageSize) + pageSize) >= length ? length : ((page * pageSize) + pageSize);
      const equalMsg = (length + ' de ' + length);
      const result = from == length || from == to || length == 0 ? equalMsg : (from + ' - ' + to + ' de ' + length);
      return result;
    }
}
