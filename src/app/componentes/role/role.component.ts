import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { User, createNewUser, ID_TYPES } from '../../modelos/user';
import { Role, ROLES } from '../../modelos/role';
import { DialogBudgetItemComponent } from '../dialog-budget-item/dialog-budget-item.component';
import { DialogConfirmComponent, YES_NO_DIALOG, OK_DIALOG } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    search: new FormControl(),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    id: new FormControl('', [Validators.required]),
    idType: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  myControl: FormControl = new FormControl();

  dataSource: MatTableDataSource<User>;

  filteredOptions: Observable<User[]>;
  optionId: number[] = [];

  userSelected: boolean;
  requestedRole: boolean;

  user: User;

  roles: Role[];

  idTypes = ID_TYPES;

  ngOnInit() {
    let options: User[] = [];
    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      options[i] = this.dataSource.filteredData[i];
    }
    this.filteredOptions = Observable.of(options);
    this.userSelected = false;
    this.requestedRole = false;
  }

  chargeView(option: User, value?: string) {
    if(value !== 'Crear Usuario') {
      this.userSelected = true;
      this.user = option;
      this.roles = option.role;
      this.form.controls['name'].setValue(option.name);
      this.form.controls['lastName'].setValue(option.lastName);
      this.form.controls['id'].setValue(option.id);
      this.form.controls['email'].setValue(option.email);
      this.form.controls['idType'].setValue(option.idType);
      this.requestedRole = option.roleRequest != null;
      console.log(this.user.roleRequest);
    } else {
      this.userSelected = false;
      this.requestedRole = false;
      this.goToRegister();
    }
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        message: `Esta seguro que desea eliminar al usuario ${this.form.controls.name.value} ${this.form.controls.lastName.value}`,
        type: YES_NO_DIALOG,
        title: 'Eliminar Usuario'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      res ? this.dialog.open(DialogConfirmComponent, {
        data: {
          title: `Usuario Eliminado`,
          message: `El usuario ${this.form.controls.name.value} ${this.form.controls.lastName.value} se eliminará pronto`,
          type: OK_DIALOG
        }
      }) : '';
    }, err => {
      console.log(err);
    });
  }

  acceptRequest() {
    this.roles.push(this.user.roleRequest.role);
    this.requestedRole = false;
  }

  denyRequest() {
    this.requestedRole = false;
  }

  deleteRole(role: Role) {
    for(let i = 0; i < this.roles.length; i++) {
      this.roles[i] === role ? this.roles.splice(i, 1) : null;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    const datas = this.dataSource.filter;
    console.log(this.dataSource.filteredData[0]);
    let options: User[] = [];
    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      options[i] = this.dataSource.filteredData[i];
    }
    this.filteredOptions = (typeof options !== 'undefined' && options.length > 0) ?
    Observable.of(options) : Observable.of([createNewUser(999999999999, 'Crear Usuario...')]);
  }

  goToRegister() {
    this.router.navigate(['registro']);
  }

  goToCreateRole() {
    console.log();
  }

  clearData() {
    this.form.controls['search'].setValue('');
    this.userSelected = false;
  }

  constructor(private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private el: ElementRef) {
    // Create 100 users
    const users: User[] = [];
    for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }

  getElRef(): ElementRef {
    return this.el;
  }

}
