import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  ToastMessage,
  ToastService
} from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast implements OnInit, OnDestroy {

  toast: ToastMessage | null = null;

  private subscription?: Subscription;

  constructor(
    private toastService: ToastService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.subscription =
      this.toastService.toast$
        .subscribe((message) => {

          this.toast = message;

          this.cd.detectChanges();
        });
  }

  fermer(): void {
    this.toastService.hide();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
