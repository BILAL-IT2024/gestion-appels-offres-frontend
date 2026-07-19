import {
  Component,
  OnInit
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  DashboardService
} from '../../services/dashboard';

import {
  PaiementService
} from '../../services/paiement';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {

  nombreNotifications = 0;

  constructor(
    private dashboardService: DashboardService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.chargerNotifications();
  }

  chargerNotifications(): void {

    let alertesAO = 0;
    let paiementsEnAttente = 0;

    this.dashboardService
      .getAlertesAppelsOffres()
      .subscribe({
        next: (data) => {

          alertesAO = data.length;

          this.nombreNotifications =
            alertesAO + paiementsEnAttente;
        },
        error: (err) => {
          console.log(
            'Erreur chargement alertes AO',
            err
          );
        }
      });

    this.paiementService
      .getPaiements()
      .subscribe({
        next: (data) => {

          paiementsEnAttente =
            data.filter(
              paiement =>
                paiement.statut === 'EN_ATTENTE'
            ).length;

          this.nombreNotifications =
            alertesAO + paiementsEnAttente;
        },
        error: (err) => {
          console.log(
            'Erreur chargement paiements',
            err
          );
        }
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
