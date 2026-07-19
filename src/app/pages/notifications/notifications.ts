import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  AlerteAppelOffre,
  DashboardService
} from '../../services/dashboard';

import {
  PaiementService
} from '../../services/paiement';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  alertesAO: AlerteAppelOffre[] = [];

  paiementsEnAttente: any[] = [];

  chargement = true;

  constructor(
    private dashboardService: DashboardService,
    private paiementService: PaiementService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerNotifications();
  }

  chargerNotifications(): void {

    this.chargement = true;

    this.dashboardService
      .getAlertesAppelsOffres()
      .subscribe({
        next: (data) => {
          this.alertesAO = data;
          this.verifierFinChargement();
        },
        error: (err) => {
          console.error(
            'Erreur chargement alertes AO',
            err
          );

          this.alertesAO = [];
          this.verifierFinChargement();
        }
      });

    this.paiementService
      .getPaiements()
      .subscribe({
        next: (data) => {

          this.paiementsEnAttente =
            data.filter(
              paiement =>
                paiement.statut === 'EN_ATTENTE'
            );

          this.verifierFinChargement();
        },
        error: (err) => {
          console.error(
            'Erreur chargement paiements',
            err
          );

          this.paiementsEnAttente = [];
          this.verifierFinChargement();
        }
      });
  }

  private verifierFinChargement(): void {

    this.chargement = false;

    this.cd.detectChanges();
  }

  get nombreTotalNotifications(): number {

    return (
      this.alertesAO.length +
      this.paiementsEnAttente.length
    );
  }
}
