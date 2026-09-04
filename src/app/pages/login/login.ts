import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  login(): void {

    this.errorMessage = '';

    if (
      !this.username.trim() ||
      !this.password.trim()
    ) {
      this.toastService.warning(
        'Veuillez saisir votre nom d’utilisateur et votre mot de passe'
      );
      return;
    }

    this.authService
      .login({
        username: this.username.trim(),
        password: this.password
      })
      .subscribe({

        next: (response) => {

          this.authService.saveToken(
            response.token
          );

          localStorage.setItem(
            'role',
            response.role
          );

          this.toastService.success(
            'Connexion réussie'
          );

          this.router.navigate([
            '/dashboard'
          ]);
        },

        error: (err) => {

          console.error(
            'Erreur de connexion',
            err
          );

          this.errorMessage =
            'Nom d’utilisateur ou mot de passe incorrect';

          this.toastService.error(
            this.errorMessage
          );
        }
      });
  }

}
