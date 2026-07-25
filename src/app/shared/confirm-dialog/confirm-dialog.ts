import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  ConfirmDialogData,
  ConfirmDialogService
} from '../../services/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog implements OnInit, OnDestroy {

  dialog: ConfirmDialogData | null = null;

  private subscription?: Subscription;

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.confirmDialogService.dialog$
        .subscribe((dialog) => {

          this.dialog = dialog;

          this.cd.detectChanges();
        });
  }

  confirmer(): void {

    if (!this.dialog) {
      return;
    }

    const action = this.dialog.onConfirm;

    this.confirmDialogService.close();

    action();
  }

  annuler(): void {
    this.confirmDialogService.close();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
