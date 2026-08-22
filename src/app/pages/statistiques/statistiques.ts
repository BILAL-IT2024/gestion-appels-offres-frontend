import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  DashboardService,
  DashboardDas,
  ChiffreAffaireMensuel,
  TopClient
} from '../../services/dashboard';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    SidebarComponent,
    DecimalPipe
  ],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css'
})
export class Statistiques implements OnInit {

  statsDas: DashboardDas[] = [];
  chiffreAffaireMensuel: ChiffreAffaireMensuel[] = [];
  topClients: TopClient[] = [];

  dasChart: any;
  caChart: any;
  clientsChart: any;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.chargerStatsDas();

    this.chargerChiffreAffaireMensuel();

    this.chargerTopClients();
  }

  chargerStatsDas(): void {

    this.dashboardService.getStatsDas().subscribe({
      next: (data) => {
        this.statsDas = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur stats DAS', err);
      }
    });
  }

  chargerChiffreAffaireMensuel(): void {

    this.dashboardService.getChiffreAffaireMensuel().subscribe({
      next: (data) => {
        this.chiffreAffaireMensuel = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur CA mensuel', err);
      }
    });
  }

  chargerTopClients(): void {

    this.dashboardService.getTopClients().subscribe({
      next: (data) => {
        this.topClients = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur top clients', err);
      }
    });
  }

}
