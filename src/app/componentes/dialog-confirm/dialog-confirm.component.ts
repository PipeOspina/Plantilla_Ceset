import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogBudgetItemComponent } from '../dialog-budget-item/dialog-budget-item.component';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  message = 'Esta seguro que desea eliminar el rol x de doña y';
  title = 'Eliminar Rol';
  type = OK_DIALOG;
  acceptBtn = 'Si';

  constructor(private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<DialogBudgetItemComponent>) { }

  ngOnInit() {
    this.data.type ? this.acceptBtn = 'Si' : this.acceptBtn = 'Aceptar';
  }

  close(accepted: boolean) {
    this.dialogRef.close(accepted);
  }

}

export const OK_DIALOG = false;
export const YES_NO_DIALOG = true;
