import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import {
  DashboardService,
  DashboardStats,
  DashboardDas,
  AlerteAppelOffre,
  TopClient
} from '../../services/dashboard';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DecimalPipe, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class DashboardComponent implements OnInit {

  stats?: DashboardStats;
  alertes: AlerteAppelOffre[] = [];
  topClients: TopClient[] = [];
  statsDas: DashboardDas[] = [];

  // =========================================================
  // FILTRE PAR PERIODE
  // =========================================================

  anneeSelectionnee: number = new Date().getFullYear();
  moisSelectionne: number | null = null;

  annees: number[] = [
    2026,
    2025,
    2024,
    2023
  ];

  mois = [
    { numero: 1, nom: 'Janvier' },
    { numero: 2, nom: 'Février' },
    { numero: 3, nom: 'Mars' },
    { numero: 4, nom: 'Avril' },
    { numero: 5, nom: 'Mai' },
    { numero: 6, nom: 'Juin' },
    { numero: 7, nom: 'Juillet' },
    { numero: 8, nom: 'Août' },
    { numero: 9, nom: 'Septembre' },
    { numero: 10, nom: 'Octobre' },
    { numero: 11, nom: 'Novembre' },
    { numero: 12, nom: 'Décembre' }
  ];

  topClientsChart: any;
  chart: any;
  statutChart: any;
  dasChart: any;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chargerStats();
      this.chargerStatsDas();
      this.chargerChiffreAffaireMensuel();
      this.chargerAlertes();
      this.chargerTopClients();
    }, 100);
  }

  chargerStats(): void {

    this.dashboardService
      .getStats(
        this.anneeSelectionnee,
        this.moisSelectionne ?? undefined
      )
      .subscribe({

        next: (data) => {

          console.log('STATS DASHBOARD = ', data);

          this.stats = data;

          this.creerGraphiqueStatuts(data);

          this.cd.detectChanges();
        },

        error: (err) => {

          console.log(
            'Erreur dashboard stats',
            err
          );
        }

      });
  }

  changerPeriode(): void {
    this.chargerStats();
  }

  selectionnerVueAnnuelle(): void {
    this.moisSelectionne = null;
    this.chargerStats();
  }

  get libellePeriode(): string {

    if (this.moisSelectionne === null) {
      return `Vue annuelle — ${this.anneeSelectionnee}`;
    }

    const mois = this.mois.find(
      m => m.numero === Number(this.moisSelectionne)
    );

    return `Vue mensuelle — ${mois?.nom ?? ''} ${this.anneeSelectionnee}`;
  }

  chargerStatsDas(): void {

    this.dashboardService
      .getStatsDas()
      .subscribe({

        next: (data) => {

          console.log(
            'STATS DAS = ',
            data
          );

          this.statsDas = data;
          this.creerGraphiqueDas(data);

          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement statistiques DAS',
            err
          );
        }

      });
  }

  chargerChiffreAffaireMensuel(): void {
    this.dashboardService.getChiffreAffaireMensuel().subscribe({
      next: (data) => {

        console.log('CA MENSUEL = ', data);

        const nomsMois = [
          '',
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Juin',
          'Juil',
          'Août',
          'Sep',
          'Oct',
          'Nov',
          'Déc'
        ];

        const moisLabels = data.map(
          item => `${nomsMois[item.mois]} ${item.annee}`
        );
        const montants = data.map(item => item.total);

        setTimeout(() => {

          if (this.chart) {
            this.chart.destroy();
          }

          this.chart = new Chart('caMensuelChart', {
            type: 'bar',
            data: {
              labels: moisLabels,
              datasets: [
                {
                  label: 'Chiffre d’affaires mensuel',
                  data: montants
                }
              ]
            }
          });

        }, 500);

      },
      error: (err) => {
        console.log('Erreur CA mensuel', err);
      }
    });
  }

chargerAlertes(): void {
  this.dashboardService.getAlertesAppelsOffres().subscribe({
    next: (data) => {
      this.alertes = data;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.log('Erreur alertes AO', err);
    }
  });
}

creerGraphiqueStatuts(stats: DashboardStats): void {

  setTimeout(() => {

    if (this.statutChart) {
      this.statutChart.destroy();
    }

    this.statutChart = new Chart('statutChart', {
      type: 'doughnut',
      data: {
        labels: ['Adjugés', 'En cours', 'Annulés'],
        datasets: [
          {
            label: 'Appels d’offres',
            data: [
              stats.aoAdjuges,
              stats.aoEnCours,
              stats.aoAnnules
            ],
            backgroundColor: [
              '#22c55e',
              '#f59e0b',
              '#ef4444'
            ],
            borderWidth: 2,
            hoverOffset: 20
          }
        ]
      }
    });

  }, 500);
}

chargerTopClients(): void {

  this.dashboardService.getTopClients().subscribe({
    next: (data) => {

      console.log('TOP CLIENTS = ', data);

      this.topClients = data;

      const labels = data.map(c => c.client);
      const valeurs = data.map(c => c.total);

      setTimeout(() => {

        if (this.topClientsChart) {
          this.topClientsChart.destroy();
        }

        this.topClientsChart = new Chart('topClientsChart', {
          type: 'bar',

          data: {
            labels: labels,

            datasets: [
              {
                label: 'Top Clients',
                data: valeurs,
                backgroundColor: '#2563eb',
                borderRadius: 12,
                borderSkipped: false
              }
            ]
          },

          options: {
            responsive: true,

            plugins: {
              legend: {
                display: false
              }
            }
          }
        });

      }, 500);

    },

    error: (err) => {
      console.log('Erreur top clients', err);
    }
  });

}

creerGraphiqueDas(data: DashboardDas[]): void {

  setTimeout(() => {

    if (this.dasChart) {
      this.dasChart.destroy();
    }

    this.dasChart = new Chart('dasChart', {
      type: 'bar',

      data: {
        labels: data.map(item => item.das),

        datasets: [
          {
            label: 'Commandes',
            data: data.map(item => item.montantCommandes)
          },
          {
            label: 'Facturé',
            data: data.map(item => item.montantFacture)
          },
          {
            label: 'Encaissé',
            data: data.map(item => item.montantEncaisse)
          }
        ]
      }
    });

  }, 500);
}

}
