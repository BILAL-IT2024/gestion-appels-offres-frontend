import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { forkJoin } from 'rxjs';

import {
  DashboardService
} from '../../services/dashboard';

import {
  PaiementService
} from '../../services/paiement';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {

  nombreNotifications = 0;
  currentUsername = '';
  isAdmin = false;

  constructor(
    private dashboardService: DashboardService,
    private paiementService: PaiementService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.lireUtilisateurConnecte();

    this.chargerNotifications();
  }

  chargerNotifications(): void {

    forkJoin({
      alertesAO:
        this.dashboardService
          .getAlertesAppelsOffres(),

      paiements:
        this.paiementService
          .getPaiements()
    }).subscribe({

      next: ({
        alertesAO,
        paiements
      }) => {

        const nombreAlertesAO =
          alertesAO.length;

        const nombrePaiementsEnAttente =
          paiements.filter(
            paiement =>
              paiement.statut
                ?.trim()
                .toUpperCase() ===
              'EN_ATTENTE'
          ).length;

        this.nombreNotifications =
          nombreAlertesAO +
          nombrePaiementsEnAttente;

        this.cd.detectChanges();
      },

      error: (err) => {

        console.error(
          'Erreur chargement notifications sidebar',
          err
        );

        this.nombreNotifications = 0;

        this.cd.detectChanges();
      }
    });
  }

  sidebarCollapsed = true;

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigateByUrl('/login');
  }

  private lireUtilisateurConnecte(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      this.currentUsername =
        payload.sub || '';

      this.isAdmin =
        localStorage.getItem('role') === 'ADMIN';

    } catch {

      this.currentUsername = '';
      this.isAdmin = false;
    }
  }

}
