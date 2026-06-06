import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
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
    private router: Router
  ) {}

  login(): void {
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          alert('Connexion réussie ✅');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log('ERREUR LOGIN = ', err);
          this.errorMessage = 'Nom utilisateur ou mot de passe incorrect';
        },
      });
  }
}
