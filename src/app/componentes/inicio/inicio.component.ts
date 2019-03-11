import { Component, OnInit, ChangeDetectorRef, Output } from '@angular/core';
import { RolService, PERMISSIONS } from '../../servicios/rol.service';
import { Rol } from '../../modelos/rol';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoginService } from '../../auth/login.service';
import { Router } from '@angular/router';
import { ActivityService } from '../../servicios/activity.service';
import { AcademicActivity, createNewActivity } from '../../modelos/academicActivity';
import * as XLSX from 'xlsx';
import { FooterComponent } from '../footer/footer.component';
import { RoleComponent } from '../role/role.component';
import { USER_PERMISSIONS } from '../../comun/constantes';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  mobileQuery: MediaQueryList;

  hideActivityList: boolean;
  hideCohortList: boolean;
  hideOther: boolean;

  closedNotification: boolean;
  openedNotification: boolean;
  toggledNotification: boolean;

  scrollShowed: boolean;

  private _mobileQueryListener: () => void;

  constructor(public loginService: LoginService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private rolSs: RolService, public router: Router, private activityService: ActivityService) {
    setTimeout(() => {
      localStorage.getItem(USER_PERMISSIONS) ? this.rolSs.setPermissions(JSON.parse(localStorage.getItem(USER_PERMISSIONS))) : null;
    }, 1000);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Crea 100 usuarios con datos dummies
    const activities: AcademicActivity[] = [];
    for (let i = 1; i <= 100; i++) {
      activities.push(createNewActivity(i));
    }

    //Ordena los datos por fecha
    activities.sort((a, b) => {
      return a.creationDate > b.creationDate ? -1 : a.creationDate == b.creationDate ? 0 : 1;
    });

    //Iguala el servicio de actividades a las actividades dummies para que estén disponibles en toda la aplicación
    activityService.activities = activities;

    this.openedNotification = false;
    this.toggledNotification = false;

    /*this.rolSs.getAll()
    .subscribe(listaRoles => {
      activityService.roles = listaRoles;
    }, error =>{
      activityService.error += error;
    });*/
  }

  getActivity(event?: any) {
    console.log(event, 'Holiwis', this.roles, this.activityService.roles);
  }

  

  displayActivities(): boolean {
    const isPermited = this.rolSs.isPermited;
    return  isPermited[PERMISSIONS.CREAA.id - 1] ||
            isPermited[PERMISSIONS.EDTAA.id - 1] ||
            isPermited[PERMISSIONS.ADJPAA.id - 1] ||
            isPermited[PERMISSIONS.EDJAA.id - 1] ||
            isPermited[PERMISSIONS.CRETAA.id - 1] ||
            isPermited[PERMISSIONS.EDTAA.id - 1] ||
            isPermited[PERMISSIONS.EDTRB.id - 1] ||
            isPermited[PERMISSIONS.GENREPPTO.id - 1] ||
            isPermited[PERMISSIONS.ADDSCT.id - 1] ||
            isPermited[PERMISSIONS.CREGAAA.id - 1] ||
            isPermited[PERMISSIONS.EDTGAAA.id - 1] ||
            isPermited[PERMISSIONS.EDTANALF.id - 1];
  }

  displayCohhorts(): boolean {
    const isPermited = this.rolSs.isPermited;
    return  isPermited[PERMISSIONS.CRECO.id - 1] ||
            isPermited[PERMISSIONS.EDTCO.id - 1] ||
            isPermited[PERMISSIONS.EDTRUBCO.id - 1] ||
            isPermited[PERMISSIONS.EDTGASCO.id - 1] ||
            isPermited[PERMISSIONS.CRGRUCO.id - 1] ||
            isPermited[PERMISSIONS.CONCOR.id - 1] ||
            isPermited[PERMISSIONS.EDTDSCT.id - 1] ||
            isPermited[PERMISSIONS.EDTGRUCO.id - 1];
  }

  displayRoles(): boolean {
    const isPermited = this.rolSs.isPermited;
    return  isPermited[PERMISSIONS.ADDROL.id - 1] ||
            isPermited[PERMISSIONS.QUIROL.id - 1] ||
            isPermited[PERMISSIONS.ADDPER.id - 1] ||
            isPermited[PERMISSIONS.QUIPER.id - 1] ||
            isPermited[PERMISSIONS.CREROL.id - 1];
  }

  ngOnInit() {
    this.hideActivityList = true;
    this.hideCohortList = true;
    this.hideOther = true;
  }

  toggleNotification() {
    if(!this.openedNotification) {
      setTimeout(() => {
        this.openedNotification = true;
      }, 2);
    } else {
      this.openedNotification = false;
    }
  }

  closeNotification() {
    if(this.openedNotification) {
      setTimeout(() => {
        this.openedNotification = false;
      }, 1);
    }
  }

  ngDoCheck() {
    this.scrollShowed = document.getElementById('content').clientHeight < document.getElementById('content').scrollHeight;
  }

  array = [,,,,,,,,,,,,,,,,,,,,,,];

  //Muestra el componente al cual se accede por el menú de navegación
  show(component: number): void {
    switch(component) {
      case 0:
        this.hideActivityList = false;
        this.hideCohortList = true;
        this.hideOther = true;
        break;
      case 1:
        this.hideActivityList = true;
        this.hideCohortList = false;
        this.hideOther = true;
        break;
      case 2:
        this.hideActivityList = true;
        this.hideCohortList = true;
        this.hideOther = false;
        break;
      default:
        break;
    }
  }

  toggleDrawer(drawer) : void {
    drawer.opened ? drawer.toggle() : null;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  goToStart(drawer?) {
    this.router.navigate(['inicio']);
    drawer ? this.toggleDrawer(drawer) : null;
  }

  onFileChange(evt: any) {
    let data;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws, {header: 1});
      console.log(data);
    };
    reader.readAsBinaryString(target.files[0]);
    console.log(data);
  }

  roles: Rol[];
  rol: Rol;
  error: any;

}
