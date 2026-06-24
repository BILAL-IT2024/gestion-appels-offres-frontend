import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import {
  DashboardService,
  DashboardStats,
  AlerteAppelOffre,
  TopClient
} from '../../services/dashboard';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  stats?: DashboardStats;
  alertes: AlerteAppelOffre[] = [];
  topClients: TopClient[] = [];
  topClientsChart: any;
  chart: any;
  statutChart: any;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chargerStats();
      this.chargerChiffreAffaireMensuel();
      this.chargerAlertes();
      this.chargerTopClients();
    }, 100);
  }

  chargerStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('STATS DASHBOARD = ', data);
        this.stats = data;
        this.creerGraphiqueStatuts(data);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur dashboard stats', err);
      }
    });
  }

  chargerChiffreAffaireMensuel(): void {
    this.dashboardService.getChiffreAffaireMensuel().subscribe({
      next: (data) => {

        console.log('CA MENSUEL = ', data);

        const moisLabels = data.map(item => 'Mois ' + item.mois);
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
      type: 'pie',
      data: {
        labels: ['Adjugés', 'En cours', 'Annulés'],
        datasets: [
          {
            label: 'Appels d’offres',
            data: [
              stats.aoAdjuges,
              stats.aoEnCours,
              stats.aoAnnules
            ]
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
                data: valeurs
              }
            ]
          }
        });

      }, 500);

    },
    error: (err) => {
      console.log('Erreur top clients', err);
    }
  });

}

}
