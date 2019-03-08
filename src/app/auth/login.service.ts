import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { baseURL } from '../comun/baseurl';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import { RestangularModule, Restangular } from 'ngx-restangular';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';
import { JwtService } from '../servicios/jwt.service';
import { Token } from '../modelos/token';

import {TOKEN_NAME, NOMBRE_USUARIO, ID_USUARIO, NOMBRE_COMPLETO_USUARIO, IDENTIFICACION_USUARIO, ROL_USUARIO } from '../comun/constantes';
import { RolService } from '../servicios/rol.service';
import { Role } from '../modelos/role';
import { Permission } from '../modelos/permission';

@Injectable()
export class LoginService {

  sesionIniciada = false;
  idAsignacionSeleccionada: number;
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  @Output() rol: EventEmitter<number> = new EventEmitter();



  constructor(
    private restangular: Restangular,
    public router: Router,
    private jwtService: JwtService,
    private rolService: RolService
  ) { }

  obtenerRol(): any {
    return this.rol;
  }
  actualizarRol(roles: Array<{ idRole: Role[] }>) {
    //Hacer validación en caso de que el usuario no cuente con roles.
    const auxRoles = [];
    roles.forEach(role => {
      auxRoles.push(role.idRole);
    })

    this.rolService.getPermissions(auxRoles)
    .subscribe( res => {
      console.log(res);
      res.forEach(permission => {
        if(permission.idPermission) {
          this.rolService.permissions.forEach(auxPermission => {
            auxPermission.idPermissison == permission.idPermission ?
            null : this.rolService.permissions.push(permission);
          });
        }
      })
    }, err => {
      console.log(err);
    });
    console.log(this.rolService.permissions);
  }

  //
  autenticar(usuario: string, clave: string, rol: number): Observable<any> {
    return this.restangular.one('usuarios/autenticar').get({ usuario: usuario, clave: clave, rol: rol });

  }

  /**
   * Función para almacenar los datos del usuario en localStorage
   * @param token Token JWT
   */
    guardarDatosUsuario(tokenString: string) {
    let token = this.jwtService.decodeToken(tokenString);
    let us = token.usr;
    let parseao = JSON.parse(us);
    //En el objeto anterior se encuentran los resultados de la consulta, deben mapearse correctamente.

    localStorage.setItem(NOMBRE_USUARIO, token.usr);
    localStorage.setItem(NOMBRE_COMPLETO_USUARIO, token.nom);
    localStorage.setItem(IDENTIFICACION_USUARIO, token.ide);
    localStorage.setItem(ID_USUARIO, token.sub);
    this.actualizarRol(parseao.rolebyuserCollection);
    this.setTokenJWT(tokenString);
  }

  obtenerTokenJWT(): string {
    console.log(localStorage.getItem(TOKEN_NAME));
    return localStorage.getItem(TOKEN_NAME);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  setTokenJWT(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  obtenerIdUsuario(): number {
    return +localStorage.getItem(ID_USUARIO);
  }
  obtenerNombreUsuarioAutenticado(): string {
    return localStorage.getItem(NOMBRE_USUARIO);
  }
  obtenerNombreCompletoUsuarioAutenticado(): string {
    return localStorage.getItem(NOMBRE_COMPLETO_USUARIO);
  }
  obtenerIdentificacionUsuarioAutenticado(): string {
    return localStorage.getItem(IDENTIFICACION_USUARIO);
  }
  obtenerIdRolAutenticado(): number {
    return +localStorage.getItem(ROL_USUARIO);
  }

  esSesionIniciada(): boolean {
    let tokenJWT = this.obtenerTokenJWT();
    if (tokenJWT) {
      if(this.jwtService.esTokenValido(tokenJWT)){
        return true
      }else{
        return false;
      }
    }

    return false;
  }

  cerrarSesion(): void {
    //sthis.actualizarRol(0);
    localStorage.clear();
    const navigationExtrasProf: NavigationExtras = {
      queryParamsHandling: 'preserve',
      preserveFragment: true
    };
    this.router.navigate(['/inicio'], navigationExtrasProf);
  }
}
