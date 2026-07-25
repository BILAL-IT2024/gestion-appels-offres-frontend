import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogData {

  title: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  onConfirm: () => void;

}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private dialogSubject =
    new BehaviorSubject<ConfirmDialogData | null>(null);

  dialog$ = this.dialogSubject.asObservable();

  open(dialog: ConfirmDialogData): void {

    this.dialogSubject.next(dialog);

  }

  close(): void {

    this.dialogSubject.next(null);

  }

}
