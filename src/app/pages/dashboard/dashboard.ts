import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { DashboardService, DashboardStats } from '../../services/dashboard';
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
  chart: any;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chargerStats();
      this.chargerChiffreAffaireMensuel();
    }, 100);
  }

  chargerStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        console.log('STATS DASHBOARD = ', data);
        this.stats = data;
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
}
