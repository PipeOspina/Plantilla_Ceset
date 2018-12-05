import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Person } from '../modelos/person';

@Injectable()
export class PersonService {

  constructor(private restangular: Restangular) { }
  
  getAll(): Observable<Person[]>{
    return this.restangular.all('person').getList();
  }

  getById(id: number): Observable<Person> {
    return this.restangular.one('person', id).get();
  }

  create(person: Person) {
    this.restangular
    .all('usuarios')
    .post(person);
  }

}
