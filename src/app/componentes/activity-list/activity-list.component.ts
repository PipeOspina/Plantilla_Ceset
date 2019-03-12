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
    this.router.navigate(['/inicio/portafolio/editar/' + row.id]);
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

  getToday(): Date {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  }

  applyFilter(filterValue: string) {
    filterValue ? this.searched = true : this.searched = false;
    const filterNumber: number = !isNaN(parseInt(filterValue)) ? parseInt(filterValue) : 0;

    const today = this.getToday();

    let filteredActivities: AcademicActivity[] = [];

    if(this.startDate > today || this.finishDate > today || (!this.startDate && !this.finishDate)) {
      if(filterNumber == 0) {
        filteredActivities = this.activities;
      } else {
        this.activities.forEach(activity => {
          activity.id.toString().startsWith(filterNumber.toString()) ? filteredActivities.push(activity) : null;
          filteredActivities.sort((a, b) => {
            return a.id > b.id ? 1 : a.id == b.id ? 0 : -1;
          });
        });
      }
    } else {
      this.activities.forEach(activity => {
        if( (activity.creationDate >= this.startDate && activity.creationDate <= this.finishDate) ||
            (activity.creationDate >= this.startDate && !this.finishDate) ||
            (activity.creationDate <= this.finishDate && !this.startDate)) {
              if(filterNumber == 0) {
                filteredActivities.push(activity);
              } else if(activity.id.toString().startsWith(filterNumber.toString())) {
                filteredActivities.push(activity);
                filteredActivities.sort((a, b) => {
                  return a.id > b.id ? 1 : a.id == b.id ? 0 : -1;
                });
              }
        }
      });
    }

    this.sortDataTable(filteredActivities, filterValue);
  }

  sortDataTable(filteredActivities: AcademicActivity[], value: string) {
    this.dataSource = new MatTableDataSource(filteredActivities);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    value = value.trim(); // Remove whitespace
    value = value.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = value;
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
    this.router.navigate(['/inicio/portafolio/crear']);
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
