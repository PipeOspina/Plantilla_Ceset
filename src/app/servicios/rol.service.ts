import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Rol } from '../modelos/rol';
import { Permission } from '../modelos/permission';

@Injectable()
export class RolService {

  constructor(private restangular: Restangular) { }

  permissions: Permission[] = [{idPermissison: 0, shortDescription: '', description: ''}];

  getAll(): Observable<Rol[]>{
    return this.restangular.all('rol').getList();
  }

  getById(id: number): Observable<Rol> {
    return this.restangular.one('rol', id).get();
  }

  create(rol: Rol) {
    this.restangular
    .all('rol')
    .post(rol);
  }

  getPermissions(roles: any): Observable<any> {
    return this.restangular
      .all('rol/permisos')
      .post(roles);
  }
}
