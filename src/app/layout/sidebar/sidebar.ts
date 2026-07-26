import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
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

  constructor(
    private dashboardService: DashboardService,
    private paiementService: PaiementService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
