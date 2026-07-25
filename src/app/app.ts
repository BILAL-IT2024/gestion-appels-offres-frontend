import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Toast } from './shared/toast/toast';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Toast,
    ConfirmDialog
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
