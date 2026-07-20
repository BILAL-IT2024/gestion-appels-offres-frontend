import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject =
    new BehaviorSubject<ToastMessage | null>(null);

  toast$ = this.toastSubject.asObservable();

  private timeoutId?: ReturnType<typeof setTimeout>;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  hide(): void {
    this.toastSubject.next(null);
  }

  private show(
    message: string,
    type: ToastType
  ): void {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toastSubject.next({
      message,
      type
    });

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, 3500);
  }
}
