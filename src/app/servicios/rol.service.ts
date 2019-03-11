import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Rol } from '../modelos/rol';
import { Permission } from '../modelos/permission';
import { USER_PERMISSIONS } from '../comun/constantes';

@Injectable()
export class RolService {

  constructor(private restangular: Restangular) { }

  permissions: Permission[] = [{idPermissison: 0, shortDescription: '', description: ''}];
  permissionIds: number[] = [];
  isPermited: boolean[] = [];

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
    console.log('Llega a getPermissions(), restangular');
    return this.restangular
      .all('rol/permisos')
      .post(roles);
  }

  pushPermission(permission) {
    this.permissionIds.push(permission.idPermission);
    const auxPermission = JSON.stringify(this.permissionIds);
    localStorage.setItem(USER_PERMISSIONS, auxPermission);
    console.log('En el rolService, pushPermission(), auxPermission: ' + auxPermission);
  }

  setPermissions(permissions) {
    this.permissionIds = permissions;
    for(let i = 0; i < 25; i++) {
      this.permissionIds.forEach(id => {
        id == (i + 1) ? this.isPermited[i] = true : this.isPermited[i] = false;
      })
    }
    console.log('En el rolService, setPermissions(), permissions: ' + permissions);
  }
}

export const PERMISSIONS = {
  CREAA: {
    id: 1,
    description: 'Crear Actividad Académica'
  },
  EDTAA: {
    id: 2,
    description: 'Editar actividad académica'
  },
  ADJPAA: {
    id: 3,
    description: 'Adjuntar presupuesto a activad académica'
  },
  EDJAA: {
    id: 4,
    description: 'Editar presupuesto adjuntado'
  },
  CRECO: {
    id: 5,
    description: 'Crear Cohorte'
  },
  EDTCO: {
    id: 6,
    description: 'Editar Cohorte'
  },
  CRETAA: {
    id: 7,
    description: 'Crear Tema a actividad académica'
  },
  EDTTAA: {
    id: 8,
    description: 'Editar tema a actividad académica'
  },
  EDTRB: {
    id: 9,
    description: 'Editar Rubro'
  },
  GENREPPTO: {
    id: 10,
    description: 'Generar reporte de presupuesto'
  },
  ADDSCT: {
    id: 11,
    description: 'Agregar descuentos'
  },
  CREGAAA: {
    id: 12,
    description: 'Crear gasto a actividad académica'
  },
  EDTGAAA: {
    id: 13,
    description: 'Editar gasto a actividad académica'
  },
  EDTANALF: {
    id: 14,
    description: 'Editar Análisis financiero'
  },
  ADDROL: {
    id: 15,
    description: 'Agregar Roles a usuarios'
  },

  QUIROL: {
    id: 16,
    description: 'Quitar Roles a usuarios'
  },
  ADDPER: {
    id: 17,
    description: 'Agregar permisos a roles'
  },
  QUIPER: {
    id: 18,
    description: 'Quitar permisos a roles'
  },
  CREROL: {
    id: 19,
    description: 'Crear roles'
  },
  EDTRUBCO: {
    id: 20,
    description: 'Editar rubros de cohorte'
  },
  EDTGASCO: {
    id: 21,
    description: 'Editar gastos de cohorte'
  },
  CRGRUCO: {
    id: 22,
    description: 'Crear Grupo en Cohorte'
  },
  CONCOR: {
    id: 23,
    description: 'Contratar en cohorte'
  },
  EDTDSCT: {
    id: 24,
    description: 'Editar descuentos'
  },
  EDTGRUCO: {
    id: 25,
    description: 'Editar Grupo en Cohorte'
  },
}