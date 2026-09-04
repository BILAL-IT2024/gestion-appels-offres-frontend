import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.css',
})
export class Utilisateurs implements OnInit {

  private apiUrl = 'http://localhost:9090/api';

  utilisateurs: any[] = [];

  username = '';
  password = '';
  role = 'USER';

  message = '';
  erreur = '';
  currentUsername = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.getCurrentUsername();
    this.chargerUtilisateurs();
  }

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private getCurrentUsername(): string {

    const token = localStorage.getItem('token');

    if (!token) {
      return '';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || '';
    } catch {
      return '';
    }
  }

  chargerUtilisateurs(): void {

    this.erreur = '';

    console.log('Chargement des utilisateurs...');

    this.http.get<any[]>(
      `${this.apiUrl}/users`,
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: (data) => {
        console.log('Utilisateurs reçus :', data);
        this.utilisateurs = data;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erreur utilisateurs :', err);
        this.erreur = 'Erreur chargement utilisateurs - HTTP ' + err.status;
        this.cdr.detectChanges();
      }

    });
  }

  creerUtilisateur(): void {

    this.message = '';
    this.erreur = '';

    if (!this.username || !this.password || !this.role) {
      this.erreur = 'Veuillez remplir tous les champs';
      return;
    }

    const utilisateur = {
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.http.post(
      `${this.apiUrl}/auth/register`,
      utilisateur,
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: () => {

        this.message = 'Utilisateur créé avec succès';

        this.username = '';
        this.password = '';
        this.role = 'USER';

        this.chargerUtilisateurs();
      },

      error: () => {
        this.erreur = 'Erreur lors de la création de l’utilisateur';
      }

    });
  }

  changerRole(id: number, role: string): void {

    this.message = '';
    this.erreur = '';

    this.http.put(
      `${this.apiUrl}/users/${id}/role?role=${role}`,
      {},
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: () => {
        this.message = 'Rôle modifié avec succès';
        this.chargerUtilisateurs();
      },

      error: (err) => {

        if (err.error?.message) {
          this.erreur = err.error.message;
        } else {
          this.erreur = 'Erreur lors de la modification du rôle';
        }

        // Remet le vrai rôle après un refus du backend
        this.chargerUtilisateurs();
        this.cdr.detectChanges();
      }

    });
  }

  supprimerUtilisateur(id: number): void {

    this.message = '';
    this.erreur = '';

    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    this.http.delete(
      `${this.apiUrl}/users/${id}`,
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: () => {
        this.message = 'Utilisateur supprimé avec succès';
        this.chargerUtilisateurs();
      },

      error: (err) => {

        if (err.error?.message) {
          this.erreur = err.error.message;
        } else {
          this.erreur = 'Impossible de supprimer cet utilisateur';
        }

        this.cdr.detectChanges();
      }

    });
  }

}
